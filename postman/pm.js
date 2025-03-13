const module = {};

/**
 * Clase dummy que simula el entorno de Postman para desarrollo
 */
class pm {
    constructor() {
        this._environmentVars = new Map();
        this._globalVars = new Map();
        this._collectionVars = new Map();
        this._cookieVars = new Map();
        this._variables = new Map();

        /**
         * Variables de entorno
         * @type {Object}
         */
        this.environment = {
            get: (varName) => this._environmentVars.get(varName) || null,
            set: (varName, value) => {
                this._environmentVars.set(varName, value);
                console.log(`Environment variable set: ${varName} = ${value}`);
            },
            unset: (varName) => {
                this._environmentVars.delete(varName);
                console.log(`Environment variable unset: ${varName}`);
            },
            has: (varName) => this._environmentVars.has(varName)
        };

        /**
         * Variables globales
         * @type {Object}
         */
        this.globals = {
            get: (varName) => this._globalVars.get(varName) || null,
            set: (varName, value) => {
                this._globalVars.set(varName, value);
                console.log(`Global variable set: ${varName} = ${value}`);
            },
            unset: (varName) => {
                this._globalVars.delete(varName);
                console.log(`Global variable unset: ${varName}`);
            },
            has: (varName) => this._globalVars.has(varName)
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
            get: (varName) => this._collectionVars.get(varName) || null,
            set: (varName, value) => {
                this._collectionVars.set(varName, value);
                console.log(`Collection variable set: ${varName} = ${value}`);
            },
            unset: (varName) => {
                this._collectionVars.delete(varName);
                console.log(`Collection variable unset: ${varName}`);
            },
            has: (varName) => this._collectionVars.has(varName)
        };

        /**
         * Objeto de cookies
         * @type {Object}
         */
        this.cookies = {
            get: (varName) => this._cookieVars.get(varName) || null,
            set: (varName, value) => {
                this._cookieVars.set(varName, value);
                console.log(`Cookie set: ${varName} = ${value}`);
            },
            unset: (varName) => {
                this._cookieVars.delete(varName);
                console.log(`Cookie unset: ${varName}`);
            },
            has: (varName) => this._cookieVars.has(varName)
        };

        /**
         * Variables adicionales
         * @type {Object}
         */
        this.variables = {
            get: (varName) => this._variables.get(varName) || null,
            set: (varName, value) => {
                this._variables.set(varName, value);
                console.log(`Variable set: ${varName} = ${value}`);
            },
            unset: (varName) => {
                this._variables.delete(varName);
                console.log(`Variable unset: ${varName}`);
            },
            has: (varName) => this._variables.has(varName)
        };

        this.execution = {
            skipRequest: () => {
            },
        }
    }

    /**
     * Registra información en la consola
     * @param {...any} args - Argumentos para imprimir
     */
    info(...args) {
        console.log('[INFO]', ...args);
    }

    /**
     * Registra errores en la consola
     * @param {...any} args - Argumentos para imprimir
     */
    error(...args) {
        console.error('[ERROR]', ...args);
    }

    /**
     * Envía una solicitud HTTP real utilizando fetch
     * @param {Object} request - Configuración de la solicitud
     * @param {Function} callback - Función de callback
     * @returns function
     */
    sendRequest(request, callback) {
        // Crear una configuración fetch a partir de la solicitud Postman
        const fetchOptions = {
            method: request.method || 'GET',
            headers: request.headers || {},
            body: request.data ? JSON.stringify(request.data) : undefined
        };

        // Procesar variables en la URL utilizando el formato {{variable}}
        let processedUrl = request.url;
        if (processedUrl) {
            const varRegex = /\{\{([^}]+)}}/g;
            processedUrl = processedUrl.replace(varRegex, (match, varName) => {
                // Buscar la variable en diferentes ámbitos
                return this.environment.get(varName) ||
                    this.globals.get(varName) ||
                    this.collectionVariables.get(varName) ||
                    this.variables.get(varName) ||
                    match; // Mantener el texto original si no se encuentra
            });
        }

        // Realizar la solicitud real
        return fetch(processedUrl, fetchOptions)
            .then(response => {
                // Crear objeto de respuesta al estilo Postman
                const pmResponse = {
                    code: response.status,
                    status: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    _responseBody: null,

                    // Métodos para acceder al cuerpo de la respuesta
                    json: async () => {
                        if (!this._responseBody) {
                            this._responseBody = await response.json();
                        }
                        return this._responseBody;
                    },

                    text: async () => {
                        if (!this._responseBody) {
                            this._responseBody = await response.text();
                        }
                        return this._responseBody;
                    }
                };

                // Actualizar la respuesta actual
                this.response = pmResponse;

                // Llamar al callback con la respuesta
                if (typeof callback === 'function') {
                    return callback(null, pmResponse);
                }

                return pmResponse;
            })
            .catch(error => {
                if (typeof callback === 'function') {
                    return callback(error, null);
                }
                throw error;
            });
    }

    /**
     * Espera un tiempo específico
     * @param {number} ms - Milisegundos a esperar
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Objeto para tests
 * @type {Object}
 */
const pm_test = {
    _testResults: [],

    /**
     * Ejecuta un test
     * @param {string} testName - Nombre del test
     * @param {Function} callback - Función del test
     */
    test(testName, callback) {
        try {
            callback();
            this._testResults.push({name: testName, passed: true});
            console.log(`✓ Test passed: ${testName}`);
        } catch (error) {
            this._testResults.push({name: testName, passed: false, error: error.message});
            console.error(`✗ Test failed: ${testName} - ${error.message}`);
        }
    },

    getResults() {
        return this._testResults;
    }
};

/**
 * Objeto para assertions
 * @type {Object}
 */
const pm_expect = function (value) {
    const assertions = {
        to: {
            be: {
                true: () => {
                    if (value !== true) throw new Error(`Expected ${value} to be true`);
                    return assertions;
                },
                false: () => {
                    if (value !== false) throw new Error(`Expected ${value} to be false`);
                    return assertions;
                },
                null: () => {
                    if (value !== null) throw new Error(`Expected ${value} to be null`);
                    return assertions;
                },
                undefined: () => {
                    if (value !== undefined) throw new Error(`Expected ${value} to be undefined`);
                    return assertions;
                }
            },
            equal: (expected) => {
                if (value !== expected) throw new Error(`Expected ${value} to equal ${expected}`);
                return assertions;
            },
            eql: (expected) => {
                if (JSON.stringify(value) !== JSON.stringify(expected))
                    throw new Error(`Expected ${JSON.stringify(value)} to deeply equal ${JSON.stringify(expected)}`);
                return assertions;
            },
            include: (expected) => {
                if (!value || typeof value.includes !== 'function' || !value.includes(expected))
                    throw new Error(`Expected ${value} to include ${expected}`);
                return assertions;
            },
            have: {
                property: (prop) => {
                    if (!value || typeof value !== 'object' || !(prop in value))
                        throw new Error(`Expected object to have property ${prop}`);
                    return assertions;
                },
                status: (code) => {
                    if (!value || value.code !== code)
                        throw new Error(`Expected response to have status ${code} but got ${value ? value.code : 'undefined'}`);
                    return assertions;
                },
                header: (header) => {
                    if (!value || !value.headers || !(header in value.headers))
                        throw new Error(`Expected response to have header ${header}`);
                    return assertions;
                },
                jsonSchema: (schema) => {
                    // Implementación básica de validación de esquema
                    console.log(`Validating against schema: ${JSON.stringify(schema)}`);
                    // Aquí se podría implementar una validación real de esquema JSON
                    return assertions;
                }
            }
        }
    };
    return assertions;
};

// Exportar para uso en módulos
module.exports = {pm, pm_test, pm_expect};

// Ejemplo de uso:
/*
const { pm, pm_test, pm_expect } = require('./postman-dummy');

// Crear instancia
const postman = new pm();

// Establecer variables
postman.environment.set('baseUrl', 'https://api.example.com');
postman.environment.set('apiKey', '12345');

// Enviar una solicitud
postman.sendRequest({
    url: '{{baseUrl}}/users',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer {{apiKey}}',
        'Content-Type': 'application/json'
    }
}, (err, res) => {
    if (err) {
        postman.error('Request failed', err);
        return;
    }

    postman.info('Response received', res.code);

    // Ejecutar tests
    pm_test.test('Status code is 200', () => {
        pm_expect(res.code).to.equal(200);
    });
});
*/
