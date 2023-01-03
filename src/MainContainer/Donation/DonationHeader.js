import React from 'react'
import { open } from '@tauri-apps/api/shell'

const DonationHeader = (props) => {
    //both variables will be props in the future
    const date = props.donationMonth
    let goal = props.donationCount ? props.donationCount : 0

    if(goal > 200) goal = 200
    
    return (
        <div id='donationHeader'>
            {date} Goal: {goal}/200<span onClick={() => open('https://www.plazmaburst2.com/?a=&s=21')}>Click here to support PB2!</span>
        </div>
    )
}

export default DonationHeader