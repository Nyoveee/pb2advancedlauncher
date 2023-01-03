import React from 'react'

const TableMain = (props) => {
    const tableData = props.games
    const active = props.active
    const addInfo = props.addInfo ? props.addInfo : ''

    const tableBody = tableData.map((rowObj, index) => {
        let className = ''
        if(index === active){
            className = 'active'
        }
        return <tr onClick={() => props.handleClick(index)} key={index} className={className}><td><span>{rowObj.name}</span></td><td><span>{rowObj.author}</span></td></tr>
    })
    
    const modInfo = tableData.length === 1 ? `1 mod total.${addInfo}` : `${tableData.length} mods total.${addInfo}`
    
    return (
        <div>
            <table>
                <thead>
                    <tr className='header'>
                        <th>Mod Name</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </table>
            <span id='modSpan'><span>{modInfo}</span></span>
        </div>   
    )
}

export default TableMain