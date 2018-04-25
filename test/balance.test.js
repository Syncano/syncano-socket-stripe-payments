import { assert, expect } from 'chai';
import { run, generateMeta } from '@syncano/test';

const config = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
let meta = generateMeta('balance/list-all-balance');
let args = {};
let actions = '';
let expectedMethodTypes = [];

describe('LIST ALL BALANCE, RETRIEVE BALANCE, AND RETRIEVE BALANCE TRANSACTIONS', () => {
  describe('List All Balance', () => {
    it('returns an error if a `POST` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      run('balance/list-all-balance', {
        meta,
        config
      }).then((response) => {
        actions = 'listing all balance';
        expectedMethodTypes = ['GET'];
        expect(response.data.message)
          .to.equal(`Make sure to use ${expectedMethodTypes} for ${actions}.`);
        done();
      });
    });

    it('list all balance if no argument parameter and `GET` request method is passed', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      run('balance/list-all-balance', {
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('List of Balance.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data.data)
          .to.have.property('data')
          .to.be.an('Array').that.is.not.empty;
        done();
      });
    });

    it('list all balance if argument parameter and `GET` request method is passed', (done) => {
      args = {
        currency: 'usd',
        limit: 3
      };
      meta.request.REQUEST_METHOD = 'GET';
      run('balance/list-all-balance', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('List of Balance.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data.data)
          .to.have.property('data')
          .to.be.an('Array').that.is.not.empty;
        done();
      });
    });
  });

  describe('Retrieve Balance', () => {
    meta = generateMeta('balance/retrieve-balance');
    it('returns an error if a `POST` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      run('balance/retrieve-balance', {
        meta,
        config
      }).then((response) => {
        expectedMethodTypes = 'GET';
        actions = 'retrieving balance';
        expect(response.data.message)
          .to.equal(`Make sure to use ${expectedMethodTypes} for ${actions}.`);
        done();
      });
    });

    it('list all balance if no argument parameter and `POST` request method is passed', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      run('balance/retrieve-balance', {
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Balance report.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data.data)
          .to.have.property('available')
          .to.be.an('Array').that.is.not.empty;
        done();
      });
    });
  });

  describe('Retrieve Balance Transaction', () => {
    meta = generateMeta('balance/retrieve-balance-transaction');
    it('returns an error if a `POST` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      run('balance/retrieve-balance-transaction', {
        meta,
        config
      }).then((response) => {
        actions = 'retrieving balance transaction';
        expectedMethodTypes = ['GET'];
        expect(response.data.message)
          .to.equal(`Make sure to use ${expectedMethodTypes} for ${actions}.`);
        done();
      });
    });

    it('returns an error message if ID is no passed', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      run('balance/retrieve-balance-transaction', {
        meta,
        config
      }).then((response) => {
        expect(response.data).to.have.property('message');
        done();
      });
    });

    it('list all balance if argument parameter and `POST` request method is passed', (done) => {
      args = {
        transID: 'txn_1BYXxzJbpxha41ttgmoeelpy'
      };
      meta.request.REQUEST_METHOD = 'GET';
      run('balance/retrieve-balance-transaction', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Balance transaction report.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });
});
