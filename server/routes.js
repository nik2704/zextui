const { Counter } = require( '../src/components/counter' );

module.exports = [
    {
        path: '/',
        exact: true,
        component: Counter,
    }
];