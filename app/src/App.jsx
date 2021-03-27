import React from 'react'

import Header from './Components/Header'
import Notebook from './Components/Notebook'
import Cell from './Controllers/Notebook/Cell'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdateNotebook = this.updateNotebook.bind(this)
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
        <Header updateNotebook={this.handleUpdateNotebook}></Header>
        <Notebook ref='notebook'></Notebook>
      </>
    )
  }
}

export default App
