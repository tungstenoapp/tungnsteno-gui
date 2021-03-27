import React from 'react'

import Cell from '../Controllers/Notebook/Cell'
import CellComponent from './Notebook/Cell'

class NotebookComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = { cells: [] }
  }

  componentDidMount () {
    this.createNewCell()
  }

  createNewCell () {
    this.state.cells.push(new Cell(this.state.cells.length + 1))
    this.setState({ cells: this.state.cells })
  }

  render () {
    return (
      <div className='uk-container'>
        {this.state.cells.map((cell, index) => (
          <CellComponent
            key={cell.Id}
            Notebook={this}
            Cell={cell}
          ></CellComponent>
        ))}
        <a href='#' uk-totop='true'></a>
      </div>
    )
  }
}

export default NotebookComponent
