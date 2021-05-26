const express = require('express');
const router = express.Router();
const passport = require('passport');

const mongoose = require('mongoose');
const productModel = mongoose.model('products');
const userModel = mongoose.model('user');

router.route('/login').post((req, res, next) => {
    if(req.body.username, req.body.password) {
        passport.authenticate('local', function(error, user) {
            if(error) return res.status(500).send(error);
            req.login(user, function(error) {
                if(error) return res.status(500).send(error);
                return res.status(200).send('Bejelentkezés sikeres!');
            })
        })(req, res);
    } else {
        return res.status(400).send('Kérem adja meg mindkét mezőt!');
    }
});

router.route('/logout').post((req, res, next) => {
    if(req.isAuthenticated()) {
        req.logout();
        return res.status(200).send('Kijelentkezés sikeres!');
    } else {
        return res.status(403).send('Nem is volt bejelentkezve!');
    }
})

router.route('/status').get((req, res, next) => {
    if(req.isAuthenticated()) {
        return res.status(200).send(req.session.passport);
    } else {
        return res.status(403).send('Nem is volt bejelentkezve!');
    }
    
})

router.route('/user').get((req, res, next) => {
    userModel.find({}, (err, users) => {
        if(err) return res.status(500).send('DB hiba!');
        res.status(200).send(users);
    })
}).post((req, res, next) => {
    if(req.body.username && req.body.email && req.body.password) {
        userModel.findOne({username: req.body.username}, (err, user) => {
            if(err) return res.status(500).send('DB hiba');
            if(user) {
                return res.status(400).send('Hiba, már létezik ilyen felhasznalónév!v');
            }
            const usr = new userModel({username: req.body.username, password: req.body.password, 
                email: req.body.email});
            usr.save((error) => {
                if(error) return res.status(500).send('A mentés során hiba történ!t');
                return res.status(200).send('Sikeres mentés történt!');
            })
        })
    } else {
        return res.status(400).send('Hibás kérés, username, email es password kell');
    }
})

router.route('/products').get((req, res, next) => {
    productModel.find({}, (err, products) => {
        if(err) return res.status(500).send('DB hiba!');
        res.status(200).send(products);
    })
}).post((req, res, next) => {
    // return res.status(200).send(req.body);
    if(req.body.id && req.body.title && req.body.price && req.body.amount) {
        productModel.findOne({id: req.body.id}, (err, product) => {
            if(err) return res.status(500).send('DB hiba!');
            if(product) {
                return res.status(400).send('Már van ilyen ID!');
            } else {
                const product = new productModel({id: req.body.id, title: req.body.title, price: req.body.price, amount: req.body.amount});
                product.save((error) => {
                    if(error) return res.status(500).send('A mentés során hiba történt!');
                    return res.status(200).send('Sikeres mentés történt!');
                })
            }
        })
    } else {
        return res.status(400).send('Minden mező kitöltése kötelező!');
    }
}).put((req, res, next) => {
    if(req.body.id && req.body.title && req.body.price && (typeof req.body.amount !== 'undefined')) {
        productModel.findOne({id: req.body.id}, (err, product) => {
            if(err) return res.status(500).send('DB hiba');
            if(product) {
                product.title = req.body.title;
                product.price = req.body.price;
                product.amount = req.body.amount;
                product.save((error) => {
                    if(error) return res.status(500).send('A mentés során hiba történt');
                    return res.status(200).send('Sikeres mentés történt!');
                })
            } else {
                return res.status(400).send('Nincs ilyen ID az adatbázisban');
            }
        })
    } else {
        return res.status(400).send('Nem volt ID vagy title!');
    }
}).delete((req, res, next) => {
    if(req.body.id) {
        productModel.findOne({id: req.body.id}, (err, product) => {
            if(err) return res.status(500).send('DB hiba!');
            if(product) {
                product.delete((error) => {
                    if(error) return res.status(500).send('A mentés során hiba történt!');
                    return res.status(200).send('Sikeres törlés történt!');
                })
            } else {
                return res.status(400).send('Nincs ilyen ID az adatbázisban!');
            }
        })
    } else {
        return res.status(400).send('Nem volt ID!');
    }
})

module.exports = router;