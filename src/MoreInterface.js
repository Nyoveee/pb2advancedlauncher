import React from 'react'

import PB2Img from './images/pb2.png'
import SD2DImg from './images/sd2d.png'
import SupportImg from './images/help.png'
import ALEImg from './images/ale.png'

import { open } from '@tauri-apps/api/shell'

const mainInfo = [
    {
        img: PB2Img,
        altTxtImg: 'PB2 Icon',
        txt: 'Want to access the main PB2 webpage? Click on the icon on the left!',
        url: 'https://www.plazmaburst2.com/', //empty string to make it unclickable.
    },
    {
        img: SD2DImg,
        altTxtImg: 'SD2D Icon',
        txt: 'Star Defenders 2D is a multiplayer RPG sandbox world made by the same creator, with vast amounts of hostile enemies to kill and a world to explore.',
        url: 'https://www.gevanni.com:3000//', //empty string to make it unclickable.
    },
    {
        img: SupportImg,
        altTxtImg: 'Helpdesk Icon',
        txt: 'Forget your password? Need support from the staff team? Head on to the helpdesk and the PB2 Staff team will respond to your enquiries',
        url: 'https://www.plazmaburst2.com/helpdesk/', //empty string to make it unclickable.
    },
    {
        img: ALEImg,
        altTxtImg: 'ALE Icon',
        txt: 'Want to create the next Stryde-sniper or Paul308-bases? Click on the icon to access the Advanced Level Editor!',
        url: 'https://www.plazmaburst2.com/level_editor/map_edit.php', //empty string to make it unclickable.
    },
]
const MoreInterface = (props) => {
    return (
        <div id='moreInterface'>
            <div id='moreInterfaceOverlay'>
                <header>
                    <button onClick={() => props.showModInterface(false)} id='closeMoreOverlay'>X</button>
                    <h1>More options</h1>
                    <p>Here are some additional useful links that you may want to navigate to.</p>
                </header>
                <div id="moreContainer">
                    <div id="moreMain">
                        {
                            mainInfo.map((row, index) => {
                                return ( 
                                    <div class={index % 2 === 0 ? 'bannerImgRow bannerLeft': 'bannerImgRow bannerRight'}>
                                        {
                                            //display text on the left if it's odd number indexs (1,3,5)
                                            index % 2 === 1 ?
                                            <div class="bannerTxt">
                                                <span>
                                                    {row.txt}
                                                </span>
                                            </div>
                                            : null
                                        }
                                        <div class="bannerImg">
                                            <img className={ row.url === '' ? '' : 'accountSelectable' } 
                                                alt="PB2 Icon" 
                                                src={row.img} 
                                                onClick={ row.url === '' ? null : () => open(row.url) }
                                            />
                                        </div>
                                        {
                                            //display text on the left if it's even number indexs (0,2,4)
                                            index % 2 === 0 ?
                                            <div class="bannerTxt">
                                                <span>
                                                    {row.txt}
                                                </span>
                                            </div>
                                            : null
                                        }
                                        
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <footer>
                    <span>Have any suggestions for the launcher? Do let us know!</span>
                </footer>
            </div>
        </div>
    )
}

export default MoreInterface