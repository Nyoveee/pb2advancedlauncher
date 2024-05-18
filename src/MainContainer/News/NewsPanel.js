import React, { useState } from 'react'
import NewsBody from './NewsBody.js'
import NewsPage from './NewsPage.js'
import VideoMain from './VideoMain.js'

const NewsPanel = (props) => {
    const [ display, setDisplay ] = useState("news")

    const showNews = () => {
        setDisplay("news")
    }

    const showVideos = () => {
        setDisplay("videos")
    }

    return (
        <div id='newsPanel'>
            <div id="newsHeader">
                <div onClick={showNews}>📰 <span className={display === "news" ? "underline" : "" }>News</span></div>
                <div onClick={showVideos}>🎥 <span className={display === "videos" ? "underline" : ""}>Videos</span></div>
            </div>
                {
                    display === "news" 
                    ? 
                    <div id="newsGridParent">
                        <NewsPage pageHandler={props.pageHandler} newsPage={props.newsPage}/> <NewsBody news={props.news}/> 
                    </div>
                    : 
                    <div id="videoMain">
                        <VideoMain videoInfo={props.videoInfo}/>
                    </div>
                }
        </div>
    )
}

export default NewsPanel