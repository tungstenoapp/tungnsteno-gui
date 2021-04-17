import React from 'react'

import Header from './Components/Header'
import Notebook from './Components/Notebook'
import Cell from './Controllers/Notebook/Cell'
import { eel } from './Python/eel'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdateNotebook = this.updateNotebook.bind(this)
    this.handleDumpCells = this.dumpCells.bind(this)

    setInterval(async () => {
      await eel.ping()
    }, 1000)
  }

  dumpCells () {
    return this.refs.notebook.state.cells
  }

  updateNotebook (cells, notebookProperties) {
    cells.push(new Cell(cells.length + 1, ''))

    this.refs.notebook.setState({
      cells: cells,
      notebookProperties: notebookProperties
    })
  }

  render () {
    return (
      <>
        <Header
          dumpCells={this.handleDumpCells}
          updateNotebook={this.handleUpdateNotebook}
        ></Header>
        <Notebook ref='notebook'></Notebook>
      </>
    )
  }
}

export default App
