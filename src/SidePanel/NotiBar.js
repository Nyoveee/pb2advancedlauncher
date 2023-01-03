import React from 'react'

const NotiBar = (props) => {
    let toShow, text

    if(props.hint){
        toShow = props.hint.showHint
        text = props.hint.hintMsg
    }
    //just in case if props is empty
    else{
        toShow = true
        text = 'Something went wrong.'
    }

    const renderElement = toShow ? <div id="notiBar">{text}</div> : null
    return renderElement
}

export default NotiBar