const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true, lowercase: true},
    title: {type: String, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true}
}, {collection: 'products'});

mongoose.model('products', productSchema);