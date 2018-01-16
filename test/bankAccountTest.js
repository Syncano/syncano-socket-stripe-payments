import { assert, expect } from 'chai';
import { run, generateMeta } from 'syncano-test';

const config = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
let meta = generateMeta('bankAccounts/bankAccount');
let args = {};
let customerID,
  source,
  bankAcctID = '';

describe('CREATE, RETRIEVE, UPDATE, LIST, VERIFY AND DELETE Bank Account', () => {
  before((done) => {
    meta = generateMeta('customers/customer');
    run('customers/customer', {
      meta,
      config
    }).then((response) => {
      customerID = response.data.data.id;
      done();
    });
  });

  describe('creates bank Account', () => {
    it('returns an error if a `PATCH` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'PATCH';
      run('bankAccounts/bankAccount', {
        meta,
        config
      }).then((response) => {
        const actions = 'creating, retrieving, updating & deleting bank account respectively';
        const expectedMethodTypes = ['POST', 'GET', 'PUT', 'DELETE'].join(', ');
        const errorMessage = `Make sure to use ${expectedMethodTypes} for ${actions}.`;
        expect(response.data.message).to.equal(errorMessage);
        done();
      });
    });

    it('throws an error when no argument parameter is passed ', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      run('bankAccounts/bankAccount', {
        meta,
        config
      }).then((response) => {
        expect(response.data).to.have.property('message');
        done();
      });
    });

    it('throws error if wrong customerID is passed', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      args = {
        customerID: 'cus_BwTBe5H6QBA',
        bankAcctParams: {
          source: 'tok_1BZLlzJbpxha41ttSWMzMbjE'
        }
      };
      run('bankAccounts/bankAccount', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.type).to.equal('StripeInvalidRequestError');
        expect(response.data.message).to.equal(`No such customer: ${args.customerID}`);
        expect(response.data.statusCode).to.equal(400);
        done();
      });
    });

    it('returns an error if source parameter is missing', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      args = {
        customerID: 'cus_BwTBe5lcoH6QBA'
      };
      run('bankAccounts/bankAccount', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.type).to.equal('StripeInvalidRequestError');
        expect(response.data.message).to.equal('Missing required param: source.');
        expect(response.data.statusCode).to.equal(400);
        done();
      });
    });

    it('creates', (done) => {
      meta = generateMeta('tokens/token');
      meta.request.REQUEST_METHOD = 'POST';
      args = {
        tokenParams: {
          card: {
            number: 4242424242424242,
            exp_month: 12,
            exp_year: 2018,
            cvc: 123
          }
        }
      };
      run('tokens/token', {
        args,
        meta,
        config
      }).then((response) => {
        source = response.data.data.id;
        args = {
          customerID,
          bankAcctParams: { source }
        };
        run('bankAccounts/bankAccount', {
          args,
          meta,
          config
        }).then((res) => {
          bankAcctID = res.data.data.id;
          expect(res.data.message).to.equal('Bank account created');
          expect(res.data.statusCode).to.equal(200);
          expect(res.data).to.have.property('data');
          done();
        });
      });
    });
  });

  describe('Retrieves bank Account', () => {
    it('retrieves created bank Account', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        customerID,
        bankAcctID
      };
      run('bankAccounts/bankAccount', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Bank Account Retrieved');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('updates bank Account', () => {
    it('updates existing bank Account ', (done) => {
      meta.request.REQUEST_METHOD = 'PUT';
      args = {
        customerID,
        bankAcctID,
        bankAcctParams: {
          metadata: {
            name: 'update me test'
          }
        }
      };
      run('bankAccounts/bankAccount', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Bank Account Updated');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('list all bank accounts', () => {
    it('lists all account  ', (done) => {
      meta = generateMeta('bankAccounts/listAllBankAccts');
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        customerID,
        limit: 3
      };
      run('bankAccounts/listAllBankAccts', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('List of Bank Accounts.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data.data)
          .to.have.property('data')
          .to.be.an('Array').that.is.not.empty;
        done();
      });
    });
  });

  describe(
    'throws error message, as we are verifying cards ' + "and can't use banks in test mode",
    () => {
      it('throws error message when verifying card ', (done) => {
        meta = generateMeta('bankAccounts/verifyBankAccts');
        meta.request.REQUEST_METHOD = 'POST';
        args = {
          customerID,
          bankAcctID,
          bankAcctParams: {
            amounts: [32, 45]
          }
        };
        run('bankAccounts/verifyBankAccts', {
          args,
          meta,
          config
        }).then((response) => {
          expect(response.data.type).to.equal('StripeInvalidRequestError');
          expect(response.data.message).to.equal(`The payment source ${bankAcctID} ` + 'does not require validation.');
          expect(response.data.statusCode).to.equal(400);
          done();
        });
      });
    }
  );

  describe('deletes bank Account', () => {
    it('deletes existing bank Account ', (done) => {
      meta.request.REQUEST_METHOD = 'DELETE';
      args = {
        customerID,
        bankAcctID
      };
      run('bankAccounts/bankAccount', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Bank Account Deleted');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });
});
