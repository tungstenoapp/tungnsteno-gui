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

    process_tsteno(result) {
        if (this.processors.hasOwnProperty(result.processor)) {
            this.processors[result.processor].eval(result, this);
        }

        this.loading = false;
    }

    evaluate() {
        this.loading = true;

        let eval_result = this.evaluator(this.input);

        if (typeof (eval_result) === 'function') {
            eval_result(this.process_tsteno.bind(this));
        } else {
            this.process_tsteno(eval_result);
        }

        this.notebook.createCellIfNeeded(this);
    }
}