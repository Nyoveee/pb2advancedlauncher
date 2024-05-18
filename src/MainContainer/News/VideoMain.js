import React from 'react'

// Components
const Video = (props) => {
    return (
        <div className='videoDiv'>
            <iframe title="Video" className='video' src={props.videoLink}></iframe>
        </div>
        
    )
}

const VideoContainer = (props) => {
    const preventDefaultReg = /onClick="event\.preventDefault \? event\.preventDefault\(\) : event\.returnValue = false; window\.external\.PopUpLink\( this\.href \)/gs

    return (
        <>
            <h1 className='videoMainTitle'>{props.videoMainTitle}</h1>
            <h1 className='videoTitle'>{props.videoTitle}</h1>
            <div className="videoContainer">
                <Video videoLink={props.videoLink}/>
                <p dangerouslySetInnerHTML={{ __html: props.videoDescription.replace(preventDefaultReg,'class="goldTxt"')}} className='vidDescription'/>
            </div>
        </>
    )
}

const VideoMain = (props) => {
    let bodyJsx = props.videoInfo.map((info, index) => {
        console.log(info)
        return <VideoContainer videoDescription={info[4]} videoTitle={info[1]} videoMainTitle={info[2]}  videoLink={info[3]} key={index}/>
    })

    return (
        bodyJsx
    )
}

export default VideoMain