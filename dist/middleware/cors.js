"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = process.env.CORS_DOMAIN;
function default_1(req, res, next) {
    res.header("Access-Control-Allow-Origin", url);
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
}
exports.default = default_1;
