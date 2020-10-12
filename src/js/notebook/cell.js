class Cell {

    constructor(notebook, cell_id, input = '') {
        this.notebook = notebook;
        this.cell_id = cell_id;

        this.input = input;
        this.output_type = null;

        this.hide_input = false;
        this.loading = false;
        this.suggestions = [];

        this.evaluator = this.notebook.getTungsteno().getOption('evaluator');

        if (!this.evaluator) {
            this.evaluator = eel.tsteno_eval;
        }
        this.fnsuggestions = this.notebook.getTungsteno().getOption('suggestions');

        if (!this.fnsuggestions) {
            this.fnsuggestions = eel.suggestions;
        }
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

    autocompleteIndex(index) {
        let suggestion = this.suggestions[index];

        console.log(this.suggestions)
        if (typeof (suggestion) === 'undefined') {
            return;
        }
        this.input += suggestion['append'];
        this.suggestions.splice(0, this.suggestions.length);
    }

    autocomplete(e) {
        this.autocompleteIndex(0);

        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();

        return e.preventDefault();
    }

    refreshSuggestions() {
        this.fnsuggestions(this.input)()
            .then(suggestions => {
                this.suggestions = suggestions;
            });
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