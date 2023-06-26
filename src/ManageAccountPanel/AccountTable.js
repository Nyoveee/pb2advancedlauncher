import React from 'react'

const AccountHeader = (props) => {
    let accounts = props.accounts

    //empty string instead of an array indicates that the program has just started and is still reading from accounts.json. -> to display loading table.
    if(accounts === ''){
        return (
            <div id="accountPanel">
            <table id="accountTable">
                <thead>
                    <tr id="accountTableHeader"><td>Accounts</td></tr>
                </thead>
                <tbody>
                    <tr><td>..</td></tr>
                </tbody>
                <span>Loading..</span>
            </table>
        </div> 
        )
    }

    return (
        <div id="accountPanel">
            <table id="accountTable">
                <thead>
                    <tr id="accountTableHeader"><td>Accounts</td></tr>
                </thead>
                <tbody>
                    {
                        accounts.length === 0 ? <tr><td>No account saved.</td></tr> : accounts.map((account) => {
                            let className
                            account.login === props.active ? className = 'accountSelected' : className = 'accountSelectable'

                            return <tr key={account.login} className={className} onClick={() => props.handleClick(account.login)}><td>{account.login}</td></tr>
                        })
                    }
                </tbody>
                <span>
                    {props.active ? `Selected: ` : 'None selected.'}
                    <b>{props.active ? props.active : ''}</b>
                </span>
            </table>
        </div>
    )
}

export default AccountHeader