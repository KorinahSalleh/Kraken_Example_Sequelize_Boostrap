'use strict';

var db = require('../models');


module.exports = function (server) {

    /**
     * Retrieve a list of all candidates
     */
    server.get('/candidates', function (req, res) {

        db.Candidate
          .findAll()
          .complete(function(err, cands) {
            if (err) {
                //console.log('An error occurred:', err)
                var model =
                {
                    pagetitle: "Candidate",
                    action: "list",
                    errormessage: "An error occurred.",
                    candidates: ""
                };
                // show error message
                res.render('candidates', model);

            } else {
                var model =
                {
                    pagetitle: "Candidate",
                    action: "List",
                    candidates: cands
                };

                //res.json(model);  // debug
                res.render('candidates', model);
            }
        })
    });


    /**
     * Display Form to Add new candidate.
     */
    server.get('/candidates/form', function (req, res) {

        var model =
        {
            pagetitle: "Candidate",
            action: "Add",
            candidates: ""
        };

        res.render('candidatesform', model);

    });



    /**
     * Display Form to Edit candidate
     * Retrieve candidate's info by Id for editing.
     */
    server.get('/candidates/:id', function (req, res) {

        //req.body.id  // can not use this

        db.Candidate
          .find({ where: { id: req.params.id } })
          .complete(function(err, cands) {
            if (err) {
                //console.log('An error occurred:', err)
                var model =
                {
                    pagetitle: "Candidate",
                    action: "list",
                    errormessage: "An error occurred.",
                    candidates: ""
                };
                // show error mesage
                res.render('candidates', model);

            } else {

                if(cands) {
                    var model =
                    {
                        pagetitle: "Candidate",
                        action: "Edit",
                        candidates: cands
                    };

                    res.render('candidatesform', model);

                }else{
                    // candidate not found
                    var model =
                    {
                        pagetitle: "Candidate",
                        action: "list",
                        errormessage: "Candidate not found.",
                        candidates: ""
                    };
                    // show error mesage
                    res.render('candidates', model);

                }


            }
        })
    });


    /**
     * Edit a Candidate information
     */
    server.post('/candidates/edit', function (req, res) {

        var name = req.body.full_name && req.body.full_name.trim();
        var status = req.body.status;

        db.Candidate
            .update({ full_name: name, status: status }, '`id` = "'+ req.body.id +'"')
            .complete(function(err, cands) {
            if (err) {
                console.log('An error occurred:', err)
                var model =
                {
                    pagetitle: "Candidate",
                    action: "Edit",
                    errormessage: "An error occurred.",
                    candidates: ""
                };

                // show error message
                res.render('candidatesform', model);

            } else {

                db.Candidate
                    .find({ where: { id: req.body.id } })
                    .complete(function(err, cands) {
                        var model =
                        {
                            pagetitle: "Candidate",
                            action: "Edit",
                            editmessage: "Edit successfully.",
                            candidates: cands
                        };

                        // show edit successfully status
                        res.render('candidatesform', model);
                    })
            }
        })
    });


    /**
     * Delete a candidate.
     * @param: req.body.cand_id Is the unique id of the candidate to remove.
     *
     */
    server.delete('/candidates', function (req, res) {

        db.Candidate
            .find({ where: { id: req.body.cand_id } })
            .success(function(cand) {
                cand.destroy().success(function() {

                    db.Candidate.findAll()
                        .complete(function(err, cands) {
                            var model =
                            {
                                pagetitle: "Candidate",
                                action: "delete",
                                delmessage: "Candidate has been deleted successfully.",
                                candidates: cands
                            };
                            // show remove successfully status
                            res.render('candidates', model);
                            //res.redirect('/candidates')
                        })
                })
            })

        /*  why is not working?
        db.Candidate.destroy({id: req.body.cand_id}, function (err) {
            if (err) {
                console.log('Remove error: ', err);
            }
            res.redirect('/candidates');
        });*/
    });


    /**
     * Add a new candidate to the database.
    */
    server.post('/candidates/add', function (req, res) {

        var Name = req.body.full_name && req.body.full_name.trim();
        var Status = "WAIT";

        /*
        //Input checking - empty or duplicate?
        if (name === '') {

            return;
        }
        */

        db.Candidate
          .create({
            full_name: Name,
            status: Status
          })
          .success(function() {
            res.redirect('/candidates');
          })

    });


};
