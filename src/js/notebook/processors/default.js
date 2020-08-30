class DefaultProcessor {
    eval(result, cell) {
        cell.output = result.output;
        cell.output_type = 'default';
    }
};