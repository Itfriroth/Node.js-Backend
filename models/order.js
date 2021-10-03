const mongoose = require('mongoose');

//Squema de products

const orderSchema = mongoose.Schema({
    
})

//MODEL y con el metodo exports permite que sea llamado
exports.Order = mongoose.model('Order',orderSchema);