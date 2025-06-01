import MateriaPrimaEntity from "../entities/materiaPrimaEntity.js";
import BaseRepository from "./baseRepository.js";
import Database from "../db/database.js";

export default class MateriaPrimaRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<MateriaPrimaEntity[]> {
        const sql = "SELECT * FROM tb_materiaPrima WHERE ativo = 1 ORDER BY matpri_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id: number): Promise<MateriaPrimaEntity> {
        const sql = "SELECT * FROM tb_materiaPrima WHERE matpri_id = ? AND ativo = 1";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: MateriaPrimaEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_materiaPrima (matpri_nome, matpri_descricao, matpri_qtd_estoque, matpri_unidade_medida, matpri_preco, matpri_codigo, ativo) VALUES (?, ?, ?, ?, ?, ?, 1)";
        const valores = [
            entidade.nome,
            entidade.descricao,
            entidade.qtdEstoque,
            entidade.unidadeMedida,
            entidade.preco,
            entidade.codigo
        ];
        const materiaPrimaId = await this.db.ExecutaComandoNonQuery(sql, valores);
        return materiaPrimaId;
    }

    async atualizar(entidade: MateriaPrimaEntity): Promise<boolean> {
        const sql = `UPDATE tb_materiaPrima
                    SET matpri_nome = ?,
                        matpri_descricao = ?,
                        matpri_qtd_estoque = ?,
                        matpri_unidade_medida = ?,
                        matpri_preco = ?,
                        matpri_codigo = ?
                    WHERE matpri_id = ? AND ativo = 1`;
        const valores = [
            entidade.nome,
            entidade.descricao,
            entidade.qtdEstoque,
            entidade.unidadeMedida,
            entidade.preco,
            entidade.codigo,
            entidade.id
        ];
        const materiaPrimaId = await this.db.ExecutaComandoNonQuery(sql, valores);
        return materiaPrimaId;
    }

    async deletar(id: number): Promise<boolean> {
        const sql = "UPDATE tb_materiaPrima SET ativo = 0 WHERE matpri_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }


    async restaurar(id: number): Promise<boolean> {
        return await this.restaurarItem("tb_materiaPrima", "matpri_id", id);
    }


    async listarTodos(): Promise<MateriaPrimaEntity[]> {
        const sql = "SELECT * FROM tb_materiaPrima";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async existeCodigo(codigo: string): Promise<boolean> {
        const sql = "SELECT COUNT(*) as total FROM tb_materiaPrima WHERE matpri_codigo = ? AND ativo = 1";
        const rows = await this.db.ExecutaComando(sql, [codigo]);
        return rows[0]?.total > 0;
    }

    async existeCodigoEmOutroId(codigo: string, idAtual: number): Promise<boolean> {
        const sql = "SELECT COUNT(*) as total FROM tb_materiaPrima WHERE matpri_codigo = ? AND matpri_id <> ? AND ativo = 1";
        const rows = await this.db.ExecutaComando(sql, [codigo, idAtual]);
        return rows[0]?.total > 0;
    }

    async aumentarEstoque(id: number, quantidade: number): Promise<boolean> {
        if (quantidade <= 0) {
            throw new Error("A quantidade para aumentar o estoque deve ser positiva");
        }
        const sql = "UPDATE tb_materiaPrima SET matpri_qtd_estoque = matpri_qtd_estoque + ? WHERE matpri_id = ? AND ativo = 1";
        const valores = [quantidade, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async diminuirEstoque(id: number, quantidade: number): Promise<boolean> {
        if (quantidade <= 0) {
            throw new Error("A quantidade para diminuir o estoque deve ser positiva");
        }


        const materiaPrima = await this.obter(id);
        if (!materiaPrima) {
            throw new Error(`Matéria-prima com ID ${id} não encontrada`);
        }

        if (materiaPrima.qtdEstoque < quantidade) {
            throw new Error(`Estoque insuficiente para a matéria-prima ${materiaPrima.nome}. Disponível: ${materiaPrima.qtdEstoque}, Necessário: ${quantidade}`);
        }

        const sql = "UPDATE tb_materiaPrima SET matpri_qtd_estoque = matpri_qtd_estoque - ? WHERE matpri_id = ? AND ativo = 1";
        const valores = [quantidade, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    private toMap(rows: any): MateriaPrimaEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): MateriaPrimaEntity {
        return new MateriaPrimaEntity(
            row["matpri_id"],
            row["matpri_nome"],
            row["matpri_descricao"],
            row["matpri_qtd_estoque"],
            row["matpri_unidade_medida"],
            row["matpri_preco"],
            row["matpri_codigo"],
            row["ativo"]
        );
    }
}