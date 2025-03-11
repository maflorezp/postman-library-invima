class Invima {

    constructor(pm, console, rand = null) {
        this.pm = pm;
        this.console = console;
        this.rand = rand;
        const host = this.pm.environment.get('host');
        this.pm.environment.set('back_general', host + '/apps/back_general');
    }

    getUrl(workspace) {
        const host = this.pm.environment.get('host');

        return this.pm.environment.get(workspace);
    }

    getGraphUrl(workspace) {
        return this.getUrl(workspace) + '/graphql';
    }

    duplicateFile(environmentVariable) {
        this.pm.sendRequest({
            url: this.getUrl('back_general') + '/duplicateFile/',
            method: 'GET',
            header: {'Content-Type': 'application/json'},
        }, (err, response) => {
            if (err) {
                this.console.error(err);
            } else {
                const data = response.json();
                this.pm.environment.set(environmentVariable, data.id);
            }
        });
    }

    getCaptcha(request) {
        const query = `
            query GetCaptcha {
                getCaptcha {
                    key
                    value
                }
            }
        `;

        this.pm.sendRequest({
            url: this.getGraphUrl('back_general'),
            method: 'POST',
            header: {'Content-Type': 'application/json'},
            body: {mode: 'raw', raw: JSON.stringify({query: query})}
        }, (err, response) => {
            if (err) {
                this.console.error(err);
            } else {
                const data = response.json().data.getCaptcha;
                this.pm.environment.set('captchaKey', data.key);
                this.pm.environment.set('captchaValue', data.value);
            }
        });
    }

    companyInfo() {
        this.pm.environment.set('url', this.rand.url());
        this.pm.environment.set('nit', this.rand.nit());
        this.pm.environment.set('localizationType', this.rand.item('localizationType'));
        this.pm.environment.set('socioeconomicStratum', this.rand.item('socioeconomicStratum'));
        this.pm.environment.set('ordinaryActivityRevenue', this.rand.randomInt(1000000000, 10000000000));
        this.pm.environment.set('economicSector', this.rand.item('economicSector'));
        this.pm.environment.set('mainEconomicActivity', this.rand.item('mainEconomicActivity'));
        this.pm.environment.set('ordinanceDate', this.rand.date({min: -730}));
        this.duplicateFile('incomeCertificationFileId');
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

    login(userId) {
        const tokenExpirationTime = this.pm.environment.get('authTokenExpiration');
        const tokenUserId = this.pm.environment.get('authTokenUserId');
        if (!tokenExpirationTime || !tokenUserId || tokenUserId !== userId || tokenExpirationTime < Date.now()) {
            this.pm.sendRequest({
                url: this.getUrl('back_general') + '/login/' + userId,
                method: 'GET',
                header: {'Content-Type': 'application/json'},
            }, (err, response) => {
                if (err) {
                    this.console.error(err);
                } else {
                    const jsonResponse = response.json();
                    if (jsonResponse && jsonResponse.token) {
                        this.pm.environment.set('authToken', jsonResponse.token);
                        this.pm.environment.set('authTokenExpiration', jsonResponse.expirationTime);
                        this.pm.environment.set('authTokenUserId', userId);
                    } else {
                        this.console.error('No se pudo obtener el token de la respuesta');
                    }
                }
            });
        }
    }
}
