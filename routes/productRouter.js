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

productRouter.route("/:prodId/comments/:commentId")
    .get((req, res, next) => {
        Shirts.findById(req.params.prodId)
            .then((shirt) => {
                if (shirt != null && shirt.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shirt.comments.id(req.params.commentId));
                }
                else if (shirt == null) {
                    let err = new Error('Shirt ' + req.params.prodId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /products/" + req.params.prodId +
        "/comments/" + req.params.commentId);
    })

    .put((req, res, next) => {
        Shirts.findById(req.params.prodId)
            .then((shirt) => {
                if (shirt != null && shirt.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        shirt.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if(req.body.comment) {
                        shirt.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    shirt.save()
                        .then((shirt) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(shirt);
                        })
                }
                else if (shirt == null) {
                    let err = new Error('Shirt ' + req.params.prodId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        Shirts.findById(req.params.prodId)
            .then((shirt) => {
                if (shirt != null && shirt.comments.id(req.params.commentId) != null) {
                    shirt.comments.id(req.params.commentId).remove();
                    shirt.save()
                        .then((shirt) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(shirt);
                        }, (err) => {
                            next(err);
                        })
                        .catch ((err) => next(err));
                }
                else if (shirt == null) {
                    let err = new Error('Shirt ' + req.params.prodId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    let err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    });

productRouter.route("/:prodId/comments")
    .get((req, res, next) => {
        Shirts.findById(req.params.prodId)
            .then((shirt) => {
                if (shirt != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shirt.comments);
                }
                else {
                    let err = new Error('Shirt ' + req.params.prodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Shirts.findById(req.params.prodId)
            .then((shirt) => {
                if (shirt != null) {
                    shirt.comments.push(req.body);
                    shirt.save()
                        .then((shirt) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(shirt);
                        }, (err) => {
                            next(err);
                        })
                        .catch((err) => next(err));
                }
                else {
                    let err = new Error('Shirt ' + req.params.prodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /products/" + req.params.prodId + "/comments");
    })
    .delete((req, res, next) => {
        Shirts.findById(req.params.prodId)
            .then((shirt) => {
                if (shirt != null) {
                    for (let i = (shirt.comments.length - 1); i >= 0; i--) {
                        shirt.comments.id(shirt.comments[i]._id).remove();
                    }
                    shirt.save()
                        .then((shirt) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(shirt);
                        }, (err) => {
                            next(err);
                        })
                        .catch ((err) => next(err));
                }
                else {
                    let err = new Error('Shirt ' + req.params.prodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => {
                next(err);
            })
            .catch((err) => next(err));
    });

module.exports = productRouter;