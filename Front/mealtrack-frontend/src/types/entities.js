/**
 * @typedef {"ADMIN"|"SUPERVISOR"|"FUNCIONARIO"} NivelAcesso
 * ADMIN: acesso total. SUPERVISOR: relatórios e dashboard.
 * FUNCIONARIO: registro de produção e monitoramento.
 */

/**
 * @typedef {"FISICA"|"JURIDICA"} TipoPessoa
 */

/**
 * Entidade completa, usada como corpo de PUT /usuarios/{id}.
 * GET/POST retornam sempre {@link UsuarioResponse}, nunca este shape.
 *
 * @typedef {Object} Usuario
 * @property {number} id
 * @property {string} nome
 * @property {string} email
 * @property {string} senha
 * @property {string} documento
 * @property {TipoPessoa} tipoPessoa
 * @property {NivelAcesso} nivelAcesso
 * @property {Restaurante} [restaurante]
 * @property {string} [dataCadastro] ISO datetime, preenchido pelo backend
 */

/**
 * Corpo de POST /usuarios.
 *
 * @typedef {Object} UsuarioRequest
 * @property {string} nome
 * @property {string} email
 * @property {string} senha
 * @property {string} documento
 * @property {TipoPessoa} tipoPessoa
 * @property {NivelAcesso} nivelAcesso
 * @property {{id: number}} restaurante
 */

/**
 * Retorno de GET /usuarios, GET /usuarios/{id} e POST /usuarios.
 * Nunca inclui senha.
 *
 * @typedef {Object} UsuarioResponse
 * @property {number} id
 * @property {string} nome
 * @property {string} email
 * @property {NivelAcesso} nivelAcesso
 */

/**
 * Corpo de POST /usuarios/login.
 *
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} senha
 */

/**
 * `data` de dentro do ApiResponse retornado por POST /usuarios/login.
 *
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {number} id
 * @property {string} nome
 * @property {string} email
 * @property {NivelAcesso} nivelAcesso
 */

/**
 * @typedef {Object} Restaurante
 * @property {number} id
 * @property {string} nome
 * @property {string} cnpj
 * @property {string} email
 * @property {string} telefone
 * @property {string} endereco
 * @property {string} dataFundacao ISO date (yyyy-MM-dd)
 */

/**
 * @typedef {Object} Alimento
 * @property {number} id
 * @property {string} nome
 * @property {string} categoria
 */

/**
 * @typedef {Object} Refeicao
 * @property {number} id
 * @property {string} nome
 * @property {number} valor
 */

export {};
