import React from 'react'

import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAtom } from '@fortawesome/free-solid-svg-icons'
import { eel } from '../../Python/eel'

class Topbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchValue: '',
      searchResults: [],
      version: 'no-version'
    }

    this.bindSearchFunctions = this.searchFunctions.bind(this)
  }

  searchFunctions(ev) {
    this.setState({ searchValue: ev.target.value })
    eel
      .searchFunction(ev.target.value)()
      .then(searchResults => this.setState({ searchResults }))
  }

  async componentDidMount() {
    this.setState({ version: await eel.getVersion()() })
  }

  render() {
    return (
      <div uk-sticky='sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky'>
        <nav className='uk-navbar uk-navbar-container uk-margin'>
          <div className='nav-overlay uk-navbar-left'>
            <a
              className='uk-navbar-toggle'
              uk-toggle='target: #nav-primary'
              uk-navbar-toggle-icon=''
            ></a>
          </div>

          <div className='nav-overlay uk-navbar-center'>
            <a className='uk-navbar-item uk-logo'>
              <FontAwesomeIcon
                className='uk-margin-small-right'
                icon={faAtom}
              />
              {this.state.version}
            </a>
          </div>

          <div className='uk-navbar-right'>
            <div>
              <a
                className='uk-navbar-toggle'
                uk-search-icon='true'
                href='#'
                uk-toggle="target: .nav-overlay; animation: uk-animation-fade"
              ></a>

            </div>
          </div>

          <div class="nav-overlay uk-navbar-left uk-flex-1" hidden>

            <div class="uk-navbar-item uk-width-expand">
              <form className='uk-search uk-search-navbar uk-width-1-1'>
                <input
                  className='uk-search-input'
                  type='search'
                  placeholder='Search...'
                  onChange={this.bindSearchFunctions}
                  value={this.state.searchValue}
                  autoFocus
                ></input>
                <div
                  uk-drop='mode: click; offset: 20'
                  style={{
                    visibility:
                      this.state.searchResults.length != 0
                        ? 'visible'
                        : 'hidden'
                  }}
                >
                  {this.state.searchResults.map((searchResult, i) => {
                    let abstract = ''
                    if (searchResult.description.split('\n').length > 0) {
                      abstract = searchResult.description.split('\n')[1]
                    }

                    return (
                      <div className='uk-card uk-card-default'>
                        <div className='uk-card-body'>
                          <div className='uk-card-badge uk-label'>
                            Builtin
                          </div>

                          <h3 className='uk-card-title uk-margin-remove-bottom'>
                            {searchResult.functionName}
                          </h3>
                          <p>
                            <ReactMarkdown
                              children={abstract}
                            ></ReactMarkdown>
                          </p>
                        </div>
                        <div className='uk-card-footer'>
                          <a
                            href='#'
                            data-uk-toggle={
                              'target: #' + searchResult.functionName
                            }
                            className='uk-button uk-button-text'
                          >
                            Read more
                          </a>
                        </div>
                        <div id={searchResult.functionName} data-uk-modal>
                          <div className='uk-modal-dialog uk-modal-body'>
                            <button
                              className='uk-modal-close-default'
                              type='button'
                              data-uk-close
                            ></button>
                            <h2 className='uk-modal-title'>
                              {searchResult.functionName}
                            </h2>
                            <ReactMarkdown>
                              {searchResult.description}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </form>
            </div>

            <a class="uk-navbar-toggle" uk-close uk-toggle="target: .nav-overlay; animation: uk-animation-fade" href="#"></a>

          </div>
        </nav>
        {this.state.searchResults.map((searchResult, i) => {
          return ''
        })}
      </div>
    )
  }
}

export default Topbar
