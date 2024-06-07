"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
let db = mongodb_1.default.MongoClient
    .connect("mongodb+srv://vasuantala8283:4dQ6JoPR75MalB5g@cluster0.p1ilxej.mongodb.net/")
    .then((client) => client.db("autenticationnode"));
exports.default = db;
//# sourceMappingURL=db.js.map