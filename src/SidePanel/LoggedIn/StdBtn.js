import React from 'react'

const StdBtn = (props) => {
    //return play button (with greaterMargin)
    let className = 'stdBtn '
    className += props.className

    //return button
    return <button onClick={props.handleClick} className={className}>{props.text}</button>

}

export default StdBtn