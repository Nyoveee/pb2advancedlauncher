import React from 'react'
import ModMain from './ModLoader/ModMain.js'
import { open } from '@tauri-apps/api/shell'

const ModLoader = (props) => {
    return (
        <div id='modLoader'>
            <div id='modLoaderOverlay'>
                <header>
                    <button onClick={() => props.showLoaderHandle(false)} id='closeModOverlay'>X</button>
                    <h1>Load Game</h1>
                    <p>To add a new mod, add the mod .swf file into the <span className='goldTxt underline' onClick={props.openModFolder}>mod</span> folder. Click <span onClick={() => open('https://nyove.gitbook.io/mod-megathread/')} className='goldTxt underline'>here</span> to browse for more mods.</p>
                </header>
                <ModMain active={props.active} games={props.games} onChange={props.onChange} handleClick={props.handleClick}/>
                <footer>
                    <span>Do not access multiplayer with other mods! This can get your account banned.</span>
                </footer>
            </div>
        </div>
    )
}

export default ModLoader