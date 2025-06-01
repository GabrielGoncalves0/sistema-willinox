import mysql, { Pool, QueryError, ResultSetHeader } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export default class Database {
    #conexao: Pool;
    private static instance: Database | null = null;

    get conexao(): Pool {
        return this.#conexao;
    }

    set conexao(conexao: Pool) {
        this.#conexao = conexao;
    }

    private constructor() {
        this.#conexao = mysql.createPool({
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            waitForConnections: true,
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT),
            queueLimit: Number(process.env.DB_QUEUE_LIMIT)
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    AbreTransacao(): Promise<any> {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query("START TRANSACTION", (error: QueryError | null, results: any) => {
                if (error) {
                    rej(error);
                } else {
                    res(results);
                }
            });
        });
    }

    Rollback(): Promise<any> {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query("ROLLBACK", (error: QueryError | null, results: any) => {
                if (error) {
                    rej(error);
                } else {
                    res(results);
                }
            });
        });
    }

    Commit(): Promise<any> {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query("COMMIT", (error: QueryError | null, results: any) => {
                if (error) {
                    rej(error);
                } else {
                    res(results);
                }
            });
        });
    }

    ExecutaComando(sql: string, valores?: any[]): Promise<any> {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores || [], (error: QueryError | null, results: any) => {
                if (error) {
                    rej(error);
                } else {
                    res(results);
                }
            });
        });
    }

    ExecutaComandoNonQuery(sql: string, valores: any[]): Promise<boolean> {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores, (error: QueryError | null, results: ResultSetHeader) => {
                if (error) {
                    rej(error);
                } else {
                    res(results.affectedRows > 0);
                }
            });
        });
    }

    ExecutaComandoLastInserted(sql: string, valores: any[]): Promise<number> {
        const cnn = this.#conexao;
        return new Promise((res, rej) => {
            cnn.query(sql, valores, (error: QueryError | null, results: any) => {
                if (error) {
                    rej(error);
                } else {
                    res(results.insertId);
                }
            });
        });
    }


    public closePool(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.#conexao) {
                this.#conexao.end((err) => {
                    if (err) {
                        reject(err);
                    } else {

                        Database.instance = null;
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}
