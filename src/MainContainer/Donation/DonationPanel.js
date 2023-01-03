import React from 'react'
import DonationHeader from './DonationHeader.js'
import DonationBar from './DonationBar.js'

const DonationPanel = (props) => {

    return (
        <div id='donationPanel'>
            <DonationHeader donationMonth={props.donationMonth} donationCount={props.donationCount}/>
            <DonationBar donationCount={props.donationCount}/>
        </div>
    )
}

export default DonationPanel