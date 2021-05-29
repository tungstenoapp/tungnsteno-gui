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

    let output = {}

    if (props.Cell.output) {
      output = props.Cell.output
    }

    if (output.manipulate_result) {
      delete output.manipulate_result;
    }
    this.state = {
      output: output
    }

    this.handleEvaluateCell = this.evaluateCell.bind(this)
    this.handleUpdateInputValue = this.updateInputValue.bind(this)
    this.handleUpdateManipulate = this.updateManipulate.bind(this)
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
    if (this.props.Cell.Id === this.props.Notebook.state.cells.length) {
      this.props.Notebook.createNewCell()
    }

    eel
      .evaluate(this.props.Cell.value)()
      .then(output => {
        this.props.Cell.output = output
        this.setState({
          output
        })
      })
  }

  updateInputValue (value) {
    this.props.Cell.value = value
  }

  updateManipulate(event) {
    let allVariablesNodes = event.currentTarget.parentNode.parentNode.childNodes
    let variablesReferences = {}

    for (let i = 0; i < allVariablesNodes.length; i++) {
      let variableNode = allVariablesNodes[i].childNodes[1];
      variablesReferences[variableNode.getAttribute('variablename')] = parseFloat(variableNode.value)
    }

    let outputField = event.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1];

    eel
    .evaluate_manipulate(outputField.getAttribute('expr'), variablesReferences)()
    .then(output => {
      let currentOutput = this.state.output;
      currentOutput.manipulate_result = this.output2html(output)
      this.setState({
        output: currentOutput
      })
    })
  }

  output2html(inputOutput) {
    let output = "";
    switch (inputOutput.processor) {
      case 'default':
        output = <pre>{inputOutput.result}</pre>
        break
      case 'manipulate':
        let ranges = inputOutput.ranges.map((range) => (
          <div className='uk-margin'>
            {range[0]}
            <input variablename={range[0]} onChange={this.handleUpdateManipulate} min={range[1]} max={range[2]} step={range[3]} className='uk-range' type='range'></input>
          </div>
        ) );

        if (!inputOutput.manipulate_result) {
          inputOutput.manipulate_result = ""
        }

        output = (      
          <div className="uk-card ">
            <div className="uk-card-header">
              <span class="uk-label uk-label-warning">interactive</span>
              <form>
                <fieldset className="uk-fieldset">
                    {ranges}
                </fieldset>
              </form>
            </div>
            <div expr={inputOutput.expr} className="uk-card-body">
              {inputOutput.manipulate_result}
            </div>
            <div className="uk-card-footer"></div>
          </div>
        )
        break
      case 'plot':
        output = (
          <center
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            <Plot
              data={inputOutput.plot_data}
              layout={{
                autosize: true
              }}
              useResizeHandler='true'
              style={{
                width: '100%',
                height: '100%'
              }}
            />
          </center>
        )
        break
      case 'error':
        output = <pre class='uk-text-danger'>{inputOutput.error}</pre>
        break
    }
    return output
  }

  render () {
    let output

    if (this.state.output) {
        output = this.output2html(this.state.output)
    }

    return (
      <div className='uk-card uk-card-default uk-width-1-1 uk-margin uk-box-shadow-hover-medium uk-box-shadow-small'>
        <div className='uk-card-header'>
          <a
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
              name={this.props.Cell.Id}
              value={this.props.Cell.value}
              onChange={this.handleUpdateInputValue}
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
