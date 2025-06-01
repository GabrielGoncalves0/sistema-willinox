export default class BaseEntity {

    constructor() {
    }

    toJSON(): { [key: string]: any } {
        let props = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        let json: { [key: string]: any } = {};

        for (let prop of props) {
            if (prop !== "constructor") {
                json[prop] = (this as any)[prop];
            }
        }

        return json;
    }
}
