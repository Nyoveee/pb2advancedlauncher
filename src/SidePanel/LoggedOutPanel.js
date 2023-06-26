import React, {useState} from 'react'
import LogInBtn from './LoggedOut/LoginBtn'

import { open } from '@tauri-apps/api/shell';
import StdBtn from './LoggedIn/StdBtn';

const LoggedOutPanel = (props) => {
    const { toShowAccountPanel, hideAccount, showAccount, handleChange, credentials, hoverHandle, mouseOutHandle, handleLogIn } = props
    const passwordHint = "For safety reasons, it is best for you to use your standalone password! Click to get it!"

    const [loginErr, setLoginErr] = useState('')
    const invalidPasswordPrompt = 'Invalid Password!'

    const handleSubmit = (e) => {
        e.preventDefault()
        const login = e.target[0].value
        const password = e.target[1].value

        //non guest login attempt
        if(login){
            if(!password){
                setLoginErr('password field is empty!')
                return
            }

            setLoginErr('')
        }

        handleLogIn(login, password)
    }

    let className = 'formInput'
    if(loginErr) className = 'formInput errorInput'

    let classNamePass = 'normalTxt'
    if(loginErr === invalidPasswordPrompt) classNamePass = 'redTxt shake'

    return (
        <form id="loggedOutPanel" onSubmit={handleSubmit}>
            <div id="inputArea">
                <div>
                    <label>Login</label><input className='formInput' onChange={(e) => handleChange(e,'login')} value={credentials.login}/>
                </div>
                <div id="passwordInputDiv">
                    <label>Password
                        <span id="passwordDialogPrompt" onClick={() => open('https://www.plazmaburst2.com/?a=&s=8')} 
                        onMouseEnter={event => hoverHandle(event, passwordHint)} onMouseLeave={mouseOutHandle} className={classNamePass}>[?]
                        </span>
                    </label><input type="password" className={className} onChange={(e) => handleChange(e,'password')} value={credentials.password}/>
                </div>
            </div>
            <LogInBtn loginErr={loginErr}/>
            {
                //button toggles between show account and close.
                toShowAccountPanel ? <StdBtn type={"button"} handleClick={hideAccount} className='manageBtn' text='Close'/> : <StdBtn type={"button"} handleClick={showAccount} className='manageBtn' text='Manage Accounts'/>
            }
        </form>
    )
}

export default LoggedOutPanel