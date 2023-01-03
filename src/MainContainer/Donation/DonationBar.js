import React from 'react'

const DonationBar = (props) => {
    let count = props.donationCount
    if(count === ' ') count = 0 
    //error catching in case empty props, giving default value of 0.
    const progress = count ? count : 0
    const progressStyle = `${progress/2}%`

    return (
        <div id='donationBar'>
            <div id='donationBarFilled' style={{width: progressStyle}}></div>
        </div>
    )
}

export default DonationBar