'use strict';


var HomeModel = require('../models/home');


module.exports = function (app) {

    var model = new HomeModel();


    app.get('/', function (req, res) {

        res.render('index', model);

    });

};
