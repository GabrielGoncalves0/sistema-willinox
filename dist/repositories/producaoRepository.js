"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const producaoEntity_js_1 = __importDefault(require("../entities/producaoEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
const produtoEntity_js_1 = __importDefault(require("../entities/produtoEntity.js"));
const fisicaEntity_js_1 = __importDefault(require("../entities/fisicaEntity.js"));
const modeloEntity_js_1 = __importDefault(require("../entities/modeloEntity.js"));
const pessoaEntity_js_1 = __importDefault(require("../entities/pessoaEntity.js"));
const materiaPrimaEntity_js_1 = __importDefault(require("../entities/materiaPrimaEntity.js"));
const produtoMateriaPrimaEntity_js_1 = __importDefault(require("../entities/relations/produtoMateriaPrimaEntity.js"));
class ProducaoRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = `SELECT * FROM tb_producao pr
                        INNER JOIN tb_fisica f ON pr.fis_id = f.fis_id
                        INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
                        INNER JOIN tb_produto prod ON pr.pro_id = prod.pro_id
                        INNER JOIN tb_modelo m ON prod.mod_id = m.mod_id
                        ORDER BY pr.producao_id DESC`;
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async obter(id) {
        const sql = `SELECT * FROM tb_producao pr
                        INNER JOIN tb_fisica f ON pr.fis_id = f.fis_id
                        INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
                        INNER JOIN tb_produto prod ON pr.pro_id = prod.pro_id
                        INNER JOIN tb_modelo m ON prod.mod_id = m.mod_id WHERE producao_id = ?;`;
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
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
    async atualizar(entidade) {
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
    async deletar(id) {
        const sql = "DELETE FROM tb_producao WHERE producao_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        }
        else {
            return [this.mapToEntity(rows)];
        }
    }
    mapToEntity(row) {
        const modelo = new modeloEntity_js_1.default(row["mod_id"], row["mod_nome"], row["mod_descricao"], row["ativo"]);
        let materiaPrima = [];
        let produtoMateriaPrima = [];
        if (row["matpri_id"]) {
            materiaPrima = [
                new materiaPrimaEntity_js_1.default(row["matpri_id"], row["matpri_nome"], row["matpri_descricao"], row["matpri_qtd_estoque"], row["matpri_unidade_medida"], row["matpri_preco"], row["matpri_codigo"])
            ];
            produtoMateriaPrima = [new produtoMateriaPrimaEntity_js_1.default(row["id"], row["pro_id"], row["matpri_id"], row["qtd_materia_prima"], materiaPrima)];
        }
        const produto = new produtoEntity_js_1.default(row["pro_id"], row["pro_nome"], row["pro_descricao"], row["pro_preco"], row["pro_qtd_estoque"], row["pro_codigo"], modelo, produtoMateriaPrima, row["ativo"]);
        const pessoas = new pessoaEntity_js_1.default(row["pes_id"], row["pes_nome"], row["pes_endereco"], row["pes_telefone"], row["pes_email"], row["pes_tipo"], row["ativo"]);
        const fisica = new fisicaEntity_js_1.default(row["fis_id"], row["fis_cpf"], row["fis_data_nascimento"], row["pes_id"], row["fis_tipo"], row["fun_login"], row["fun_senha"], pessoas, row["ativo"]);
        const dataFim = row["pro_data_fim"] ? new Date(row["pro_data_fim"]) : null;
        return new producaoEntity_js_1.default(row["producao_id"], new Date(row["pro_data_inicio"]), dataFim, row["pro_status"], row["pro_quantidade"], row["pro_id"], row["fis_id"], produto, fisica);
    }
}
exports.default = ProducaoRepository;
//# sourceMappingURL=producaoRepository.js.map