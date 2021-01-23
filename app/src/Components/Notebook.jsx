import React from 'react'

import Notebook from '../Controllers/Notebook'
import CellComponent from './Notebook/Cell'

class NotebookComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
    this.Notebook = new Notebook(this)

    this.state.cells = this.Notebook.cells
  }

  componentDidMount () {
    this.Notebook.createNewCell()
  }

  render () {
    return (
      <div className='uk-container'>
        {this.state.cells.map((cell, index) => (
          <CellComponent
            key={cell.Id}
            Notebook={this.Notebook}
            Cell={cell}
          ></CellComponent>
        ))}
        <a href='#' uk-totop='true'></a>
      </div>
    )
  }
}

export default NotebookComponent
