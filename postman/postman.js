/**
 * Clase dummy que simula el entorno de Postman para desarrollo
 */
class pm {
    constructor() {
        /**
         * Variables de entorno
         * @type {Object}
         */
        this.environment = {
            get: (varName) => null,
            set: (varName, value) => {
            },
            unset: (varName) => {
            },
            has: (varName) => false
        };

        /**
         * Variables globales
         * @type {Object}
         */
        this.globals = {
            get: (varName) => null,
            set: (varName, value) => {
            },
            unset: (varName) => {
            },
            has: (varName) => false
        };

        /**
         * Información de la solicitud actual
         * @type {Object}
         */
        this.request = {
            headers: {},
            method: '',
            url: '',
            data: null
        };

        /**
         * Información de la respuesta actual
         * @type {Object}
         */
        this.response = {
            code: 200,
            status: 'OK',
            headers: {},
            json: () => ({}),
            text: () => ''
        };

        /**
         * Objeto de colecciones
         * @type {Object}
         */
        this.collectionVariables = {
            get: (varName) => null,
            set: (varName, value) => {
            },
            unset: (varName) => {
            }
        };

        /**
         * Objeto de cookies
         * @type {Object}
         */
        this.cookies = {
            get: (varName) => null,
            set: (varName, value) => {
            },
            unset: (varName) => {
            }
        };
        /**
         * Objeto de cookies
         * @type {Object}
         */
        this.variables = {
            get: (varName) => null,
            set: (varName, value) => {
            },
            unset: (varName) => {
            }
        };
    }

    /**
     * Registra información en la consola
     * @param {...any} args - Argumentos para imprimir
     */
    info(...args) {
    }

    /**
     * Registra errores en la consola
     * @param {...any} args - Argumentos para imprimir
     */
    error(...args) {
    }

    /**
     * Envía una solicitud HTTP
     * @param {Object} request - Configuración de la solicitud
     * @returns {Promise<Object>}
     */
    sendRequest(request) {
        return Promise.resolve({});
    }

    /**
     * Espera un tiempo específico
     * @param {number} ms - Milisegundos a esperar
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return Promise.resolve();
    }
}

/**
 * Objeto para tests
 * @type {Object}
 */
const pm_test = {
    /**
     * Ejecuta un test
     * @param {string} testName - Nombre del test
     * @param {Function} callback - Función del test
     */
    test(testName, callback) {
    },
};

/**
 * Objeto para assertions
 * @type {Object}
 */
const pm_expect = function (value) {
    return {
        to: {
            be: {
                true: () => {
                },
                false: () => {
                },
                null: () => {
                },
                undefined: () => {
                }
            },
            equal: (expected) => {
            },
            include: (expected) => {
            },
            have: {
                property: (prop) => {
                },
                status: (code) => {
                },
                header: (header) => {
                },
                jsonSchema: (schema) => {
                }
            }
        }
    };
};

// Exportar para uso en módulos
module.exports = {pm, pm_test, pm_expect};
