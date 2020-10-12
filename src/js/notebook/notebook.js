class Notebook {

    constructor(tungsteno) {
        this.vues = {};
        this.cell_id_generator = 0;
        this.tungsteno = tungsteno;
        this.cells = [];

        if (tungsteno.options.eel_configuration.hasOwnProperty('input_file')) {
            let input_file = tungsteno.options.eel_configuration.input_file;

            eel.read_file(input_file)()
                .then(notebook => {
                    this.parseNotebook(notebook);
                })
        } else {
            this.createCell();
        }
    }

    parseAuto(el) {
        switch (el.__cls__) {
            case 'cell':
                return this.parseCell(el);
            case 'cell_group_data':
                return this.parseCellGroupData(el);
            case 'box_data':
                return this.parseBoxData(el);
            case 'row_box':
                return this.parseRowBox(el);
        }
    }

    parseNotebook(notebook) {
        for (let i = 0; i < notebook.cells.length; i++) {
            this.parseAuto(notebook.cells[i]);
        }
    }

    parseRowBox(row_box) {
        return row_box.boxes.join('');
    }

    parseBoxData(box_data) {
        return this.parseAuto(box_data.boxes);
    }

    parseCellGroupData(cell_group) {
        for (let i = 0; i < cell_group.cells.length; i++) {
            this.parseAuto(cell_group.cells[i]);
        }
    }

    parseCell(cell) {
        let parse_result = this.parseAuto(cell.content);

        if (cell.status == 'Input') {
            this.cells.push(new Cell(this, this.cell_id_generator++, parse_result));
        }

    }

    getTungsteno() {
        return this.tungsteno;
    }

    initController() {
        Vue.component('plotly', {
            template: `<div></div>`,
            props: ['data', 'options'],
            updated() {
                Plotly.newPlot(this.$el, this.data, this.options);
            },
            mounted() {
                Plotly.newPlot(this.$el, this.data, this.options);
            }
        });

        this.vues['notebook'] = new Vue({
            el: '.notebook',
            data: {
                cells: this.cells,
                loading_color: 'white',
            },
            methods: {
                disableShiftEnter: function ($event) {
                    if ($event.shiftKey && $event.keyCode === 13) {
                        $event.preventDefault();
                        return false;
                    }
                }
            }
        })
    }

    createCellIfNeeded(cell) {
        if (!this.cells[cell.cell_id + 1]) {
            this.createCell();
        }
    }

    createCell() {
        this.cells.push(new Cell(this, this.cell_id_generator++));
    }
}