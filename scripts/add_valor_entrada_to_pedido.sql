-- Script para adicionar a coluna ped_valor_entrada à tabela tb_pedido
ALTER TABLE tb_pedido ADD COLUMN ped_valor_entrada DECIMAL(10,2) DEFAULT 0 NOT NULL;

-- Comentário explicativo
-- Esta coluna armazena o valor da entrada (50% do valor total) pago pelo cliente ao fazer um pedido
