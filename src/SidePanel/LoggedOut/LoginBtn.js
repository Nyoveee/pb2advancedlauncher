import React from 'react'

const LogInBtn = (props) => {
    let displayTxt = 'leave login empty to login as Guest.'
    let displayTxt2 = '(Guest are not allowed to access Multiplayer)'
    let className = 'normalTxt'

    if(props.loginErr){
        displayTxt = props.loginErr
        className = 'redTxt'
        displayTxt2 = ''
    }

    return (
        <div id="loginArea">
            <button className='stdBtn' type='submit'>Login</button>
            <span className={className}>{displayTxt}<br/>{displayTxt2}</span>
        </div>
    )
}

export default LogInBtn