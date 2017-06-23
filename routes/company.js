var express = require('express');
var Company = require('../models/company');
var LTT = require('list-to-tree');

var companiesRouter = express.Router();

companiesRouter
    .route('/companies')
    .get((req, res) => {
        console.log('GET /companies');

        Company.find((err, companies) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            /*
                Parameters: nodes - array with non-calculated fullEarnigns
            */
            function calculateFullEarnings(nodes) {
                let sumOfBranch = 0;
                nodes.forEach(company => {
                    company.fullEarnings = company.earnings;

                    // Find children for current branch
                    var children = companies.filter((item) => { return item.parentId == company.id });

                    if (children == []) {
                        company.fullEarnings = company.earnings;
                    } else {
                        company.fullEarnings += calculateFullEarnings(children);
                    }

                    // Sum all node in current branch
                    sumOfBranch += company.fullEarnings;
                }, this);

                return sumOfBranch;
            }

            calculateFullEarnings(companies);


            // Build a tree
            var ltt = new LTT(companies, {
                key_id: 'id',
                key_parent: 'parentId'
            });
            var tree = ltt.GetTree();

            res.json(tree);
        });
    })
    .post((req, res) => {
        Company.find((err, companies) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            let index = getFreeIdForCompany(companies);

            var company = new Company(req.body);
            company.id = index;
            company.fullEarnings = company.earnings;
            
            company.save();
            res.json(company);
        });
    });

companiesRouter
    .route('/companies/:id')
    .put((req, res) => {
        console.log('PUT /companies/:id');

        var companyId = req.params.id;

        Company.findOne({ id: companyId }, (err, company) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            if (company) {
                company.name = req.body.name;
                if(req.body.parentId != company.id)
                    company.parentId = req.body.parentId;
                company.earnings = req.body.earnings;

                company.save();

                res.json(company);
                return;
            }

            res.status(404).json({
                message: 'Company with id ' + companyId + 'was not found'
            });
        });
    })
    .delete((req, res) => {
        console.log('DELETE /companies/:id');

        var companyId = req.params.id;

        // Get list of all companies
        Company.find((err, companies) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            let branch = []; // array with element whitch must woudld be deleted

            /*
                Parameters: id - id of element of top branch which you want to delete
            */
            function getListOfBranchById(id) {
                // Get children for current branch
                let children = companies.filter(company => company.parentId == id);

                children.forEach(company => {
                    branch.push(company.id);
                    getListOfBranchById(company.id);
                }, this);
                return;
            }

            // Get children for company
            getListOfBranchById(companyId);

            // Push current company to list for deleting
            branch.push(companyId);

            // Delete each element in branch
            branch.forEach((item) => {
                Company.findOne({ id: item }, (err, company) => {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }

                    if (company) {
                        company.remove((err) => {
                            if (err) {
                                res.status(500).send(err);
                                return;
                            }
                        });
                    } else {
                        res.status(404).json({
                            message: 'Company with id ' + item + ' was not found.'
                        });
                        return;
                    }
                });
            }, this);

            res.status(200).json({
                'message': 'Companies was removed.'
            });
        });
    });

function getFreeIdForCompany(companies) {
    let index = 0;
    if (companies) {
        for (var i = 0; i < companies.length; i++) {
            if (companies[i].id > index)
                index = companies[i].id;
        }
    }
    return index + 1; // free id + 1 point more then max id in array
}

module.exports = companiesRouter;