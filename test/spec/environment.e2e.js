
const { expect, sinon } = require('../util/test');

describe('environment unit tests', () => {

    it('`describe` and `it` are defined', () => {
    // no errors = success
    });

    it('chai `expect` api', () => {
        expect(true).to.be.true;
        expect(true).not.to.be.false;
    });

    it('sinon', () => {
        const spy = sinon.spy();
        spy();
        expect(spy).to.be.calledOnce;
    });

    it('chai as promised', () => {
        return expect(new Promise(resolve => setTimeout(resolve, 50)))
            .to.eventually.be.fulfilled;
    });

});
