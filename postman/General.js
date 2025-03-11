class General {

    constructor(pm, console, rand = null) {
        this.pm = pm;
        this.console = console;
        this.rand = rand;
        const host = this.pm.environment.get('host');
        this.pm.environment.set('back_general', host + '/apps/back_general');
    }

    sendRequestAsync(req) {
        return new Promise((resolve, reject) => {
            this.pm.sendRequest(req, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    getRequest(url) {
        return this.sendRequestAsync({
            url: this.getUrl('back_general') + url,
            method: 'GET',
            header: {'Content-Type': 'application/json'},
        });
    }

    graphqlRequest(query, requireAuth = false) {
        let header = {'Content-Type': 'application/json'};
        if (requireAuth) {
            const token = this.pm.environment.get('authToken');
            if (!token) {
                throw new Error('No se encuentra el token de autenticación');
            }
            header['Authorization'] = 'Bearer ' + this.pm.environment.get('authToken');
        }
        return this.sendRequestAsync({
            url: this.getGraphUrl('back_general'),
            method: 'POST',
            header: header,
            body: {mode: 'raw', raw: JSON.stringify({query: query})}
        });
    }

    getUrl(workspace) {
        const host = this.pm.environment.get('host');

        return this.pm.environment.get(workspace);
    }

    getGraphUrl(workspace) {
        return this.getUrl(workspace) + '/graphql';
    }

    async duplicateFile() {
        return (await this.getRequest('/duplicateFile/')).json().id;
    }

    async getCaptcha(request) {
        const query = `
            query GetCaptcha {
                getCaptcha {
                    key
                    value
                }
            }
        `;

        const {key, value} = (await this.graphqlRequest(query)).json().data.getCaptcha;
        this.pm.environment.set('captchaKey', key);
        this.pm.environment.set('captchaValue', value);
    }

    async companyInfo() {
        let userId;
        if (!(userId = this.pm.environment.get('authUserId'))) {
            throw new Error('No se encuentra authUserId');
        }
        this.login(userId)
        this.pm.environment.set('url', this.rand.url());
        this.pm.environment.set('nit', this.rand.nit());
        this.pm.environment.set('localizationType', this.rand.item('localizationType'));
        this.pm.environment.set('socioeconomicStratum', this.rand.item('socioeconomicStratum'));
        this.pm.environment.set('ordinaryActivityRevenue', this.rand.randomInt(1000000000, 10000000000));
        this.pm.environment.set('economicSector', this.rand.item('economicSector'));
        this.pm.environment.set('mainEconomicActivity', this.rand.item('mainEconomicActivity'));
        this.pm.environment.set('ordinanceDate', this.rand.date({min: -730}));
        this.pm.environment.set('incomeCertificationFileId', await this.duplicateFile());
    }

    foodInfo() {

    }

    userInfo() {
        this.pm.environment.set('email', this.rand.email());
        this.pm.environment.set('email2', this.rand.email());
        this.pm.environment.set('phone', this.rand.phone());
        this.pm.environment.set('cellphone', this.rand.cellphone());
        this.pm.environment.set('birthDate', this.rand.adultDate());
        this.pm.environment.set('dniExpeditionDate', this.rand.date({min: -6000, max: -5000}));
        this.pm.environment.set('gender', this.rand.item('gender'));
        this.pm.environment.set('ethnicGroup', this.rand.item('ethnicGroup'));
        this.pm.environment.set('academicLevel', this.rand.item('academicLevel'));
        this.pm.environment.set('dniType', this.rand.item('dniType'));
        this.pm.environment.set('localizationType', this.rand.item('localizationType'));
        this.pm.environment.set('socioeconomicStratum', this.rand.item('socioeconomicStratum'));
    }

    async login(userId) {
        const tokenExpirationTime = this.pm.environment.get('authTokenExpiration');
        const tokenUserId = this.pm.environment.get('authTokenUserId');
        if (!tokenExpirationTime || !tokenUserId || tokenUserId !== userId || tokenExpirationTime < Date.now()) {
            const jsonResponse = (await this.getRequest('/login/' + userId)).json();
            if (!jsonResponse || !jsonResponse.token || !jsonResponse.expirationTime) {
                throw new Error('No se pudo obtener el token de la respuesta');
            }
            this.pm.environment.set('authToken', jsonResponse.token);
            this.pm.environment.set('authTokenExpiration', jsonResponse.expirationTime);
            this.pm.environment.set('authTokenUserId', userId);
        }
    }
}

if (typeof module !== 'undefined') module.exports = General;
