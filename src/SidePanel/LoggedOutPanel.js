import React, {useState} from 'react'
import LogInBtn from './LoggedOut/LoginBtn'

import { open } from '@tauri-apps/api/shell';

const LoggedOutPanel = (props) => {
    const { handleChange, credentials, hoverHandle, mouseOutHandle, handleLogIn } = props
    const passwordHint = "Not your account password! Click it to get your password for standalone access."

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
            if(password.length !== 32){
                setLoginErr(invalidPasswordPrompt)
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
                    <label>Standalone Password
                        <span id="passwordDialogPrompt" onClick={() => open('https://www.plazmaburst2.com/?a=&s=8')} 
                        onMouseEnter={event => hoverHandle(event, passwordHint)} onMouseLeave={mouseOutHandle} className={classNamePass}>[?]
                        </span>
                    </label><input type="password" className={className} onChange={(e) => handleChange(e,'password')} value={credentials.password}/>
                </div>
            </div>
            <LogInBtn loginErr={loginErr}/>

        </form>
    )
}

export default LoggedOutPanel