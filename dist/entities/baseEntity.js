"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseEntity {
    constructor() {
    }
    toJSON() {
        let props = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        let json = {};
        for (let prop of props) {
            if (prop !== "constructor") {
                json[prop] = this[prop];
            }
        }
        return json;
    }
}
exports.default = BaseEntity;
//# sourceMappingURL=baseEntity.js.map