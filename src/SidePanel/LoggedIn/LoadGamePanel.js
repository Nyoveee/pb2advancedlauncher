import React from 'react'
import StdBtn from './StdBtn.js'
import { open } from '@tauri-apps/api/shell'

const LoadGamePanel = (props) => {
    let userName = props.login === '' ? 'Guest' : props.login
    let gameName = typeof props.game === 'undefined' ? 'loading..' : props.game.name

    return (
        <div id="loadGamePanel" className='grayBg'>
            <p>Welcome back, <span className='goldClickTxt' onClick={() => open('https://www.plazmaburst2.com/?a=&s=7&ac='+ props.login)}>{userName}</span>!</p>
            <StdBtn handleClick={() => props.showLoaderHandle(true)} text='Load Game'/>
            <div>{gameName}</div>
        </div>
    )
}

export default LoadGamePanel