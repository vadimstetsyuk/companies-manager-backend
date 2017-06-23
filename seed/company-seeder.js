var Company = require('../models/company');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/companiesdb');

var companies = [
    new Company({
        id: 1,
        parentId: 0,
        name: 'Company 1',
        earnings: 25,
        fullEarnings: 100,
        child: []
    }),
    new Company({
        id: 2,
        parentId: 1,
        name: 'Company 2',
        earnings: 13,
        fullEarnings: 100,
        child: []
    }),
    new Company({
        id: 3,
        parentId: 2,
        name: 'Company 3',
        earnings: 5,
        fullEarnings: 100,
        child: []
    }),
    new Company({
        id: 4,
        parentId: 1,
        name: 'Company 4',
        earnings: 10,
        fullEarnings: 100,
        child: []
    })
];

var done = 0;
for (var i = 0; i < companies.length; i++) {
    companies[i].save();
}

function exit() {
    mongoose.disconnect();
}