"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Database {
    #conexao;
    static instance = null;
    get conexao() {
        return this.#conexao;
    }
    set conexao(conexao) {
        this.#conexao = conexao;
    }
    constructor() {
        this.#conexao = mysql2_1.default.createPool({
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            waitForConnections: true,
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
            queueLimit: Number(process.env.DB_QUEUE_LIMIT)
        });
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    AbreTransacao() {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query("START TRANSACTION", (error, results) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(results);
                }
            });
        });
    }
    Rollback() {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query("ROLLBACK", (error, results) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(results);
                }
            });
        });
    }
    Commit() {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query("COMMIT", (error, results) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(results);
                }
            });
        });
    }
    ExecutaComando(sql, valores) {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores || [], (error, results) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(results);
                }
            });
        });
    }
    ExecutaComandoNonQuery(sql, valores) {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores, (error, results) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(results.affectedRows > 0);
                }
            });
        });
    }
    ExecutaComandoLastInserted(sql, valores) {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores, (error, results) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(results.insertId);
                }
            });
        });
    }
    closePool() {
        return new Promise((resolve, reject) => {
            if (this.#conexao) {
                this.#conexao.end((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        Database.instance = null;
                        resolve();
                    }
                });
            }
            else {
                resolve();
            }
        });
    }
}
exports.default = Database;
//# sourceMappingURL=database.js.map