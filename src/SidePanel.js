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
import ManageAccount from './ManageAccount'

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

//function to retrieve accounts object from accounts json.
const retrieveAccounts = async () => {
    console.log('Checking the accounts json file..')

    const appDir = await appConfigDir()
    const accDir = await join(appDir, 'data')
    const filepath = await join(accDir, 'account.json')

    //1. check if json file exist.
    if(!await exists(filepath)){
        await writeTextFile(filepath, "[]")
    }

    const accounts = await readTextFile(filepath)
    let accountsJson = []

    try{
        accountsJson = JSON.parse(accounts)
    }
    catch{
        console.log("Unable to parse accounts json! Re-creating the json file..")
        await writeTextFile(filepath, "[]")
    }

    return accountsJson
}

const updateAccountFile = async (obj) => {
    const appDir = await appConfigDir()
    const accDir = await join(appDir, 'data')
    const filepath = await join(accDir, 'account.json')

    writeTextFile(filepath, JSON.stringify(obj))
}

//---- FRONTEND LOGIC ----
const PanelBanner = () => {
    return (
        <div id='imgContainer' className='grayBg'>
            <h3 onClick={() => open('https://www.plazmaburst2.com')}>Plazma Burst 2<span>Advanced Launcher</span></h3>
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

const getIndex = (login, accounts) => {
    let loginList = []

    for (let obj of accounts){
        loginList.push(obj.login)
    }

    return loginList.indexOf(login)
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
    //for account management panel
    //empty string to indicate that accounts json has not been read from and is still loading.
    const [accounts, setAccounts] = useState('')
    const [active, setActive] = useState('')

    //use to toggle between showing the management of accounts
    const [showAccountPanel, setShowAccountPanel] = useState(false)

    //handler for ManageAccount child component to setAccounts
    const setAccountHandler = (account) => {
        setAccounts(account)
    }

    //handler for ManageAccount child component to setActive
    const setActiveHandler = (login) => {
        setActive(login)
    }

    //change state in accord to which image is hovered over (msg).
    const hoverHandle = (e, msg) => {
        setHintState({showHint: true, hintMsg: msg})
    } 

    //hides when not hovering over
    const mouseOutHandle = () => {
        setHintState({showHint: false, hintMsg: "You shouldn't be seeing this."})
    }

    const handleLogIn = (login, password) => {
        //hide the manage account panel
        setShowAccountPanel(false)

        setCredentials({login: login, password: password})
        updateLoginFile(login, password)

        setLoggedIn(true)
        
        //-- Update manage account table to include new login and password --
        //check if it's a guest login (empty), if so, update not required.
        if(login === '') return

        //check if login already exist
        let index = getIndex(login, accounts)
        let copyAccounts = accounts.slice() 

        //login doesnt exist, create new entry
        if(index === -1){
            copyAccounts.push({
                login: login,
                password: password
            })
        }
        else{
            copyAccounts[index].password = password
        }            
        
        setAccounts(copyAccounts)
        setActive(login)
        updateAccountFile(copyAccounts)
    }

    const handleLogOut = () => {
        setLoggedIn(false)
    }

    //update form based on keyboard input
    const handleChange = (e, target) => {
        if(target === 'login'){
            setCredentials({login: e.target.value, password: credentials.password})

            //change account selection on manage account panel based on new input
            getIndex(e.target.value, accounts) === -1 ? setActive('') : setActive(e.target.value)
            return
        } 

        if(target === 'password') setCredentials({login: credentials.login, password: e.target.value})
    }

    //update form based on switch selection on account management (login and password provided.)
    const handleAccountSwitch = (login, password) => {
        //only switch account if we are currently log out
        if(!loggedIn) setCredentials({login: login, password: password})
    }

    const showManageAccountPanel = () => {
        setShowAccountPanel(true)
    }

    const hideManageAccountPanel = () => {
        setShowAccountPanel(false)
    }

    let darkenBg = "undarkenBg"
    let accountPanel = "hideAccountPanel"

    //setting the respective classes to show / hide manageAccountPanel
    if(showAccountPanel){
        darkenBg = "darkenBg"
        accountPanel = "showAccountPanel"
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
            if(loginJson.login !== ''){
                setLoggedIn(true)
            }

            //retreve accounts from account json (backend)
            setAccounts(await retrieveAccounts())

            //change account selection on manage account panel based on already logged in user
            getIndex(loginJson.login, accounts) === -1 ? setActive('') : setActive(loginJson.login)
        }
        f()
    // eslint-disable-next-line
    }, [])

    //choosing which panel to display based on whether user logged in.
    const panelMainBody = loggedIn ? 
    <LoggedInPanel updateGame={props.updateGame} game={props.game} showLoaderHandle={props.showLoaderHandle} credentials={credentials} handleLogOut={handleLogOut} /> : 
    <LoggedOutPanel toShowAccountPanel={showAccountPanel} showAccount={showManageAccountPanel} hideAccount={hideManageAccountPanel} handleChange={handleChange} credentials={credentials} handleLogIn={handleLogIn} hint={hintState} hoverHandle={hoverHandle} mouseOutHandle={mouseOutHandle}/>

    return (
        <>        
            <aside id='sidePanel' className='blueBg'>
                <PanelBanner />
                {panelMainBody}
                <NotiBar hint={hintState}/>
                <PanelWrapper hoverHandle={hoverHandle} mouseOutHandle={mouseOutHandle}/>
            </aside>
            <ManageAccount updateAccountFile={updateAccountFile} active={active} setActive={setActiveHandler} accounts={accounts} setAccounts={setAccountHandler} loggedIn={loggedIn} handleAccountSwitch={handleAccountSwitch} accountPanel={accountPanel}/>
            { showAccountPanel ? <div className={darkenBg} id="darkenBg"/> : <></>}
        </>
    )
}

export default SidePanel