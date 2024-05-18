import React, { useState, useEffect } from 'react'

//activePage is activePage from props (from parent container)
//aPage represents activePage, state of this componenet

const NewsPage = (props) => {  
    const numPage = props.newsPage[1]
    let activePage = props.newsPage[0]

    //initally set to the 1st page
    //true indicates the page is changing while false indicates the page has changed.
    const [aPage, setAPage] = useState({
        page: 1,
        isLoading: true,
    }) 

    //change active page when there are any props change (thru changing page)
    //at start, activePage is undefined.
    useEffect(() => {
        // at start
        if(!activePage) {
            setAPage({page: 1, isLoading: false})
            return
        }

        // at prop change, when new news info is loaded.
        setAPage({page: activePage, isLoading: false})
    }, [activePage])

    //create an array ranging from 1 to pageNum, to be mapped to create jsx child elements.
    const numArr = []

    for(let i = 0; i<numPage; i++){
        numArr.push((i+1))
    }

    const pageChangeHandler = (page) => {
        //only change the page
        if(!aPage.isLoading){
            setAPage({page: page, isLoading: true})
            props.pageHandler(page)
        }
    }

    let className = ''

    if(aPage.isLoading){
        className = 'loadingCursor'
    }

    //map across page number, if page number is the current active page, return btn with active class, else return btn
    const listOfPage = numArr.map(page => {
        //to reset className2 back to className, removing the active.
        let className2 = className
        if(page === aPage.page) className2 += ' active'

        return <button key={page} onClick={() => pageChangeHandler(page)} className={className2}>{page}</button>
    })

    return (
        <div id='newsPage'>
            {
                numPage ? listOfPage : null
            }
        </div>
    )
}

export default NewsPage