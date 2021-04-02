import React from 'react'

import Cell from '../Controllers/Notebook/Cell'
import CellComponent from './Notebook/Cell'

class NotebookComponent extends React.Component {
  constructor (props) {
    super(props)

    if (window.localStorage.getItem('auto_save_nb')) {
      this.state = {
        cells: JSON.parse(window.localStorage.getItem('auto_save_nb'))
      }
    } else {
      this.state = { cells: [] }
    }

    setInterval(this.saveOnLocalStorage.bind(this), 10000)
  }

  saveOnLocalStorage () {
    window.localStorage.setItem(
      'auto_save_nb',
      JSON.stringify(this.state.cells)
    )
  }

  componentDidMount () {
    if (this.state.cells.length == 0) {
      this.createNewCell()
    }
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
