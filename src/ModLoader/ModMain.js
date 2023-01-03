import React from 'react'
import TableMain from './TableMain.js'
import EditMain from './EditMain.js'

const ModMain = (props) => {
    const { active, games, onChange, handleClick } = props
    
    if(games.length) {
        return (
            <div id='modMain'>
            <h3>Game Loaded: <b id='gameSelected'>{games[active].name}</b></h3>
            <div id='modDescription'><span>{games[active].description}</span></div>
            <div id='tableMain'>
                <TableMain handleClick={handleClick} active={active} games={games}/>
                <EditMain onChange={onChange} active={active} games={games} />
            </div>
            </div>
        )
    }

    return (
        <div id='modMain'>
            <span id='loadingMod'>
                loading..
            </span>
        </div>
    )
}

export default ModMain