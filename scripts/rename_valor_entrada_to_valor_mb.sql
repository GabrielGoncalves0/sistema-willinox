-- Script para renomear a coluna ped_valor_entrada para ped_valor_mb na tabela tb_pedido
-- Execute este script no banco de dados

-- Verificar se a coluna ped_valor_entrada existe
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'tb_pedido' 
AND COLUMN_NAME = 'ped_valor_entrada'
AND TABLE_SCHEMA = DATABASE();

-- Renomear a coluna de ped_valor_entrada para ped_valor_mb
ALTER TABLE tb_pedido 
CHANGE COLUMN ped_valor_entrada ped_valor_mb DECIMAL(10,2) DEFAULT 0.00;

-- Verificar se a alteração foi feita corretamente
DESCRIBE tb_pedido;

-- Verificar alguns registros para confirmar
SELECT ped_id, ped_data, ped_status, pes_id, ped_valor_mb 
FROM tb_pedido 
ORDER BY ped_id DESC 
LIMIT 5;
