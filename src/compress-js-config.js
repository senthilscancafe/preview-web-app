({
    baseUrl: 'assets/js',
    waitSeconds: 0,
    'paths': {
        'Augment': 'thirdparty/augment/augment',
        'Path': 'thirdparty/path/path',
        'hbs': 'thirdparty/hbs',
        'PubSub': 'thirdparty/pubsub',
        'branch':'thirdparty/branch/branch',
        'parse':'thirdparty/parse/parse',
        'keen': 'thirdparty/keenio/keenio',
        'braintree': 'thirdparty/braintree/client.min',
        'hostedFields': 'thirdparty/braintree/hosted-fields.min',
        'dataCollector': 'thirdparty/braintree/data-collector.min',
        'lockr':'thirdparty/lockr/lockr',
        'moment':'thirdparty/moment/moment.min',
        'xss': 'thirdparty/xss/xss',
        'libphonenumber':'thirdparty/libphonenumber/libphonenumberjs',
        'currencyFormatter':'thirdparty/currency/accounting'
    },
    shim: {
        'Path': {
            exports: 'Path'
        },
        'xss': {
            exports: 'filterXSS'
        }
    },
    name: "main",
    out: "assets/compressed/main.min.js"
})