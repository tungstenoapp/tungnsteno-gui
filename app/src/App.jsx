import Header from './Components/Header'
import Notebook from './Components/Notebook'

let Cells = []
let NotebookProperties = {}

function App () {
  return (
    <>
      <Header></Header>

      <Notebook Cells={Cells} Properties={NotebookProperties}></Notebook>
    </>
  )
}

export default App
