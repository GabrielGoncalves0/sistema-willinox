-- Script para verificar a estrutura da tabela tb_pedido
DESCRIBE tb_pedido;

-- Ou alternativamente:
SHOW COLUMNS FROM tb_pedido;

-- Verificar se a coluna ped_valor_entrada existe
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'tb_pedido'
AND TABLE_SCHEMA = DATABASE();

-- Verificar alguns registros para ver se o valor_entrada está sendo salvo
SELECT ped_id, ped_data, ped_status, pes_id, ped_valor_entrada
FROM tb_pedido
ORDER BY ped_id DESC
LIMIT 5;
