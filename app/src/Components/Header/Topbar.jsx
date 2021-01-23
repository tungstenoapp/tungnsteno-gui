import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAtom } from '@fortawesome/free-solid-svg-icons'

function Topbar () {
  return (
    <div uk-sticky='sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky'>
      <nav className='uk-navbar uk-navbar-container uk-margin'>
        {/*
                  <div className='uk-navbar-left'>
          <a
            className='uk-navbar-toggle'
            uk-toggle='target: #nav-primary'
            uk-navbar-toggle-icon=''
          ></a>
        </div>
          */}

        <div className='uk-navbar-center'>
          <a className='uk-navbar-item uk-logo'>
            <FontAwesomeIcon className='uk-margin-small-right' icon={faAtom} />{' '}
            Tungsteno v1.1
          </a>
        </div>

        {/*
                  <div className='uk-navbar-right'>
          <div>
            <a className='uk-navbar-toggle' uk-search-icon='true' href='#'></a>
            <div
              className='uk-drop'
              uk-drop='mode: click; pos: left-center; offset: 0'
            >
              <form className='uk-search uk-search-navbar uk-width-1-1'>
                <input
                  className='uk-search-input'
                  type='search'
                  placeholder='Search...'
                  autoFocus
                ></input>
              </form>
            </div>
          </div>
        </div>
          */}
      </nav>
    </div>
  )
}

export default Topbar
