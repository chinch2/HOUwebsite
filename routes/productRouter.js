const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Shirts = require('../models/shirts');

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route("/:prodId")
    .get((req, res, next) => {
        Shirts.findById(req.params.prodId)
            .then((shirt) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shirt);
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /products/" + req.params.prodId);
    })

    .put((req, res, next) => {
        Shirts.findByIdAndUpdate(req.params.prodId, {
            $set: req.body
        }, { new: true })
            .then((shirt) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shirt);
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        Shirts.findByIdAndRemove((req.params.prodId))
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    });

productRouter.route("/")
    .get((req, res, next) => {
        Shirts.find({})
            .then((shirts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shirts);
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Shirts.create(req.body)
            .then((shirt) => {
                console.log('Shirt Created ', shirt);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shirt);
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /products");
    })
    .delete((req, res, next) => {
        Shirts.deleteOne({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    });

module.exports = productRouter;