import React, { useState, useEffect } from 'react'
import PanelBannerImg from './images/header.webp'
import LoggedInPanel from './SidePanel/LoggedInPanel.js'
import LoggedOutPanel from './SidePanel/LoggedOutPanel.js'
import NotiBar from './SidePanel/NotiBar'

import DiscordIcon from './images/Discord Logo.webp'
import PatreonIcon from './images/Patreon Logo.webp'
import TwitterIcon from './images/Eric Logo.webp'

import { open } from '@tauri-apps/api/shell';
import { createDir, exists, BaseDirectory, writeTextFile, readTextFile } from '@tauri-apps/api/fs'
import { join, appConfigDir } from '@tauri-apps/api/path'

// BACKEND: Login Logic (login.json is stored in data dir)
// 1. Create the data dir if it does not exist
// 2. Check if the login.json exist
// 3. If it doesn't exist, create the file leaving it empty.
// 4. Return the json object
const mainLogin = async () => {
    const emptyJson = {
        login: '',
        password: '',
    }

    console.log('Checking login credentials..')
    // Creates the data folder if it does not exist
    await createDir('data', { dir: BaseDirectory.AppData, recursive: true })

    const appDir = await appConfigDir()
    const loginFile = await join(appDir, 'data', 'login.json')

    //2. and 3.
    if(!await exists(loginFile)){
        await writeTextFile(loginFile, JSON.stringify(emptyJson))
    }
    
    //reading from loginJson file..
    const loginInfo = await readTextFile(loginFile)

    let loginJson
    
    try{
        if(loginInfo === ''){
            console.log('Login info is empty! Creating a new JSON file..')
            loginJson = {...emptyJson}
            await writeTextFile(loginFile, JSON.stringify(emptyJson))
            return
        }
        
        loginJson = JSON.parse(loginInfo)
        console.log('Succesfully retrieved login info.')
    }
    catch(err){
        console.log(`Unable to parse login JSON! Creating a new JSON file..\n${err}`)
        loginJson = {...emptyJson}
        await writeTextFile(loginFile, JSON.stringify(emptyJson))
    }
    
    return loginJson
}

//func to update the login file
const updateLoginFile = async (login, password) => {
    const appDir = await appConfigDir()
    const loginFile = await join(appDir, 'data', 'login.json')

    await writeTextFile(loginFile, JSON.stringify({
        login: login,
        password: password
    }))
}


//---- FRONTEND LOGIC ----
const PanelBanner = () => {
    return (
        <div id='imgContainer' className='grayBg'>
            <h3 onClick={() => open('https://www.plazmaburst2.com')}>Plazma Burst 2<span>Advanced Mod Launcher</span></h3>
            <img src={PanelBannerImg} alt=''/>
        </div>
    )
}

const PanelWrapper = (props) => {
    const {hoverHandle, mouseOutHandle} = props
    const discordHint = "Want to interact with the community? Join the Plazma Burst 2 Official Discord!"
    const patreonHint = "Support Eric Gurt and unlock exclusive PB3 posts and sneakpeeks!"
    const twitterHint = "Check out Eric Gurt’s twitter for PB3 updates."

    return (
        <div id="panelWrapper" className='grayBg'>
            <div id="iconContainer">
                <div>
                    <img src={DiscordIcon} onClick={() => open('https://discord.gg/dw32bAV9Eb')} 
                    onMouseEnter={event => hoverHandle(event, discordHint)} onMouseLeave={mouseOutHandle} alt='discordIcon'/>
                </div>
                <div>
                    <img src={PatreonIcon} onClick={() => open('https://www.patreon.com/Eric_Gurt')} 
                    onMouseEnter={event => hoverHandle(event, patreonHint)} onMouseLeave={mouseOutHandle} alt='patreonIcon'/>
                </div>
                <div>
                    <img src={TwitterIcon} id="twitterIcon" onClick={() => open('https://twitter.com/Eric_Gurt')} 
                    onMouseEnter={event => hoverHandle(event, twitterHint)} onMouseLeave={mouseOutHandle} alt='twitterIcon'/>
                </div>
            </div>
        </div>
    )
}

const SidePanel = (props) => {
    //hint text when hovering over icons
    const [hintState, setHintState] = useState({
        showHint: false,
        hintMsg: "You shouldn't be seeing this.",
    })
    const [loggedIn, setLoggedIn] = useState(false)
    const [credentials, setCredentials] = useState({
        login: '',
        password: '',
    })

    //change state in accord to which image is hovered over (msg).
    const hoverHandle = (e, msg) => {
        setHintState({showHint: true, hintMsg: msg})
    } 

    //hides when not hovering over
    const mouseOutHandle = () => {
        setHintState({showHint: false, hintMsg: "You shouldn't be seeing this."})
    }

    const handleLogIn = (login, password) => {
        setCredentials({login: login, password: password})
        updateLoginFile(login, password)
        setLoggedIn(true)
    }

    const handleLogOut = () => {
        //reset password
        setCredentials({login: credentials.login, password: ''})
        updateLoginFile(credentials.login, '')
        setLoggedIn(false)
    }

    //update form based on keyboard input
    const handleChange = (e, target) => {
        if(target === 'login') setCredentials({login: e.target.value, password: credentials.password})
        if(target === 'password') setCredentials({login: credentials.login, password: e.target.value})
    }

    //PROGRAM STARTS HERE, this is run the first time frontend loads.
    useEffect(() => {
        const f = async () => {
            //runs the main backend logic, setting up the login json. refer to fn definition for more info
            const loginJson = await mainLogin()

            setCredentials({
                login: loginJson.login,
                password: loginJson.password,
            })

            //auto log in user if login and valid password is present
            if(loginJson.login !== '' && loginJson.password.length === 32){
                setLoggedIn(true)
            }
        }
        f()
    }, [])
    //choose which panel to show based on whether user logged in.
    const panelMainBody = loggedIn ? 
    <LoggedInPanel updateGame={props.updateGame} game={props.game} showLoaderHandle={props.showLoaderHandle} credentials={credentials} handleLogOut={handleLogOut} /> : 
    <LoggedOutPanel handleChange={handleChange} credentials={credentials} handleLogIn={handleLogIn} hint={hintState} hoverHandle={hoverHandle} mouseOutHandle={mouseOutHandle}/>

    return (
        //these components are in this file.
        <aside id='sidePanel' className='blueBg'>
            <PanelBanner />
            {panelMainBody}
            <NotiBar hint={hintState}/>
            <PanelWrapper hoverHandle={hoverHandle} mouseOutHandle={mouseOutHandle}/>
        </aside>
    )
}

export default SidePanel