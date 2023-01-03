import React from 'react'
import NewsBody from './NewsBody.js'
import NewsPage from './NewsPage.js'

const NewsPanel = (props) => {
    return (
        <div id='newsPanel'>
            <div id="newsHeader">📰 News</div>
            <div id="newsGridParent">
            <NewsPage pageHandler={props.pageHandler} newsPage={props.newsPage}/> <NewsBody news={props.news}/> 
            </div>
        </div>
    )
}

export default NewsPanel