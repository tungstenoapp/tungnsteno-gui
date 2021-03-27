import React from 'react'

import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { eel } from '../../Python/eel'

import Cell from '../../Controllers/Notebook/Cell'

function Navbar (props) {
  const uploadFile = React.useRef(null)

  const { t, i18n } = useTranslation('common')

  let cell_id_generator = 1

  function openNewFile () {
    uploadFile.current.click()
  }

  function parseAuto (cells, el) {
    switch (el.__cls__) {
      case 'cell':
        return parseCell(cells, el)
      case 'cell_group_data':
        return parseCellGroupData(cells, el)
      case 'box_data':
        return parseBoxData(cells, el)
      case 'row_box':
        return parseRowBox(cells, el)
    }
  }

  function parseNotebook (notebook) {
    let cells = []
    for (let i = 0; i < notebook.cells.length; i++) {
      parseAuto(cells, notebook.cells[i])
    }

    return cells
  }

  function parseRowBox (cells, row_box) {
    return row_box.boxes.join('')
  }

  function parseBoxData (cells, box_data) {
    return parseAuto(cells, box_data.boxes)
  }

  function parseCellGroupData (cells, cell_group) {
    for (let i = 0; i < cell_group.cells.length; i++) {
      parseAuto(cells, cell_group.cells[i])
    }
  }

  function parseCell (cells, cell) {
    let parse_result = parseAuto(cells, cell.content)

    if (cell.status == 'Input') {
      cells.push(new Cell(cell_id_generator++, parse_result))
    }
  }

  function handleNewNotebook () {
    var reader = new FileReader()
    reader.onload = async function (event) {
      let cells = parseNotebook(await eel.read_notebook(event.target.result)())

      cell_id_generator = 0
      props.updateNotebook(cells, {})
    }
    reader.readAsText(uploadFile.current.files[0])
  }

  return (
    <div id='nav-primary' uk-offcanvas='overlay: true'>
      <div className='uk-offcanvas-bar uk-flex uk-flex-column'>
        <ul className='uk-nav uk-nav-primary uk-nav-center uk-margin-auto-vertical'>
          <li className='uk-parent'>
            <a href='#' tabindex='-1'>
              <FontAwesomeIcon
                className='uk-margin-small-right'
                icon={faFile}
              />
              {t('FILE_HEADER_MENU')}{' '}
            </a>
            <ul class='uk-nav-sub'>
              <li>
                <input
                  onChange={handleNewNotebook}
                  ref={uploadFile}
                  style={{ display: 'none' }}
                  type='file'
                />

                <a href='#' onClick={openNewFile}>
                  <FontAwesomeIcon
                    className='uk-margin-small-right'
                    icon={faFileUpload}
                  />{' '}
                  {t('FILE_HEADER_MENU_OPEN')}{' '}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
