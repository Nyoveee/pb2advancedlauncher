import React from 'react'

import AccountHeader from './ManageAccountPanel/AccountHeader.js'
import AccountTable from './ManageAccountPanel/AccountTable.js'
import SavedPass from './ManageAccountPanel/SavedPass.js'
import AccountFooter from './ManageAccountPanel/AccountFooter.js'
import StdBtn from './SidePanel/LoggedIn/StdBtn';

//takes in accounts json and returns list of login
const getLoginList = (accounts) => {
    let loginList = []

    for (let obj of accounts){
        loginList.push(obj.login)
    }

    return loginList
}

const getPassword = (login, accounts) => {
    let loginList = getLoginList(accounts)
    let index = loginList.indexOf(login)

    //check if active login exist
    if(index !== -1){
        return accounts[index].password
    }
    //error handling in case active login is invalid and is not in accounts object

    return -1
}

//FRONTEND LOGIC
const ManageAccount = (props) => {
    const { active, setActive, accounts, setAccounts } = props

    const setActiveHandler = (login) => {
        //only swap account if currently logged out.
        if(!props.loggedIn){
            props.handleAccountSwitch(login, getPassword(login, accounts))
            setActive(login)
        }
    }

    //MISSING BACKEND FUNCTIONALITY
    //-- UPDATE FILE
    const deleteActiveHandler = async () => {
        let loginList = getLoginList(accounts)
        let index = loginList.indexOf(active)

        loginList.splice(index, 1)

        let newAccounts = loginList.map((active) => {
            return {
                login: active,
                password: getPassword(active, accounts)
            }
        })

        //reset input fields for loggedOutPanel
        props.handleAccountSwitch('', '')
        setAccounts(newAccounts)
        setActive('')

        await props.updateAccountFile(newAccounts)
    }

    let passwordDisplay = ''

    //if there is something selected (active)
    if(active !== ''){
        passwordDisplay = getPassword(active, accounts)

        //error handling in case active login is invalid and is not in accounts object
        if(passwordDisplay === -1){
            console.log(`Invalid active login of: '${active}'! Resetting selection..`)
            passwordDisplay = ''
            setActive('')
        }
    }

    return (
        <div className={props.accountPanel} id="manageAccountsPanel">
                <AccountHeader />
                <AccountTable handleClick={setActiveHandler} active={active} accounts={accounts}/>
                <SavedPass password={passwordDisplay}/>
                <StdBtn handleClick={deleteActiveHandler} className='' text='Delete (-)'/>
                <AccountFooter />
        </div>
    )
}

export default ManageAccount