const Random = require('./Random.js');

class Tests {

    constructor() {
        this.rand = new Random(null, null);
    }

    testRandomString() {
        // console.log(this.rand.randomString({totalLength: 8, uppers: 2, lowers: 2, numbers: 2, symbols: 2}));
        // console.log(this.rand.randomString({totalLength: 20, uppers: 5, lowers: 5, numbers: 5, symbols: 5}));
        // console.log(this.rand.randomString({totalLength: 8, uppers: [1, 2], lowers: [1, 2], numbers: [1, 2], symbols: [1, 2]}));
        // console.log(this.rand.randomString({totalLength: 12, uppers: [2, 8], lowers: [2, 2], numbers: 2, symbols: 2}));
        console.log('Mayúsculas', [...new Set(this.rand.randomString({uppers: 128}).split(''))].sort().join(''));
        console.log('Minúsculas', [...new Set(this.rand.randomString({lowers: 128}).split(''))].sort().join(''));
        console.log('Símbolos  ', [...new Set(this.rand.randomString({symbols: 128}).split(''))].sort().join(''));
        console.log('Números   ', [...new Set(this.rand.randomString({numbers: 128}).split(''))].sort().join(''));
        console.log('8 mayúsculas', this.rand.randomString({uppers: 8}));
        console.log('8 minúsculas', this.rand.randomString({lowers: 8}));
        console.log('8 números   ', this.rand.randomString({numbers: 8}));
        console.log('8 símbolos  ', this.rand.randomString({symbols: 8}));
        console.log('2-12 mayúsculas', this.rand.randomString({uppers: [2, 12]}));
        console.log('2-12 minúsculas', this.rand.randomString({lowers: [2, 12]}));
        console.log('2-12 números   ', this.rand.randomString({numbers: [2, 12]}));
        console.log('2-12 símbolos  ', this.rand.randomString({symbols: [2, 12]}));
    }

    testEmail() {
        console.log(this.rand.email());
    }

    testDate() {
        for (let i = 0; i < 10; i++) {
            console.log(this.rand.date({max: 18 * 365}));
        }
    }

    testRandomInt() {
        let nums = [];
        for (let i = 0; i < 100; i++) {
            nums.push(this.rand.randomInt(9))
        }
        console.log(nums.sort());
    }

    testUrl() {
        for (let i = 0; i < 100; i++) {
            console.log(this.rand.url());
        }

    }

    testWords() {
        console.log("Random word:", this.rand.randomWord());
        console.log("10 random words:", this.rand.generateWords(10));
        console.log("5 long words:", this.rand.generateWords(5, 6, 10));
        console.log("8 short words:", this.rand.generateWords(8, 3, 5));
    }

    run() {
        t.testRandomInt();
        this.testRandomString();
        this.testUrl();
        this.testWords();
    }
}

const t = new Tests();

t.run();
