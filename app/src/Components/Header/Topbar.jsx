import React from 'react'

import ReactMarkdown from 'react-markdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAtom } from '@fortawesome/free-solid-svg-icons'
import { eel } from '../../Python/eel'

class Topbar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchValue: '',
      searchResults: []
    }

    this.bindSearchFunctions = this.searchFunctions.bind(this)
  }

  searchFunctions (ev) {
    this.setState({ searchValue: ev.target.value })
    eel
      .searchFunction(ev.target.value)()
      .then(searchResults => this.setState({ searchResults }))
  }
  render () {
    let searchResults = 'No results'

    if (this.state.searchResults.length > 0) {
      searchResults = ''

      for (let i = 0; i < this.state.searchResults.length; i++) {
        let searchResult = this.state.searchResults[i]

        searchResults += <strong>{searchResult.functionName}</strong>
      }
    }

    console.log(this.state.searchResults.length)

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
              <FontAwesomeIcon
                className='uk-margin-small-right'
                icon={faAtom}
              />{' '}
              Tungsteno v1.1
            </a>
          </div>

          <div className='uk-navbar-right'>
            <div>
              <a
                className='uk-navbar-toggle'
                uk-search-icon='true'
                href='#'
              ></a>
              <div uk-drop='mode: click; pos: left-center; offset: 0'>
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
                      return (
                        <div class='uk-card uk-card-default'>
                          <div class='uk-card-body'>
                            <div class='uk-card-badge uk-label'>Builtin</div>

                            <h3 class='uk-card-title uk-margin-remove-bottom'>
                              {searchResult.functionName}
                            </h3>
                            <p>
                              <ReactMarkdown
                                children={searchResult.description.substring(
                                  0,
                                  30
                                )}
                              ></ReactMarkdown>
                            </p>
                          </div>
                          <div class='uk-card-footer'>
                            <a href='#' class='uk-button uk-button-text'>
                              Read more
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Topbar
