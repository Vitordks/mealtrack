CREATE DATABASE IF NOT EXISTS mealtrack;
USE mealtrack;

-- =========================
-- RESTAURANTE
-- =========================
CREATE TABLE restaurante (
    id_restaurante INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(150),
    data_fundacao DATE
);

-- =========================
-- USUARIO
-- =========================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    documento VARCHAR(18) UNIQUE NOT NULL,
    tipo_pessoa ENUM('FISICA', 'JURIDICA') NOT NULL,
    nivel_acesso ENUM('ADMIN', 'SUPERVISOR', 'FUNCIONARIO') NOT NULL,
    id_restaurante INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_restaurante)
        REFERENCES restaurante(id_restaurante)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- ALIMENTO
-- =========================
CREATE TABLE alimento (
    id_alimento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

-- =========================
-- REFEICAO
-- =========================
CREATE TABLE refeicao (
    id_refeicao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_valor_refeicao CHECK (valor >= 0)
);

-- =========================
-- ONG
-- =========================
CREATE TABLE ong (
    id_ong INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(150)
);

-- =========================
-- REGISTRO PRODUCAO
-- =========================
CREATE TABLE registro_producao (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_alimento INT NOT NULL,
    id_usuario INT NOT NULL,
    quantidade_produzida DECIMAL(10,2) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_alimento)
        REFERENCES alimento(id_alimento),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

-- =========================
-- REGISTRO SOBRA
-- =========================
CREATE TABLE registro_sobra (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_refeicao INT NOT NULL,
    quantidade_produzida INT NOT NULL,
    quantidade_sobra INT NOT NULL,
    data_registro DATE NOT NULL,

    CONSTRAINT chk_qtd_produzida CHECK (quantidade_produzida >= 0),
    CONSTRAINT chk_qtd_sobra CHECK (quantidade_sobra >= 0),
    CONSTRAINT chk_sobra_valida CHECK (quantidade_sobra <= quantidade_produzida),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_refeicao)
        REFERENCES refeicao(id_refeicao)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- DESPERDICIO
-- =========================
CREATE TABLE desperdicio (
    id_desperdicio INT AUTO_INCREMENT PRIMARY KEY,
    id_registro INT NOT NULL,
    percentual_desperdicio DECIMAL(5,2),

    CONSTRAINT chk_percentual CHECK (percentual_desperdicio >= 0),

    FOREIGN KEY (id_registro)
        REFERENCES registro_sobra(id_registro)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- RELATORIO
-- =========================
CREATE TABLE relatorio (
    id_relatorio INT AUTO_INCREMENT PRIMARY KEY,
    id_restaurante INT NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    percentual_reducao DECIMAL(5,2),

    FOREIGN KEY (id_restaurante)
        REFERENCES restaurante(id_restaurante)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- ECONOMIA
-- =========================
CREATE TABLE economia (
    id_economia INT AUTO_INCREMENT PRIMARY KEY,
    id_relatorio INT NOT NULL,
    valor_economizado DECIMAL(10,2),

    CONSTRAINT chk_valor_economizado CHECK (valor_economizado >= 0),

    FOREIGN KEY (id_relatorio)
        REFERENCES relatorio(id_relatorio)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- DOACAO
-- =========================
CREATE TABLE doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_ong INT NOT NULL,
    id_registro INT NOT NULL,
    quantidade_doada INT NOT NULL,
    data_doacao DATE NOT NULL,

    CONSTRAINT chk_qtd_doada CHECK (quantidade_doada >= 0),

    FOREIGN KEY (id_ong)
        REFERENCES ong(id_ong)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_registro)
        REFERENCES registro_sobra(id_registro)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- TRIGGER: IDENTIFICAR CPF/CNPJ
-- =========================

DELIMITER $$

CREATE TRIGGER trg_tipo_pessoa_insert
BEFORE INSERT ON usuario
FOR EACH ROW
BEGIN
    SET NEW.documento = REPLACE(REPLACE(REPLACE(REPLACE(NEW.documento, '.', ''), '-', ''), '/', ''), ' ', '');

    IF LENGTH(NEW.documento) = 11 THEN
        SET NEW.tipo_pessoa = 'FISICA';
    ELSEIF LENGTH(NEW.documento) = 14 THEN
        SET NEW.tipo_pessoa = 'JURIDICA';
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Documento inválido!';
    END IF;
END$$

DELIMITER ;

-- =========================
-- TRIGGER UPDATE
-- =========================

DELIMITER $$

CREATE TRIGGER trg_tipo_pessoa_update
BEFORE UPDATE ON usuario
FOR EACH ROW
BEGIN
    SET NEW.documento = REPLACE(REPLACE(REPLACE(REPLACE(NEW.documento, '.', ''), '-', ''), '/', ''), ' ', '');

    IF LENGTH(NEW.documento) = 11 THEN
        SET NEW.tipo_pessoa = 'FISICA';
    ELSEIF LENGTH(NEW.documento) = 14 THEN
        SET NEW.tipo_pessoa = 'JURIDICA';
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Documento inválido!';
    END IF;
END$$

DELIMITER ;

-- =========================
-- DADOS INICIAIS
-- =========================

INSERT INTO restaurante (nome, cnpj, email, telefone, endereco, data_fundacao)
VALUES (
    'Restaurante Sabor Caseiro',
    '12.345.678/0001-99',
    'contato@saborcaseiro.com',
    '(71)99999-9999',
    'Rua Central, 100',
    '2020-01-10'
);

INSERT INTO alimento (nome, categoria)
VALUES
('Arroz','Acompanhamento'),
('Feijão','Acompanhamento'),
('Macarrão','Massa'),
('Carne Assada','Proteína'),
('Salada Verde','Salada');

INSERT INTO usuario (nome, email, senha, documento, nivel_acesso, id_restaurante)
VALUES
('João Silva','joao@gmail.com','123456','123.456.789-11','ADMIN',1),
('Empresa XPTO','empresa@gmail.com','123456','12.345.678/0001-99','SUPERVISOR',1);

INSERT INTO registro_producao (id_alimento, id_usuario, quantidade_produzida)
VALUES (1,1,20.5);

-- =========================
-- CONSULTAS
-- =========================

SELECT * FROM restaurante;
SELECT * FROM usuario;