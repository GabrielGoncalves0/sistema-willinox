import Database from "../db/database.js";
export default class BaseRepository {
    #db: Database;

    get db(): Database {
        return this.#db;
    }

    constructor(db?: Database) {
        this.#db = db ? db : Database.getInstance();
    }


    async restaurarItem(tableName: string, idColumnName: string, id: number): Promise<boolean> {
        const sql = `UPDATE ${tableName} SET ativo = 1 WHERE ${idColumnName} = ?`;
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
}