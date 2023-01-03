import React, {useState, useEffect} from 'react'
import SidePanel from './SidePanel.js'
import MainContainer from './MainContainer.js'
import ModLoader from './ModLoader.js'

import { invoke } from '@tauri-apps/api'
import { exists, readDir, writeTextFile, readTextFile, createDir, BaseDirectory } from '@tauri-apps/api/fs'
import { join, appConfigDir } from '@tauri-apps/api/path'
import { getClient } from '@tauri-apps/api/http'
import { ask } from '@tauri-apps/api/dialog'
import { relaunch } from '@tauri-apps/api/process'
import { listen } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/api/shell'

const promptRestart = async (text) => {
    if(await ask(text)){
        await relaunch()
    }
}

//START OF PROGRAM (BACKEND)
//Login logic is located at SidePanel.js !!
//Update game and Launch Game logic is located at LoggedInPanel.js !!
const mainStart = async () => {
    console.log('%c    START OF PROGRAM EXECUTION    ', 'background-color: black; color: lime;')
    // Creates the data and mod folder if it does not exist
    await createDir('data', { dir: BaseDirectory.AppData, recursive: true })
    await createDir('mod', { dir: BaseDirectory.AppData, recursive: true })

    //gets directory of game file and mod json file
    const appDir = await appConfigDir()
    const gamepath = await join(appDir, 'data', 'pb2_re34.swf')
    const modDir = await join(appDir, 'mod')

    //For debugging purposes
    console.group('List of Directories')
    console.log(`$APPDATA: ${appDir}`)
    console.log(`Mod folder: ${modDir}`)
    console.log(`Game file: ${gamepath}`)
    console.groupEnd()

    await updateGame()
    const updatedJson = await updateMod()

    return updatedJson
}

// 1. Checks if the main PB2 swf file exist in the Data dir
// 2. If it exist, check if the game is updated by comparing the filesize between the local file and the one on the server (using HEAD method)
// 3. If outdated or does not exist, download the PB2 swf file from PB2 server.
// 4. Prompts user to restart client if an error occured during downloading.
const updateGame = async () => {
    //gets directory of game file
    const appDir = await appConfigDir()
    const filepath = await join(appDir, 'data', 'pb2_re34.swf')

    console.log('Checking up on the main game file..')
    const client = await getClient()
    //checks if main game swf file exist.
    if(await exists(filepath))
    {
        //get filesize from server ---
        let response
        try{
            response = await client.request({
                method: 'HEAD',
                url: 'https://www.plazmaburst2.com/pb2/pb2_re34.swf',
            })
        }
        catch(err){
            console.log(`Error when attempting to send HEAD request:\n${err}`)
            await promptRestart('Failed to download / reupdate the game. This may be due to missing internet connection or that the PB2 server is temporarily down.\n\nDo you want to restart the application?')
            return false
        }

        const serverFileSize = response.headers['content-length']
        //console.log(`Server game file's size: ${serverFileSize}`)

        //get local filesize by invoking tauri command ---
        const localFileSize = await invoke("get_filesize", {filepath: filepath})
        //console.log(`Local game file's size: ${localFileSize}`)

        //check if game is updated
        if(serverFileSize === localFileSize.toString()){
            console.log('Game is already updated.')
            return true
        }
        //update the game due to different filesize
        console.log(`Difference in file size.\nLocal filesize:${localFileSize}\nServer filesize:${serverFileSize}\nUpdating game..`)
    }

    try{
        await invoke("download_game", {filepath: filepath})
        console.log("Game sucessfully updated.")
        return true
    }
    catch(err){
        console.log(`Error in updating game.\n${err}`)
        await promptRestart('Failed to download / reupdate the game. This may be due to missing internet connection or that the PB2 server is temporarily down.\n\nDo you want to restart the application?')
        return false
    }
}

const getTodayDate = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    let mm = today.getMonth() + 1 // Months start at 0!
    let dd = today.getDate()

    let hh = today.getHours()
    let min = today.getMinutes()
    let ss = today.getSeconds()

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm
    if (hh < 10) hh = '0' + hh
    if (min < 10) min = '0' + min
    if (ss < 10) ss = '0' + ss

    return `[${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}]`
}

// 1. Check if the JSON file exist (metadata that describes all the mods). If it doesn't, create a new JSON file. 
// 2. Retrieve and parse JSON information in JSON file.
// 3. Scans through the entire mod folder, capturing the information of all the .swf files present. Ignores other files.
// 4. Create a new JSON and mirror information from mod folder, appending existing information from previous JSON if there is.
// 5. Return object mirroring the information in JSON file for frontend to render.
const updateMod = async () => {
    console.log('Re-updating the mod json file..')
    const defaultGames = [
        {
            name: 'Plazma Burst 2 (Original)', 
            author: 'Eric Gurt',
            description: 'Original game developed by Eric Gurt and released on 2011, this game serves as a sequel to the Plazma Burst Forward To The Past.',
            filename: '<default>'
        },
    ]

    const appDir = await appConfigDir()
    const filepath = await join(appDir, 'mod.json')
    const modDir = await join(appDir, 'mod')

    //1. check if json file exist.
    if(!await exists(filepath)){
        await writeTextFile(filepath, JSON.stringify(defaultGames))
    }

    //2. retrieve information from json file.
    const jsonFile = await readTextFile(filepath)

    //object containing mod info
    let gamesJson
    try{
        gamesJson = JSON.parse(jsonFile)

        if(!gamesJson.length){
            console.log('Mod JSON empty! Recreating the JSON file.')
            gamesJson = defaultGames
        }
    }
    catch{
        console.log('Failed to parse JSON mod metadata. Recreating the JSON file.')
        await writeTextFile(filepath, JSON.stringify(defaultGames))
        gamesJson = defaultGames
    }

    //3. scans thru directory
    const dirFiles = await readDir(modDir)

    //adding the standard PB2 game at the start of the new json, to be returned for rendering purpose.
    let updatedJson = [gamesJson[0]]

    //4. appending files with relevant information to the new json
    for(let file of dirFiles){
        //match is either an empty array or an array with a single element. this is to match whether the listed games in json is in the file dir. 
        //we filter this to remove deleted games, with information still residing in the json file
        let match = gamesJson.filter(game => game.filename === file.name)

        //skip if its not a .swf file
        if(!file.name.endsWith('.swf')) continue

        //if json contains information of the file found in dir
        if(match.length){
            updatedJson.push({
                name: match[0].name,
                author: match[0].author,
                description: match[0].description,
                filename: match[0].filename
            })
        }
        else{
            updatedJson.push({
                name: file.name,
                author: 'recently added',
                description: `${getTodayDate()} Recently added this mod.`,
                filename: file.name
            })
        }
    }

    return updatedJson
}

//saves new changes to mod json
const saveJson = async (games) => {
    if(games.length){
        const appDir = await appConfigDir()
        const modDir =  await join(appDir, 'mod.json')
    
        writeTextFile(modDir, JSON.stringify(games))
    }
}

//---- FRONTEND LOGIC ----
//Global variable to persistently store the timeout variable, to be used for debounce functionality
let timeout

const App = () => {
    //games JSON for rendering and to be stored in mod.main JSON file. starts of as [], to indicate that it is still loading.
    const [games, setGames] = useState([])

    //debounced version of the games JSON . this state is not for display and is not updated for every input change. 
    //this is useful to periodically write to the mod JSON (useEffect) where we don't want to update for every input change
    const [debouncedGames, setDebouncedGames] = useState([])

    //boolean indicating whether to show mod loader overlay
    const [showLoader, setShowLoader] = useState(false)

    //to indicate which game is selected
    const [active, setActive] = useState(0)

    //close / open the mod loader menu
    const showLoaderHandle = async (toShow) => {
        setShowLoader(toShow)
    }
    
    //handles click event when one selects a new mod. 
    const handleClick = (index) => {
        setActive(index)
    }

    //handles the change of information of a specfic mod @ the Edit Table
    //index indicates which mod we are changing, type indicate which field (name, author..) we are changing
    const onChange = (index, type, value) => {
        let copyGames = [...games]
        copyGames[index][type] = value
        setGames(copyGames)

        debouncedOnChange()
    }

    //debouncing setDebouncedGames function, to be called once
    const debouncedOnChange = (function(){
        return () => {
            //debouncing the callback function
            window.clearTimeout(timeout)

            timeout = window.setTimeout(() => {
                setDebouncedGames(games)
            }, 500);
        }
    })()

    //handles opening of the mod folder.
    const openModFolder = async () => {
        const appDir = await appConfigDir()
        const modDir = await join(appDir, 'mod')
        //console.log(modDir)
        await open(modDir)
    }

    //PROGRAM STARTS HERE, ONCE FRONTEND IS LOADED. 
    useEffect(() => {
        //useEffect does not take in async callback func as it expects a return function
        const fn = async () => {
            //start the main backend work
            const games = await mainStart()
            setGames(games)
            setDebouncedGames(games)
        }
        fn()
    },[])

    //update when there is new information (debounced) to be updated to the mods json
    useEffect(() => {
        //periodically save updates to the json file
        saveJson(debouncedGames)

        const unlisten = listen('mod_fs_change', async (e) => {
            //save the current info of the game first, to save any changes
            saveJson(debouncedGames)
            //once done saving changes, check the mod folder for changes
            .then(async () => {
                const updatedGames = await updateMod()
                //reset active game to the 1st game
                setActive(0)

                setGames(updatedGames)
                setDebouncedGames(updatedGames)
            })
        })
    
        return () => {
            unlisten.then(f => f());
        }

    },[debouncedGames])

    const showLoaderElement = showLoader ? 
    <ModLoader openModFolder={openModFolder} active={active} games={games} onChange={onChange} handleClick={handleClick} showLoaderHandle={showLoaderHandle} /> 
    : null
    
    return (
        <div id='body'>
            {showLoaderElement}<SidePanel updateGame={updateGame} game={games[active]} showLoaderHandle={showLoaderHandle}/> <MainContainer /> 
        </div>
    )
}

export default App