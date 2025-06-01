import ProdutoMateriaPrimaEntity from "../../entities/relations/produtoMateriaPrimaEntity.js";
import BaseRepository from "../baseRepository.js";
import Database from "../../db/database.js";
import MateriaPrimaEntity from "../../entities/materiaPrimaEntity.js";

export default class ProdutoMateriaPrimaRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(produtoId: number): Promise<ProdutoMateriaPrimaEntity[]> {
        const sql = "SELECT * FROM tb_produto_materiaPrima pmt inner join tb_materiaPrima mat ON pmt.matpri_id = mat.matpri_id where pmt.pro_id = ? ORDER BY pmt.id DESC;";
        const valores = [produtoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }

    async obter(produtoId: number): Promise<ProdutoMateriaPrimaEntity> {
        const sql = "SELECT * FROM tb_produto_materiaPrima WHERE pro_id = ?";
        const valores = [produtoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: ProdutoMateriaPrimaEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_produto_materiaPrima (pro_id, matpri_id, qtd_materia_prima) VALUES (?, ?, ?)";
        const valores = [
            entidade.produtoId,
            entidade.materiaPrimaId,
            entidade.quantidade
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async removerMateriaPrimaPorProdutoId(produtoId: number): Promise<boolean> {
        const sql = "DELETE FROM tb_produto_materiaPrima WHERE pro_id = ?";
        const valores = [produtoId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar(entidade: ProdutoMateriaPrimaEntity): Promise<boolean> {
        const sql = `UPDATE tb_produto_materiaPrima 
                    SET qtd_materia_prima = ?
                    WHERE pro_id = ? AND matpri_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.produtoId,
            entidade.materiaPrimaId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(produtoId: number, materiaPrimaId: number): Promise<boolean> {
        const sql = "DELETE FROM tb_produto_materiaPrima WHERE pro_id = ? AND matpri_id = ?";
        const valores = [produtoId, materiaPrimaId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    private toMap(rows: any): ProdutoMateriaPrimaEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): ProdutoMateriaPrimaEntity {
        const materiaPrima = [new MateriaPrimaEntity(
            row["matpri_id"],
            row["matpri_nome"],
            row["matpri_descricao"],
            row["matpri_qtd_estoque"],
            row["matpri_unidade_medida"],
            row["matpri_preco"],
            row["matpri_codigo"]
        )];

        return new ProdutoMateriaPrimaEntity(
            row["id"],
            row["pro_id"],
            row["matpri_id"],
            row["qtd_materia_prima"],
            materiaPrima
        );
    }
}