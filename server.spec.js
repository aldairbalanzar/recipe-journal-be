const { expectCt } = require('helmet');
const Server = require('./server');

describe('environment', function() {
    it('should be using testing database', () => {
        expect(process.env.DB_ENV).toBe('testing')
    })
})