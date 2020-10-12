class Tungsteno {

    constructor(options) {
        let Controllers = {
            'notebook': Notebook
        };

        this.options = options;
        this.controller = new Controllers[this.options.app](this);

        this.controller.initController();

        document.title = "Tungsteno - Untitled.nb"
    }

    getOption(key) {
        return this.options[key];
    }
}