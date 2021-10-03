const mongoose = require('mongoose');

//Squema de products

const categorySchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    icon: {
        type:String
    },
    color: {
        type:String
    }
});

//MODEL y con el metodo exports permite que sea llamado
exports.Category = mongoose.model('Category',categorySchema);