class Notebook {

    constructor(tungsteno) {
        this.vues = {};
        this.cell_id_generator = 0;
        this.tungsteno = tungsteno;
        this.cells = [];

        this.createCell();
    }

    getTungsteno() {
        return this.tungsteno;
    }

    // https://github.com/invokemedia/vue-suggest/blob/master/index.js
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