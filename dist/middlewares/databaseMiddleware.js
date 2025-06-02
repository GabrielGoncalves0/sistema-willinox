"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseMiddleware = void 0;
const database_1 = __importDefault(require("../db/database"));
const databaseMiddleware = (req, res, next) => {
    const db = database_1.default.getInstance();
    const originalSend = res.send;
    res.send = function (body) {
        res.send = originalSend;
        return originalSend.call(this, body);
    };
    next();
};
exports.databaseMiddleware = databaseMiddleware;
//# sourceMappingURL=databaseMiddleware.js.map