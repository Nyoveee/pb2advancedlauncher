import React from 'react'

const EditMain = (props) => {
    const game = props.games[props.active]

    const formHandler = props.onChange
    return (
        <div id="editMain">
            <div className='tableHeader header'>Edit</div>
            <div id='editPanel'>
                <label>Name</label><input value={game.name} onChange={(e) => formHandler(props.active,'name',e.target.value)} className='formInput'/>
                <label>Author</label><input value={game.author} onChange={(e) => formHandler(props.active,'author',e.target.value)} className='formInput'/>
                <label>Description</label><textarea value={game.description} onChange={(e) => formHandler(props.active,'description', e.target.value)} className='formInput'/>
                <label>Filename:</label><div id='fileName'><div>{game.filename}</div>{/* <button>Save</button> */}</div> 
            </div>
        </div>
    )
}

export default EditMain