import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const NewsBody = (props) => {
    let newsBodyJsx

    //props.news is a [][], first [] listing all regex matches while the 2nd [] list [0] as match, [1] as date (1st group) and [2] as news body (2nd group).
    if(props.news.length){
        newsBodyJsx = props.news.map((match, index) => {
            let newsBody = match[2]

            //for loop instead of while loop to avoid infinite loop
            for(let i = 0; i < 3; i++){
                //removes <br> at the end of the news body.
                if(newsBody.slice(-4) === '<br>') newsBody = newsBody.slice(0, -4)
            }

            return (
                <section key={index}>
                    <h3>{match[1]}</h3>
                    <p dangerouslySetInnerHTML={{ __html: newsBody}}/>
                </section>
            )
        })
    }
    else{
        newsBodyJsx = 
        <>
            <section>
                <SkeletonTheme baseColor='#2D2C31' highlightColor='#3e3d42'>
                    <h3><Skeleton width={200} className='skeleLoadingHeader'/></h3>
                    <p><Skeleton variant="rectangular" height={70}/></p>
                </SkeletonTheme>
            </section>
            <section>
                <SkeletonTheme baseColor='#2D2C31' highlightColor='#3e3d42'>
                    <h3><Skeleton width={180} className='skeleLoadingHeader'/></h3>
                    <p><Skeleton variant="rectangular" height={105}/></p>
                </SkeletonTheme>
            </section>
        </>
    }

    //const newsData = "Server changes done to allow starting matches with multiple maps combined into one. It should allow better spectating tools and other modifications. So far it only works at approved maps and extra maps do need permission from Custom Map Approval Team. You can see example of this if you'll specify ID for new Multiplayer match like this: eric gurt-spectator_camera,stryde-sniper (no spaces). Feature only works on Arizona server for now, but will be added to other servers if it will find some use. Also, recent map ID list will automatically remove comma from these IDs - it is a known issue."
    
    //remember to use map here
    return (
        <div id='newsBody'>
            {newsBodyJsx}
        </div>
    )
}

export default NewsBody