'use strict';

var db = require('../models');

module.exports = function (server) {

    /**
     * Retrieve a list of all candidates, join table Role
     */
    server.get('/candidates', function (req, res) {

        db.Candidate.findAll({include: [db.Role], attributes: ['id','full_name','status']})
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

        // get Roles
        db.Role.findAll({attributes: ['id','name','level']})
            .success(function(roles) {
                var model =
                {
                    pagetitle: "Candidate",
                    action: "Add",
                    rolelists:roles,
                    candidates: ""
                };
                res.render('candidatesform', model);
           })

    });


    /**
     * Display Form to Edit candidate
     * Retrieve candidate's info by Id for editing.
     */
    server.get('/candidates/:id', function (req, res) {

        db.Candidate.find({ where: {id: req.params.id}, include: [db.Role], attributes: ['id','full_name','status']})
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

                        // get Roles
                        db.Role.findAll({attributes: ['id','name','level']})
                            .success(function(roles) {

                                var model =
                                {
                                    pagetitle: "Candidate",
                                    action: "Edit",
                                    rolelists:roles,
                                    candidates: cands
                                }
                                res.render('candidatesform', model);
                            })

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

        db.Candidate
            .update({
                full_name: name,
                status: req.body.status,
                RoleId: req.body.role_id },
                '`id` = "'+ req.body.id +'"'
            )
            .complete(function(err, cands) {
                if (err) {
                    //console.log('An error occurred:', err)
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

                    db.Candidate.find({ where: {id: req.body.id}, include: [db.Role], attributes: ['id','full_name','status']})
                        .complete(function(err, cands) {

                            db.Role.findAll({attributes: ['id','name','level']})
                                .success(function(roles) {
                                    var model =
                                    {
                                        pagetitle: "Candidate",
                                        action: "Edit",
                                        editmessage: "Edit successfully.",
                                        rolelists:roles,
                                        candidates: cands
                                    };
                                    res.render('candidatesform', model);
                                })
                        })
                }
            })

    });


    /**
     * Delete a candidate.
     * @param: req.body.cand_id Is the unique id of the candidate to remove.
     *
     * Should delete all candidate's data? e.g schedule
     */
    server.delete('/candidates', function (req, res) {

        //req.param('cand_id')  // or use this?

        db.Candidate.find({ where: { id: req.body.cand_id } })
            .success(function(cand) {
                cand.destroy().success(function() {

                    // Back to candidates list
                    db.Candidate.findAll({include: [db.Role], attributes: ['id','full_name','status']})
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
                        })
                })
            })
    });


    /**
     * Add a new candidate to the database.
    */
    server.post('/candidates/add', function (req, res) {

        var FullName = req.body.full_name && req.body.full_name.trim();

        /*
        //Input checking
        if (name === '') {
            res.redirect('/candidate');
            return;
        }
        */

        db.Candidate
          .create({
            full_name: FullName,
            status: "WAIT",
            RoleId: req.body.role_id
          })
          .success(function() {
            res.redirect('/candidates');
          })

    });


};
