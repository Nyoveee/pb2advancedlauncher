import { exists } from '@tauri-apps/api/fs'
import { join, appConfigDir } from '@tauri-apps/api/path'
import { ask } from '@tauri-apps/api/dialog'
import { relaunch } from '@tauri-apps/api/process'
import { type } from '@tauri-apps/api/os'
import { invoke } from '@tauri-apps/api'

import React, { useState } from 'react'
import LoadGamePanel from './LoggedIn/LoadGamePanel.js'
import StdBtn from './LoggedIn/StdBtn.js'


const promptRestart = async (text) => {
    if(await ask(text)){
        await relaunch()
    }
}

const LoggedInPanel = (props) => {
    //disables the update button while the game is ongoing.
    const [ updateDisabled, setUpdateDisabled ] = useState(false)
    const [ launching, setLaunching ] = useState(false)
    const [ updatingTxt, setUpdatingTxt ] = useState('Updating')

    //HANDLES THE FUNCTIONALITY OF UPDATING GAME
    //1. Run updateGame() function from App.js
    //2. Disables button while game is updating
    //3. Periodically change update text with dots to show that its loading
    const handleUpdate = async () => {
        //only update game when no update is going on and game is not launching
        if(updateDisabled || launching){
            return
        }

        //disables the button
        setUpdateDisabled(true)
        
        //-- gives loading effect on update text
        let load = 0 
        const intervalId = setInterval(function update(){
            switch(load){
                case 0:
                    setUpdatingTxt('Updating')
                    load = 1
                    break
                case 1:
                    setUpdatingTxt('Updating.')
                    load = 2
                    break
                case 2:
                    setUpdatingTxt('Updating..')
                    load = 0
                    break
                default:
                    console.log('This is not supposed to happen! Updating txt logic went wrong.')
            }
        },500)
        //-- end of loading effect logic
        
        //from App.js, runs the backend updateGame function, to check if game requires update
        //if update fails
        if(!await props.updateGame()){
            clearInterval(intervalId)
            setUpdateDisabled(false)
            return            
        }

        //only enable the button after a delay once done updating the game, for rate limitation purposes.
        setTimeout(() => {
            clearInterval(intervalId)
            setUpdateDisabled(false)
        }, 1500)
    }

    // HANDLES THE FUNCTIONALITY OF LAUNCHING GAME
    // 1. Determine which game to run
    // 2. If it's the main game. 
    // ---> 1. Runs updateGame() function to reupdate the game before launching
    // ---> 2. If game fails to update, check if game file exist
    // ---> 3. If game file doesn't exist, prompt for program restart
    //
    // 3. If it's a mod, check whether it exist
    // 4. Determine which OS this app is running on and use flashplayer in according to OS
    // 5. Launch the game, with game and login as parameter.
    const launchGame = async () => {
        //only update game when no update is going on and game is not launching
        if(updateDisabled || launching){
            return
        }

        setLaunching(true)

        const appDir = await appConfigDir()
        const game = props.game

        //check if props.game is a valid object
        if(!typeof game === 'object'){
            console.log(`Invalid game object: ${game}`)
            //prompt restart if error
            await promptRestart('Invalid game data!\n\nDo you want to restart the application?')
            setLaunching(false)
            return
        }

        //determine which game to run
        let filepath
        let args = ''

        //main game
        if(game.filename === '<default>')
        {
            args = `?l=${props.credentials.login}&p=${props.credentials.password}&from_standalone=1`
            filepath = await join(appDir, 'data', 'pb2_re34.swf')

            //attempt to update game
            const success = await props.updateGame()
            const gameExist = await exists(filepath)

            //failed to update game and game don't exist
            if(!success && !gameExist){
                await promptRestart('Game does not exist! This may be due to missing internet connection.\n\nDo you want to restart the application?')
                setLaunching(false)
                return
            }
        }
        //mod game
        else{
            filepath = await join(appDir, 'mod', game.filename)

            //mod file doesn't exist
            if(!await exists(filepath)){
                await promptRestart('Mod file doesn\'t exist!\n\nDo you want to restart the application?')
                setLaunching(false)
                return
            }
        }
        //filepath of game to run is now stored in filepath

        //determine the os
        const osType = await type()
        console.log(`%c   Launching game: %c${game.name} %cwith a filepath of %c${game.filename}%c on OS of %c${osType}   `,
            'background-color: black;', 
            'color: yellow; background-color: black;',
            'color: white; background-color: black;',
            'color: yellow; background-color: black;',
            'color: white; background-color: black;',
            'color: yellow; background-color: black;'
        )

        await invoke("launch_game", {"params": `${filepath}${args}`})
        //load parameters and launch the game!
        //const command = Command.sidecar('bin/flashplayer', [`${filepath}${args}`])
        //await command.execute()

        //delay as there is a delay when opening the flashplayer
        setTimeout(() => {
            setLaunching(false)
        }, 1500)
    }

    //class names for loading css for play btn
    let updateBtnClass = 'greaterMargin'
    if(updateDisabled) updateBtnClass += ' disabled'
    
    if(launching) updateBtnClass += ' disabled'

    let playBtnClass = updateBtnClass + ' playBtn'
    
    return (
        <div id="loggedInPanel">
            <LoadGamePanel game={props.game} showLoaderHandle={props.showLoaderHandle} login={props.credentials.login}/>
            <div id="btnSection">
                <div>
                    <StdBtn className={playBtnClass} handleClick={launchGame} text={launching ? 'Launching..' : 'Play!'}/>
                    <StdBtn className={'greaterMargin'} handleClick={props.handleLogOut} text='Log Out'/>
                    <StdBtn className={updateBtnClass} handleClick={handleUpdate} text={updateDisabled ? updatingTxt : 'Update Game'}/>
                </div>
            </div>
        </div>
    )
}

export default LoggedInPanel