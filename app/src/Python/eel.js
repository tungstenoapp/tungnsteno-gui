if (!window['eel']) {
    window['eel'] = {
        suggestions: function (prefix) {
            return function () {
                return Promise.resolve([{
                    name: "autocomplete_1",
                    value: "autocomplete_2",
                    score: 1,
                    meta: "development autocomplete"
                }])
            }
        },
        evaluate: function (code) {
            return function () {
                return Promise.resolve('Hello world!')
            }
        }
    }
}

export const eel = window["eel"];