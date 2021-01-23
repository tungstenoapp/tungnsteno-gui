import Cell from './Notebook/Cell'

class Notebook {
  constructor (notebookComponent) {
    this.cells = []
    this.NotebookComponent = notebookComponent
  }

  createNewCell () {
    console.debug('Creating a new cell')
    this.cells.push(new Cell(this.cells.length + 1))

    if (this.NotebookComponent) {
      this.NotebookComponent.setState({
        cells: this.cells
      })
    }
  }
}

export default Notebook
