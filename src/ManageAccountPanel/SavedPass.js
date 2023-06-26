import React, { useState } from 'react'

const SavedPass = (props) => {
    const [inputType, setInputType] = useState("password")

    const revealPass = () => {
        setInputType("text")
    }

    const hidePass = () => {
        setInputType("password")
    }

    return (
        <div id="savedPass">        
            <label>Saved Password</label>
            <div id="savedPassInputFlex"><input className={"formInput"} readOnly={true} type={inputType} value={props.password}/><div onMouseDown={revealPass} onMouseLeave={hidePass} onMouseUp={hidePass} id="savedPassReveal">&#8226;</div></div>
        </div>
    )
}

export default SavedPass