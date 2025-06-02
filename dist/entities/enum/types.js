"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducaoStatus = exports.CompraStatus = exports.PedidoStatus = exports.JuridicaTipo = exports.FisicaTipo = exports.PessoaTipo = void 0;
var PessoaTipo;
(function (PessoaTipo) {
    PessoaTipo["JURIDICA"] = "juridica";
    PessoaTipo["FISICA"] = "fisica";
})(PessoaTipo || (exports.PessoaTipo = PessoaTipo = {}));
var FisicaTipo;
(function (FisicaTipo) {
    FisicaTipo["CLIENTE"] = "cliente";
    FisicaTipo["FUNCIONARIO"] = "funcionario";
})(FisicaTipo || (exports.FisicaTipo = FisicaTipo = {}));
var JuridicaTipo;
(function (JuridicaTipo) {
    JuridicaTipo["FORNECEDOR"] = "fornecedor";
    JuridicaTipo["CLIENTE"] = "cliente";
})(JuridicaTipo || (exports.JuridicaTipo = JuridicaTipo = {}));
var PedidoStatus;
(function (PedidoStatus) {
    PedidoStatus["PENDENTE"] = "pendente";
    PedidoStatus["PROCESSADO"] = "processado";
    PedidoStatus["CONCLUIDO"] = "concluido";
    PedidoStatus["CANCELADO"] = "cancelado";
})(PedidoStatus || (exports.PedidoStatus = PedidoStatus = {}));
var CompraStatus;
(function (CompraStatus) {
    CompraStatus["PENDENTE"] = "pendente";
    CompraStatus["PROCESSANDO"] = "processando";
    CompraStatus["CONCLUIDO"] = "concluido";
    CompraStatus["CANCELADO"] = "cancelado";
})(CompraStatus || (exports.CompraStatus = CompraStatus = {}));
var ProducaoStatus;
(function (ProducaoStatus) {
    ProducaoStatus["PENDENTE"] = "pendente";
    ProducaoStatus["EM_ANDAMENTO"] = "em_andamento";
    ProducaoStatus["CONCLUIDO"] = "concluido";
    ProducaoStatus["CANCELADO"] = "cancelado";
})(ProducaoStatus || (exports.ProducaoStatus = ProducaoStatus = {}));
//# sourceMappingURL=types.js.map