"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const materiaPrimaEntity_js_1 = __importDefault(require("../entities/materiaPrimaEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
class MateriaPrimaRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_materiaPrima WHERE ativo = 1 ORDER BY matpri_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async obter(id) {
        const sql = "SELECT * FROM tb_materiaPrima WHERE matpri_id = ? AND ativo = 1";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
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
    async atualizar(entidade) {
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
    async deletar(id) {
        const sql = "UPDATE tb_materiaPrima SET ativo = 0 WHERE matpri_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async restaurar(id) {
        return await this.restaurarItem("tb_materiaPrima", "matpri_id", id);
    }
    async listarTodos() {
        const sql = "SELECT * FROM tb_materiaPrima";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async existeCodigo(codigo) {
        const sql = "SELECT COUNT(*) as total FROM tb_materiaPrima WHERE matpri_codigo = ? AND ativo = 1";
        const rows = await this.db.ExecutaComando(sql, [codigo]);
        return rows[0]?.total > 0;
    }
    async existeCodigoEmOutroId(codigo, idAtual) {
        const sql = "SELECT COUNT(*) as total FROM tb_materiaPrima WHERE matpri_codigo = ? AND matpri_id <> ? AND ativo = 1";
        const rows = await this.db.ExecutaComando(sql, [codigo, idAtual]);
        return rows[0]?.total > 0;
    }
    async aumentarEstoque(id, quantidade) {
        if (quantidade <= 0) {
            throw new Error("A quantidade para aumentar o estoque deve ser positiva");
        }
        const sql = "UPDATE tb_materiaPrima SET matpri_qtd_estoque = matpri_qtd_estoque + ? WHERE matpri_id = ? AND ativo = 1";
        const valores = [quantidade, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async diminuirEstoque(id, quantidade) {
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
    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        }
        else {
            return [this.mapToEntity(rows)];
        }
    }
    mapToEntity(row) {
        return new materiaPrimaEntity_js_1.default(row["matpri_id"], row["matpri_nome"], row["matpri_descricao"], row["matpri_qtd_estoque"], row["matpri_unidade_medida"], row["matpri_preco"], row["matpri_codigo"], row["ativo"]);
    }
}
exports.default = MateriaPrimaRepository;
//# sourceMappingURL=materiaPrimaRepository.js.map