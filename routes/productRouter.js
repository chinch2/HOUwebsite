const express = require("express");
const bodyParser = require("body-parser");

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route("/:prodId")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })

    .get((req, res, next) => {
        res.end("Will send details of the product: " + req.params.prodId + " to you!");
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /products/" + req.params.prodId);
    })

    .put((req, res, next) => {
        res.write("Updating the product: " + req.params.prodId + "\n");
        res.end("Will update the product: " + req.body.name + " with details: " + req.body.description);
    })

    .delete((req, res, next) => {
        res.end("Deleting product: " + req.params.prodId);
    });

productRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Will send all the products to you!");
    })
    .post((req, res, next) => {
        res.end("Will add the product: " + req.body.name + " with details: " +
            req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /products");
    })
    .delete((req, res, next) => {
        res.end("Deleting all the products.");
    });

module.exports = productRouter;