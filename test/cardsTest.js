import { assert, expect } from 'chai';
import { run, generateMeta } from 'syncano-test';

const config = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
let meta = generateMeta('cards/card');
let args = {};
let cardID, customerID, source = '';

describe('CREATE, RETRIEVE, UPDATE, DELETE CARDS AND LIST ALL CARDS', () => {
  before((done) => {
    meta = generateMeta('customers/customer');
    run('customers/customer', {
      meta,
      config,
    }).then((response) => {
      customerID = response.data.data.id;
      done();
    });
  });

  describe('creates card', () => {
    it('returns an error if a `PATCH` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'PATCH';
      run('cards/card', {
        meta,
        config
      }).then((response) => {
        const actions = 'creating, retrieving, updating and deleting cards respectively';
        const expectedMethodTypes = ['POST', 'GET', 'PUT', 'DELETE'].join(', ');
        const errorMessage = `Make sure to use ${expectedMethodTypes} for ${actions}.`;
        expect(response.data.message).to.equal(errorMessage);
        done();
      });
    });

    it('creates card successfully', (done) => {
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
          cardParams: {source}
        };
        run('cards/card', {
          args,
          meta,
          config
        }).then((res) => {
          cardID = res.data.data.id;
          expect(res.data.message).to.equal('Card created.');
          expect(res.data.statusCode).to.equal(200);
          expect(res.data).to.have.property('data');
          done();
        });
      });
    });
  });

  describe('Retrieves card', () => {
    it('retrieves created card', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        customerID,
        cardID
      };
      run('cards/card', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Card Retrieved');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('updates card', () => {
    it('updates existing card ', (done) => {
      meta.request.REQUEST_METHOD = 'PUT';
      args = {
        customerID,
        cardID,
        cardParams: {
          name: 'Card Test'
        }
      };
      run('cards/card', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Card Updated');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('list all cards', () => {
    it('lists all cards related to customer  ', (done) => {
      meta = generateMeta('cards/listAllCards');
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        customerID
      };
      run('cards/listAllCards', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('List of Cards.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data.data)
          .to.have.property('data')
          .to.be.an('Array').that.is.not.empty;
        done();
      });
    });
  });

  describe('deletes card', () => {
    it('deletes existing card ', (done) => {
      meta.request.REQUEST_METHOD = 'DELETE';
      args = {
        customerID,
        cardID,
      };
      run('cards/card', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Card Deleted');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });
});

