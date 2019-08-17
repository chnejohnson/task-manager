"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = process.env.CORS_DOMAIN;
function default_1(req, res, next) {
    res.header("Access-Control-Allow-Origin", url);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
}
exports.default = default_1;
