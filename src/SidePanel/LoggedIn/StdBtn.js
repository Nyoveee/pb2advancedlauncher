import React from 'react'

const StdBtn = (props) => {
    let btnType = "submit"
    if(props.type === "button") btnType = "button"

    //return play button (with greaterMargin)
    let className = 'stdBtn '
    className += props.className

    //return button
    return <button type={btnType} onClick={props.handleClick} className={className}>{props.text}</button>

}

export default StdBtn