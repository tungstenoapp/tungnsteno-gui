const PLOT_POINTS = 100;

function linspace(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}

class PlotProcessor {
    eval(result, cell) {

        if (!cell.plot) {
            cell.plot = {};
        }

        cell.plot.options = {};

        let x = linspace(0, 10, PLOT_POINTS);
        let y = x.map(x => {
            return Math.sin(x);
        });

        cell.plot.data = [{
            x,
            y,
        }];


        cell.output_type = 'plot';
    }
};