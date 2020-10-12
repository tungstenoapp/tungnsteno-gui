class Tungsteno {

    constructor(options) {
        let Controllers = {
            'notebook': Notebook
        };

        this.options = options;
        this.controller = new Controllers[this.options.app](this);

        this.controller.initController();

        if (options.eel_configuration.hasOwnProperty('input_file')) {
            document.title = "Tungsteno - " + options.eel_configuration.input_file.split('\\').pop().split('/').pop();
        } else {
            document.title = "Tungsteno - Untitled.nb"
        }
    }

    getOption(key) {
        return this.options[key];
    }
}