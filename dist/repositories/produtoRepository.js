"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const produtoEntity_js_1 = __importDefault(require("../entities/produtoEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
const modeloEntity_js_1 = __importDefault(require("../entities/modeloEntity.js"));
const materiaPrimaEntity_js_1 = __importDefault(require("../entities/materiaPrimaEntity.js"));
const produtoMateriaPrimaEntity_js_1 = __importDefault(require("../entities/relations/produtoMateriaPrimaEntity.js"));
/**
 * Repositório responsável pelas operações de persistência de Produto.
 */
class ProdutoRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    /**
     * Lista todos os produtos ativos.
     */
    async listar() {
        const sql = "SELECT pro.*, pro.ativo AS pro_ativo, mo.* FROM tb_produto pro INNER JOIN tb_modelo mo ON pro.mod_id = mo.mod_id WHERE pro.ativo = 1 ORDER BY pro.pro_id DESC;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    /**
     * Obtém um produto pelo ID.
     * @param id ID do produto
     * @param incluirInativos Se true, inclui produtos inativos
     */
    async obter(id, incluirInativos = false) {
        const sql = `SELECT pro.*, pro.ativo AS pro_ativo, mo.*
                    FROM tb_produto pro
                    INNER JOIN tb_modelo mo ON pro.mod_id = mo.mod_id
                    WHERE pro.pro_id = ? ${incluirInativos ? '' : 'AND pro.ativo = 1'}`;
        const rows = await this.db.ExecutaComando(sql, [id]);
        return this.toMap(rows)[0];
    }
    /**
     * Lista todos os produtos, inclusive inativos.
     */
    async listarTodos() {
        const sql = "SELECT pro.*, pro.ativo AS pro_ativo, mo.* FROM tb_produto pro INNER JOIN tb_modelo mo ON pro.mod_id = mo.mod_id ORDER BY pro.pro_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    /**
     * Restaura um produto logicamente excluído.
     * @param id ID do produto
     */
    async restaurar(id) {
        return await this.restaurarItem("tb_produto", "pro_id", id);
    }
    /**
     * Insere um novo produto.
     * @param entidade ProdutoEntity a ser inserido
     */
    async inserir(entidade) {
        const sql = "INSERT INTO tb_produto (pro_nome, pro_descricao, pro_preco, pro_qtd_estoque, pro_codigo, mod_id, ativo) VALUES (?, ?, ?, ?, ?, ?, 1)";
        const valores = [
            entidade.nome,
            entidade.descricao,
            entidade.preco,
            entidade.qtdEstoque,
            entidade.codigo,
            entidade.modelo.id
        ];
        const produtoId = await this.db.ExecutaComandoLastInserted(sql, valores);
        return produtoId;
    }
    /**
     * Atualiza um produto existente.
     * @param entidade ProdutoEntity a ser atualizado
     */
    async atualizar(entidade) {
        const sql = `UPDATE tb_produto
                    SET pro_nome = ?,
                        pro_descricao = ?,
                        pro_preco = ?,
                        pro_qtd_estoque = ?,
                        pro_codigo = ?,
                        mod_id = ?
                    WHERE pro_id = ?`;
        const valores = [
            entidade.nome,
            entidade.descricao,
            entidade.preco,
            entidade.qtdEstoque,
            entidade.codigo,
            entidade.modelo.id,
            entidade.id
        ];
        const result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
    /**
     * Exclui logicamente um produto.
     * @param id ID do produto
     */
    async deletar(id) {
        const sql = "UPDATE tb_produto SET ativo = 0 WHERE pro_id = ?";
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }
    /**
     * Verifica se já existe um produto com o código informado.
     * @param codigo Código do produto
     */
    async existeCodigo(codigo) {
        const sql = "SELECT COUNT(*) as total FROM tb_produto WHERE pro_codigo = ? AND ativo = 1";
        const rows = await this.db.ExecutaComando(sql, [codigo]);
        return rows[0]?.total > 0;
    }
    /**
     * Verifica se já existe um produto com o código informado, exceto o ID atual.
     * @param codigo Código do produto
     * @param idAtual ID do produto a ser desconsiderado
     */
    async existeCodigoEmOutroId(codigo, idAtual) {
        const sql = "SELECT COUNT(*) as total FROM tb_produto WHERE pro_codigo = ? AND pro_id <> ? AND ativo = 1";
        const rows = await this.db.ExecutaComando(sql, [codigo, idAtual]);
        return rows[0]?.total > 0;
    }
    /**
     * Aumenta o estoque de um produto.
     * @param id ID do produto
     * @param quantidade Quantidade a ser adicionada
     */
    async aumentarEstoque(id, quantidade) {
        if (quantidade <= 0) {
            throw new Error("A quantidade para aumentar o estoque deve ser positiva.");
        }
        const sql = "UPDATE tb_produto SET pro_qtd_estoque = pro_qtd_estoque + ? WHERE pro_id = ? AND ativo = 1";
        const valores = [quantidade, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    /**
     * Diminui o estoque de um produto.
     * @param id ID do produto
     * @param quantidade Quantidade a ser removida
     */
    async diminuirEstoque(id, quantidade) {
        if (quantidade <= 0) {
            throw new Error("A quantidade para diminuir o estoque deve ser positiva.");
        }
        const produto = await this.obter(id);
        if (!produto) {
            throw new Error(`Produto com ID ${id} não encontrado.`);
        }
        if (produto.qtdEstoque < quantidade) {
            throw new Error(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.qtdEstoque}, Necessário: ${quantidade}.`);
        }
        const sql = "UPDATE tb_produto SET pro_qtd_estoque = pro_qtd_estoque - ? WHERE pro_id = ? AND ativo = 1";
        const valores = [quantidade, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    /**
     * Converte o resultado do banco em uma lista de ProdutoEntity.
     * @param rows Linhas retornadas do banco
     */
    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        }
        else {
            return [this.mapToEntity(rows)];
        }
    }
    /**
     * Converte uma linha do banco em ProdutoEntity.
     * @param row Linha retornada do banco
     */
    mapToEntity(row) {
        const modelo = new modeloEntity_js_1.default(row["mod_id"], row["mod_nome"], row["mod_descricao"]);
        const materiaPrima = [
            new materiaPrimaEntity_js_1.default(row["matpri_id"], row["matpri_nome"], row["matpri_descricao"], row["matpri_qtd_estoque"], row["matpri_unidade_medida"], row["matpri_preco"], row["matpri_codigo"])
        ];
        const produtoMateriaPrima = [new produtoMateriaPrimaEntity_js_1.default(row["id"], row["pro_id"], row["matpri_id"], row["qtd_materia_prima"], materiaPrima)];
        const ativoValue = row["pro_ativo"] !== undefined ? row["pro_ativo"] : row["ativo"];
        const ativo = ativoValue === 1 || ativoValue === true;
        return new produtoEntity_js_1.default(row["pro_id"], row["pro_nome"], row["pro_descricao"], row["pro_preco"], row["pro_qtd_estoque"], row["pro_codigo"], modelo, produtoMateriaPrima, ativo);
    }
}
exports.default = ProdutoRepository;
//# sourceMappingURL=produtoRepository.js.map