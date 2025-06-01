import ItensProducaoEntity from "../../entities/relations/itensProducaoEntity.js";
import BaseRepository from "../baseRepository.js";
import Database from "../../db/database.js";

export default class ItensProducaoRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<ItensProducaoEntity[]> {
        const sql = "SELECT * FROM tb_itens_producao ORDER BY id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarPorProducao(producaoId: number): Promise<ItensProducaoEntity[]> {
        const sql = "SELECT * FROM tb_itens_producao WHERE producao_id = ?";
        const valores = [producaoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }

    async obter(materiaPrimaId: number, producaoId: number): Promise<ItensProducaoEntity> {
        const sql = "SELECT * FROM tb_itens_producao WHERE matpri_id = ? AND producao_id = ?";
        const valores = [materiaPrimaId, producaoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: ItensProducaoEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_itens_producao (matpri_id, producao_id, pro_mat_quantidade) VALUES (?, ?, ?)";
        const valores = [
            entidade.materiaPrimaId,
            entidade.producaoId,
            entidade.quantidade
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar(entidade: ItensProducaoEntity): Promise<boolean> {
        const sql = `UPDATE tb_itens_producao
                    SET pro_mat_quantidade = ?
                    WHERE matpri_id = ? AND producao_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.materiaPrimaId,
            entidade.producaoId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(materiaPrimaId: number, producaoId: number): Promise<boolean> {
        const sql = "DELETE FROM tb_itens_producao WHERE matpri_id = ? AND producao_id = ?";
        const valores = [materiaPrimaId, producaoId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletarPorProducaoId(producaoId: number): Promise<boolean> {
        const sql = "DELETE FROM tb_itens_producao WHERE producao_id = ?";
        const valores = [producaoId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    private toMap(rows: any): ItensProducaoEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): ItensProducaoEntity {
        return new ItensProducaoEntity(
            row["id"],
            row["matpri_id"],
            row["producao_id"],
            row["pro_mat_quantidade"]
        );
    }
}