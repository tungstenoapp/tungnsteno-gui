class DefaultProcessor {
    eval(result, cell) {
        cell.output = result.output;
        cell.output_type = 'default';

        setTimeout(function () {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }, 100);
    }
};