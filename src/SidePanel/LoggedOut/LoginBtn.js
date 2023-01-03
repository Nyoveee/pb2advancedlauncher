import React from 'react'

const LogInBtn = (props) => {
    let displayTxt = 'leave login empty to login as guest'
    let className = 'normalTxt'

    if(props.loginErr){
        displayTxt = props.loginErr
        className = 'redTxt'
    }

    return (
        <div id="loginArea">
            <button className='stdBtn' type='submit'>Login</button>
            <span className={className}>{displayTxt}</span>
        </div>
    )
}

export default LogInBtn