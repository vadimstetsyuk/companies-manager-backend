var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    parentId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    earnings: {
        type: Number,
        required: true
    },
    fullEarnings: {
        type: Number,
        required: true
    },
    child: {
        type: Array,
        required: false
    }
}, { collection: 'companies' });

module.exports = mongoose.model('Company', CompanySchema);