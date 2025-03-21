class Random {

    characters = {
        'upper': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'lower': 'abcdefghijklmnopqrstuvwxyz',
        'numbers': '0123456789',
        'symbols': '!@#$%^&*()_+-=[]{}|;:,.<>?',
    }

    // noinspection SpellCheckingInspection
    categories = {
        'vowels': ['a', 'e', 'i', 'o', 'u',],
        'consonants': ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z',],
        'endings': ['s', 'l', 'n', 'z', '',],
        'consonantClusters': ['tr', 'pr', 'br', 'cr', 'dr', 'fr', 'gr', 'pl', 'bl', 'cl', 'gl', 'fl', 'st', 'sp', 'sc', 'nt', 'nd', 'mb', 'mp', 'ng',],
        'gender': ['iunde', 'mujer', 'hombr',],
        'academicLevel': ['bpasi', 'bsasi', 'bachi', 'tpecn', 'tecno', 'pregr', 'posgr', 'ndlan',],
        'ethnicGroup': ['gorit', 'indig', 'nmaae', 'ndlai', 'pdsba', 'rdads',],
        'dniType': ['cc', 'ce', 'ps', 'oth',],
        'localizationType': ['rural', 'urban',],
        'socioeconomicStratum': ['stra1', 'stra2', 'stra3', 'stra4', 'stra5', 'stra6', 'straC', 'straO',],
        'httpSchema': ['https', 'http',],
        'domains': ['com', 'org', 'gov.co', 'gov', 'co', 'edu', 'us',],
        'economicSector': ['manufacturing', 'commercial', 'services',],
        'mainEconomicActivity': ['catul', 'cdcea', 'cdaul', 'cdhry', 'cdtul', 'cdptu', 'octnt', 'capul', 'cdfty', 'cdpyb', 'cdcul', 'cdcda',],
    }

    constructor(pm, console) {
        this.pm = pm;
        this.console = console;
        if (pm) {
            const host = this.pm.environment.get('host') || '';
            this.pm.environment.set('back_general', host + '/apps/back_general');
        }
    }

    randomInt(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min)) + min;
    }

    randomParam(param, allowedCharacters) {
        if (param === undefined) {
            return [0, 0, 0, ''];
        } else if (typeof param === 'number') {
            return [param, param, 0, this.random(param, allowedCharacters)];
        } else {
            const min = param[0] || 0;
            const max = (param[1] !== undefined) ? param[1] : min;
            if (max < min) {
                throw new Error('Max is lesser than min.');
            }
            return [min, max, max - min, this.random(min, allowedCharacters)];
        }
    }

    random(length, allowedCharacters) {
        if (length <= 0 || !allowedCharacters || allowedCharacters.length === 0) {
            return '';
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = this.randomInt(allowedCharacters.length);
            result += allowedCharacters[randomIndex];
        }
        return result;
    }

    randomString({totalLength, uppers, lowers, numbers, symbols} = {}) {
        const uppersRange = this.randomParam(uppers, this.characters.upper);
        const lowersRange = this.randomParam(lowers, this.characters.lower);
        const numbersRange = this.randomParam(numbers, this.characters.numbers);
        const symbolsRange = this.randomParam(symbols, this.characters.symbols);
        const minChars = uppersRange[0] + lowersRange[0] + numbersRange[0] + symbolsRange[0];
        const maxChars = uppersRange[1] + lowersRange[1] + numbersRange[1] + symbolsRange[1];

        if (totalLength > 0) {
            if (maxChars === 0 && minChars > totalLength) {
                throw new Error('Invalid minimum string length');
            }
            if (maxChars > 0 && maxChars < totalLength) {
                throw new Error('Invalid maximum string length');
            }
        } else if (minChars === maxChars) {
            totalLength = minChars;
        } else {
            totalLength = this.randomInt(minChars, maxChars);
        }

        let fullString = uppersRange[3] + lowersRange[3] + numbersRange[3] + symbolsRange[3];

        const remaining = totalLength - fullString.length;
        if (remaining > 0) {
            fullString += this.randomString({
                totalLength: remaining,
                uppers: uppersRange[2],
                lowers: lowersRange[2],
                numbers: numbersRange[2],
                symbols: symbolsRange[2],
            }).substring(0, remaining);
        }

        return fullString
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');
    }

    randomWord(minLength = 3, maxLength = 8) {
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        let word = '';
        let isVowel = Math.random() > 0.7;

        for (let i = 0; i < length; i++) {
            if (isVowel) {
                word += this.item('vowels');
            } else {
                if (i < length - 2 && Math.random() < 0.2) {
                    word += this.item('consonants');
                    i++;
                } else {
                    word += this.item('consonants');
                }
            }
            isVowel = !isVowel;
        }

        if (this.categories.vowels.includes(word[word.length - 1]) && Math.random() > 0.5) {
            word += this.item('endings');
        }

        if (word.length > 5 && Math.random() > 0.7) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        return word;
    }

    generateWords(count = 10, minLength = 3, maxLength = 8) {
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(this.randomWord(minLength, maxLength));
        }
        return words;
    }


    number(digits) {
        return this.randomString({numbers: digits});
    }

    string(min, max) {
        return this.randomString({lowers: [min, max]});
    }

    phone() {
        return '60' + this.number(8);
    }

    cellphone() {
        return '3' + this.number(9);
    }

    email() {
        const length = [5, 8];
        return this.string(...length) + '@' + this.string(...length) + '.' + this.item('domains');
    }

    date({min = 60 * 365, max = 0} = {}) {
        const now = new Date();
        const minDate = new Date(now.getTime() + (min * 24 * 60 * 60 * 1000));
        const maxDate = new Date(now.getTime() + (max * 24 * 60 * 60 * 1000));
        const randomDate = new Date(this.randomInt(minDate.getTime(), maxDate.getTime()));
        return randomDate.toISOString().slice(0, 10);
    }

    url() {
        return this.item('httpSchema') + '://www.' + this.string(5, 8) + '.' + this.item('domains');
    }

    adultDate() {
        return this.date({max: -18 * 366})
    }

    item(category) {
        return this.categories[category][this.randomInt(this.categories[category].length)];
    }

    nitWithoutConfecamaras() {
        return this.randomInt(1000, 7999).toString(10) + '00';
    }

    nit() {
        const dni = this.randomInt(80000, 89999).toString(10) + this.randomInt(1000, 9999).toString(10);
        return dni + '-' + this.calculateDv(dni);
    }

    calculateDv(dni) {
        const primeNumbers = [0, 3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
        let accumulator = 0;
        const documentLength = dni.length;
        const document = dni.split('-');

        for (let i = 0; i < documentLength; i++) {
            const actualDigit = parseInt(document[0][i]);
            accumulator += (actualDigit * primeNumbers[documentLength - i]);
        }
        accumulator %= 11;
        return (accumulator > 1) ? 11 - accumulator : accumulator;
    }

}

if (typeof module !== 'undefined') module.exports = Random;
