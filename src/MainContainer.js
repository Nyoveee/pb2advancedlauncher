import React, {useState, useEffect} from 'react'
import DonationPanel from './MainContainer/Donation/DonationPanel.js'
import NewsPanel from './MainContainer/News/NewsPanel.js'

const MainContainer = () => {
    const [news, setNews] = useState([])
    const [newsPage, setNewsPage] = useState(0)
    const [donation, setDonation] = useState({month: '', count: 0})

    const fetchInfo = async (pageNum) => {
        const donationReg = /<div class="hover_support".+?><span .+?>(.+?) goal: (.+?) \/ \d+ support<\/span>/gs
        const newsReg = /<strong class="news_date">(.+?(?=:\s?<\/strong>)):\s?<\/strong>(.+?(?=\s*<div class="news_div"><\/div>|\s*<div align="center">))/gs
        const preventDefaultReg = /onClick="event\.preventDefault \? event\.preventDefault\(\) : event\.returnValue = false; window\.external\.PopUpLink\( this\.href \)/gs
        const newsPageReg = /<a href=".+?">\n\s+(?:\[|&nbsp;)(.+?)(?:\]|&nbsp;)\s+<\/a>/gs

        let url = 'https://www.plazmaburst2.com/launcher/index.php?a=&s=&pg='
        if(pageNum) url += (pageNum - 1)
        
        fetch(url)
        .then(response => response.text())
        .then(body => {
            //web scrap news out out HTML, timeout to create artificial delay to prevent rate limitation.
            setTimeout(() => {
                //make <a> workable by removing preventDefault()
                const filteredNews = Array.from(body.matchAll(newsReg)).map(match => {
                    let newsBody = match[2].replace(preventDefaultReg,'class="goldTxt"')
                    return [match[0], match[1], newsBody]
                })

                setNews(filteredNews)

                const totalPage = Array.from(body.matchAll(newsPageReg)).length
                setNewsPage([pageNum,totalPage])

                const donationMonth = Array.from(body.matchAll(donationReg))[0][1]
                const donationCount = Array.from(body.matchAll(donationReg))[0][2]

                setDonation({month: donationMonth, count: donationCount})
            }, 300)
        })
        .catch(err => {
            setNews([['','Error loading news.','Please make sure you have a working internet connection. The server could also be temporarily down. In any case, you can try to play the game anyway.<br><br>Restart the launcher if issue persist.']])
            setNewsPage([1,1])
        })
    }

    useEffect(() => {
        fetchInfo()
    },[])

    const pageHandler = (pageNum) => {
        setNews([])
        fetchInfo(pageNum)
    }

    return (
        <div id="mainBg">
            <div id="mainContainer">
                <DonationPanel donationMonth={donation.month} donationCount={donation.count}/>
                <NewsPanel pageHandler={pageHandler} news={news} newsPage={newsPage}/>
            </div>
        </div>
    )
}

export default MainContainer