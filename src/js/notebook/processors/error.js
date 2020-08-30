class ErrorProcessor {
    eval(result, cell) {
        cell.output = result.error.replace(/(?:\r\n|\r|\n)/g, '<br>');
        cell.output = cell.output.replace(/(\s)/g, '&nbsp;');

        cell.output_type = 'error';
    }
};