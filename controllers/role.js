'use strict';

var db = require('../models');

module.exports = function (server) {

    /**
     * Retrieve a list of all role
     */
    server.get('/role', function (req, res) {

        db.Role
          .findAll()
          .complete(function(err, roles) {
            if (err) {
                //console.log('An error occurred:', err)
                var model =
                {
                    pagetitle: "Admin",
                    action: "list",
                    errormessage: "An error occurred.",
                    roles: ""
                };
                // show error message
                res.render('role', model);

            } else {
                var model =
                {
                    pagetitle: "Admin",
                    action: "List",
                    roles: roles
                };

                res.render('role', model);
            }
        })
    });


    /**
     * Display Form to Add new role.
     */
    server.get('/role/form', function (req, res) {

        var model =
        {
            pagetitle: "Admin",
            action: "Add",
            role: ""
        };

        res.render('roleform', model);

    });



    /**
     * Display Form to Edit role
     * Retrieve role's info by Id for editing.
     */
    server.get('/role/:id', function (req, res) {

        //req.body.id  // can not use this

        db.Role
          .find({ where: { id: req.params.id } })
          .complete(function(err, roles) {
            if (err) {
                //console.log('An error occurred:', err)
                var model =
                {
                    pagetitle: "Admin",
                    action: "list",
                    errormessage: "An error occurred.",
                    role: ""
                };
                // show error mesage
                res.render('role', model);

            } else {

                if(roles) {
                    var model =
                    {
                        pagetitle: "Admin",
                        action: "Edit",
                        role: roles
                    };

                    res.render('roleform', model);

                }else{
                    // role not found
                    var model =
                    {
                        pagetitle: "Admin",
                        action: "list",
                        errormessage: "Role not found.",
                        role: ""
                    };
                    // show error mesage
                    res.render('role', model);

                }

            }
        })
    });


    /**
     * Edit a Role information
     */
    server.post('/role/edit', function (req, res) {

        var Name = req.body.name && req.body.name.trim();
        var Job = req.body.job_desc && req.body.job_desc.trim();

        db.Role
            .update({
                name: Name,
                level: req.body.level,
                job_desc: Job },
                '`id` = "'+ req.body.id +'"'
            )
            .complete(function(err, cands) {
            if (err) {
                console.log('An error occurred:', err)
                var model =
                {
                    pagetitle: "Admin",
                    action: "Edit",
                    errormessage: "An error occurred.",
                    role: ""
                };

                // show error message
                res.render('roleform', model);

            } else {

                db.Role
                    .find({ where: { id: req.body.id } })
                    .complete(function(err, roles) {
                        var model =
                        {
                            pagetitle: "Admin",
                            action: "Edit",
                            editmessage: "Edit successfully.",
                            role: roles
                        };
                        res.render('roleform', model);
                    })
            }
        })
    });


    /**
     * Delete a role.
     * @param: req.body.role_id Is the unique id of the role to remove.
     *
     * Need to check in used before delete?
     */
    server.delete('/role', function (req, res) {

        db.Role.find({ where: { id: req.body.role_id } })
            .success(function(role) {
                role.destroy().success(function() {

                    db.Role.findAll()
                        .complete(function(err, roles) {
                            var model =
                            {
                                pagetitle: "Admin",
                                action: "delete",
                                delmessage: "Role has been deleted successfully.",
                                roles: roles
                            };
                            res.render('role', model);
                        })
                })
            })

        /*  why is not working?
        db.Role.destroy({id: req.body.role_id}, function (err) {
            if (err) {
                console.log('Remove error: ', err);
            }
            res.redirect('/role');
        });*/

    });


    /**
     * Add a new role to the database.
    */
    server.post('/role/add', function (req, res) {

        var Name = req.body.name && req.body.name.trim();
        var Job = req.body.job_desc && req.body.job_desc.trim();

        /*
        //Input checking
        if (Name === '') {
            res.redirect('/role');
            return;
        }
        */

        db.Role
          .create({
                name: Name,
                level: req.body.level,
                job_desc: Job
            })
            .success(function() {
                res.redirect('/role');
            })

    });


};
