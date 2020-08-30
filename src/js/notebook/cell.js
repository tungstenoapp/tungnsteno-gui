class Cell {

    constructor(notebook, cell_id) {
        this.notebook = notebook;
        this.cell_id = cell_id;

        this.input = '';
        this.output_type = null;

        this.hide_input = false;
        this.loading = false;

        this.evaluator = this.notebook.getTungsteno().getOption('evaluator');

        this.processors = {
            'default': new DefaultProcessor(),
            'plot': new PlotProcessor(),
            'error': new ErrorProcessor(),
        };
    }

    hideInput() {
        if (this.output_type) {
            this.hide_input = !this.hide_input;
        }
    }

    evaluate() {
        this.loading = true;

        this.evaluator(this.input)(function (result) {
            if (this.processors.hasOwnProperty(result.processor)) {
                this.processors[result.processor].eval(result, this);
            }

            this.loading = false;

        }.bind(this));

        this.notebook.createCellIfNeeded(this);
    }
}