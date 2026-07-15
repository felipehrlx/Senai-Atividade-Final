-- ==========================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - PHARMASTOCK
-- SISTEMA DE CONTROLE DE ESTOQUE FARMACÊUTICO
-- ==========================================================

CREATE DATABASE IF NOT EXISTS pharmastock;
USE pharmastock;

-- Limpar tabelas caso já existam (ordem correta de dependências)
DROP TABLE IF EXISTS movimentacoes;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS fornecedores;

-- 1. Tabela de Fornecedores de Insumos/Medicamentos
CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_fantasia VARCHAR(100) NOT NULL,
    razao_social VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(15),
    email VARCHAR(100),
    endereco VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Produtos (Medicamentos e Insumos)
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    principio_ativo VARCHAR(100) NOT NULL,
    lote VARCHAR(50) NOT NULL,
    data_validade DATE NOT NULL,
    estoque_atual INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 10,
    preco_unitario DECIMAL(10,2) NOT NULL,
    id_fornecedor INT NOT NULL,
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id) ON DELETE RESTRICT,
    CONSTRAINT chk_estoque_atual CHECK (estoque_atual >= 0),
    CONSTRAINT chk_estoque_minimo CHECK (estoque_minimo >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela de Movimentações de Estoque (Entradas e Saídas)
CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255) NOT NULL, -- Ex: "Compra", "Venda", "Ajuste de Estoque", "Perda por Validade"
    FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE,
    CONSTRAINT chk_quantidade CHECK (quantidade > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================================
-- DADOS INICIAIS PARA TESTE
-- ==========================================================

-- Inserindo Fornecedores
INSERT INTO fornecedores (id, nome_fantasia, razao_social, cnpj, telefone, email, endereco) VALUES
(1, 'MedSul Distribuidora', 'MedSul Distribuidora de Medicamentos Ltda', '12.345.678/0001-90', '(11) 3344-5566', 'contato@medsul.com.br', 'Av. Paulista, 1000 - São Paulo/SP'),
(2, 'Eurofarma Insumos', 'Eurofarma Laboratórios S.A.', '61.190.096/0001-92', '(11) 5643-2000', 'insumos@eurofarma.com', 'Rodovia Pres. Castelo Branco, Km 35 - Itapevi/SP'),
(3, 'BioPharma', 'BioPharma Química e Farmacêutica Ltda', '98.765.432/0001-10', '(21) 2233-4455', 'vendas@biopharma.com', 'Rua das Flores, 450 - Rio de Janeiro/RJ');

-- Inserindo Produtos (Medicamentos e Insumos)
INSERT INTO produtos (id, nome, principio_ativo, lote, data_validade, estoque_atual, estoque_minimo, preco_unitario, id_fornecedor) VALUES
(1, 'Dipirona Monoidratada 500mg', 'Dipirona', 'DIP2026-A', '2027-12-31', 150, 50, 1.20, 1),
(2, 'Paracetamol 750mg', 'Paracetamol', 'PAR2026-B', '2026-11-15', 8, 20, 1.80, 1), -- Alerta de Estoque Baixo
(3, 'Amoxicilina 500mg', 'Amoxicilina', 'AMX2026-C', '2026-04-10', 80, 15, 4.50, 2), -- Já vencido em Julho/2026
(4, 'Cloridrato de Metformina 850mg', 'Metformina', 'MET2026-D', '2026-09-01', 200, 30, 0.90, 3), -- Próximo ao vencimento
(5, 'Ibuprofeno 600mg', 'Ibuprofeno', 'IBU2026-E', '2028-01-20', 120, 25, 2.10, 1);

-- Inserindo Movimentações
INSERT INTO movimentacoes (id, id_produto, tipo, quantidade, data_movimentacao, motivo) VALUES
(1, 1, 'ENTRADA', 200, '2026-01-10 09:00:00', 'Compra inicial'),
(2, 1, 'SAIDA', 50, '2026-02-15 14:30:00', 'Distribuição para filiais'),
(3, 2, 'ENTRADA', 10, '2026-03-01 10:00:00', 'Ajuste de estoque físico'),
(4, 2, 'SAIDA', 2, '2026-03-10 16:15:00', 'Descarte de lote danificado'),
(5, 3, 'ENTRADA', 80, '2026-04-01 11:00:00', 'Importação direta');
