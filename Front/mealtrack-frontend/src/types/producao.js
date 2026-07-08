/**
 * @typedef {import("./entities.js").Alimento} Alimento
 * @typedef {import("./entities.js").UsuarioResponse} UsuarioResponse
 */

/**
 * Entidade retornada por GET /producoes e GET /producoes/{id}.
 * Os campos `alimento` e `usuario` vêm como objeto completo (join), não
 * apenas o id.
 *
 * @typedef {Object} RegistroProducao
 * @property {number} id
 * @property {Alimento} alimento
 * @property {UsuarioResponse} usuario
 * @property {number} quantidadeProduzida em kg
 * @property {string} dataRegistro ISO datetime
 */

/**
 * Corpo de POST/PUT /producoes. O backend espera os relacionamentos
 * como referência por id, não o objeto completo.
 *
 * @typedef {Object} RegistroProducaoRequest
 * @property {{id: number}} alimento
 * @property {{id: number}} usuario
 * @property {number} quantidadeProduzida
 * @property {string} dataRegistro
 */

/**
 * Retorno de GET /dashboard. Estrutura fixa (Map<String,Object> no
 * backend), sem endpoint de série histórica — apenas estes agregados.
 *
 * @typedef {Object} DashboardData
 * @property {number} totalAlimentos
 * @property {number} totalUsuarios
 * @property {number} totalProducoes
 * @property {number|null} quantidadeProduzida soma de quantidadeProduzida
 * @property {number|null} mediaProduzida média de quantidadeProduzida
 * @property {string|null} alimentoMaisProduzido nome do alimento
 */

export {};
