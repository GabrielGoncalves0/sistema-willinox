import ProducaoEntity from "../entities/producaoEntity.js";
import BaseRepository from "./baseRepository.js";
import Database from "../db/database.js";
import ProdutoEntity from "../entities/produtoEntity.js";
import FisicaEntity from "../entities/fisicaEntity.js";
import ModeloEntity from "../entities/modeloEntity.js";
import PessoaEntity from "../entities/pessoaEntity.js";
import MateriaPrimaEntity from "../entities/materiaPrimaEntity.js";
import ProdutoMateriaPrimaEntity from "../entities/relations/produtoMateriaPrimaEntity.js";

export default class ProducaoRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<ProducaoEntity[]> {
        const sql = `SELECT * FROM tb_producao pr
                        INNER JOIN tb_fisica f ON pr.fis_id = f.fis_id
                        INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
                        INNER JOIN tb_produto prod ON pr.pro_id = prod.pro_id
                        INNER JOIN tb_modelo m ON prod.mod_id = m.mod_id
                        ORDER BY pr.producao_id DESC`;
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id: number): Promise<ProducaoEntity> {
        const sql = `SELECT * FROM tb_producao pr
                        INNER JOIN tb_fisica f ON pr.fis_id = f.fis_id
                        INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
                        INNER JOIN tb_produto prod ON pr.pro_id = prod.pro_id
                        INNER JOIN tb_modelo m ON prod.mod_id = m.mod_id WHERE producao_id = ?;`
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: ProducaoEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_producao (fis_id, pro_id, pro_data_inicio, pro_data_fim, pro_status, pro_quantidade) VALUES (?, ?, ?, ?, ?,?)";
        const valores = [
            entidade.fisicaId,
            entidade.produtoId,
            entidade.dataInicio || null,
            entidade.dataFim,
            entidade.status,
            entidade.quantidade
        ];
        const producaoId = await this.db.ExecutaComandoLastInserted(sql, valores);
        return producaoId > 0;
    }

    async atualizar(entidade: ProducaoEntity): Promise<boolean> {
        const sql = `UPDATE tb_producao
                    SET fis_id = ?,
            pro_id = ?,
            pro_data_inicio = ?,
            pro_data_fim = ?,
            pro_status = ?,
            pro_quantidade = ?
                WHERE producao_id = ? `;
        const valores = [
            entidade.fisicaId,
            entidade.produtoId,
            entidade.dataInicio,
            entidade.dataFim,
            entidade.status,
            entidade.quantidade,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id: number): Promise<boolean> {
        const sql = "DELETE FROM tb_producao WHERE producao_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    private toMap(rows: any): ProducaoEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): ProducaoEntity {

        const modelo = new ModeloEntity(
            row["mod_id"],
            row["mod_nome"],
            row["mod_descricao"],
            row["ativo"]
        );

        let materiaPrima: MateriaPrimaEntity[] = [];
        let produtoMateriaPrima: ProdutoMateriaPrimaEntity[] = [];

        if (row["matpri_id"]) {
            materiaPrima = [
                new MateriaPrimaEntity(
                    row["matpri_id"],
                    row["matpri_nome"],
                    row["matpri_descricao"],
                    row["matpri_qtd_estoque"],
                    row["matpri_unidade_medida"],
                    row["matpri_preco"],
                    row["matpri_codigo"]
                )
            ];

            produtoMateriaPrima = [new ProdutoMateriaPrimaEntity(
                row["id"],
                row["pro_id"],
                row["matpri_id"],
                row["qtd_materia_prima"],
                materiaPrima
            )];
        }

        const produto = new ProdutoEntity(
            row["pro_id"],
            row["pro_nome"],
            row["pro_descricao"],
            row["pro_preco"],
            row["pro_qtd_estoque"],
            row["pro_codigo"],
            modelo,
            produtoMateriaPrima,
            row["ativo"]
        );

        const pessoas = new PessoaEntity(
            row["pes_id"],
            row["pes_nome"],
            row["pes_endereco"],
            row["pes_telefone"],
            row["pes_email"],
            row["pes_tipo"],
            row["ativo"]
        );

        const fisica = new FisicaEntity(
            row["fis_id"],
            row["fis_cpf"],
            row["fis_data_nascimento"],
            row["pes_id"],
            row["fis_tipo"],
            row["fun_login"],
            row["fun_senha"],
            pessoas,
            row["ativo"]
        );

        const dataFim = row["pro_data_fim"] ? new Date(row["pro_data_fim"]) : null;

        return new ProducaoEntity(
            row["producao_id"],
            new Date(row["pro_data_inicio"]),
            dataFim,
            row["pro_status"],
            row["pro_quantidade"],
            row["pro_id"],
            row["fis_id"],
            produto,
            fisica
        );
    }
}