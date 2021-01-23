import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools'

import Plot from 'react-plotly.js'

import TungstenoMode from './AceMode/Tungsteno'

import { eel } from '../../Python/eel'

import '../../Styles/cell.css'

class CellComponent extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      output: {}
    }

    this.handleEvaluateCell = this.evaluateCell.bind(this)
  }

  componentDidMount () {
    this.refs.codeEditor.editor.getSession().setMode(new TungstenoMode())

    addCompleter({
      getCompletions: function (editor, session, pos, prefix, callback) {
        eel
          .suggestions(prefix)()
          .then(suggestions => {
            callback(null, suggestions)
          })
      }
    })
  }

  evaluateCell () {
    if (this.props.Cell.Id === this.props.Notebook.cells.length) {
      this.props.Notebook.createNewCell()
    }

    eel
      .evaluate(this.refs.codeEditor.editor.getValue())()
      .then(output => {
        this.setState({
          output
        })
      })
  }

  render () {
    let output

    if (this.state.output) {
      switch (this.state.output.processor) {
        case 'default':
          output = this.state.output.result
          break
        case 'plot':
          console.log(this.state.output)
          output = (
            <center>
              <Plot
                data={this.state.output.plot_data}
                layout={{
                  autosize: true
                }}
              />
            </center>
          )
          break
      }
    }

    return (
      <div className='uk-card uk-card-default uk-width-1-1 uk-margin uk-box-shadow-hover-medium uk-box-shadow-small'>
        <div className='uk-card-header'>
          <a
            href='#'
            onClick={this.handleEvaluateCell}
            className='uk-icon-button uk-button-success uk-margin-small-right'
          >
            <FontAwesomeIcon icon={faPlay} />
          </a>

          <div className='uk-card-badge uk-label'>#{this.props.Cell.Id}</div>
        </div>
        <div className='uk-card-body'>
          <div className='uk-editor'>
            <AceEditor
              ref='codeEditor'
              mode='javascript'
              theme='github'
              name='{this.props.Cell.Id}'
              width='100%'
              height='auto'
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showGutter: false,
                minLines: 1,
                maxLines: 50,
                fontSize: 16
              }}
              commands={[
                {
                  name: 'evaluate',
                  bindKey: { win: 'Shift-enter', mac: 'Shift-enter' },
                  exec: this.handleEvaluateCell
                }
              ]}
            />
          </div>
        </div>
        <div className='uk-card-footer'>{output}</div>
      </div>
    )
  }
}

export default CellComponent
