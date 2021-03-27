import Topbar from './Header/Topbar'
import Navbar from './Header/Navbar'

function Header (props) {
  return (
    <header>
      <Topbar></Topbar>
      <Navbar updateNotebook={props.updateNotebook}></Navbar>
    </header>
  )
}

export default Header
