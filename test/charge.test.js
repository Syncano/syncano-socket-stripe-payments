import { assert, expect } from 'chai';
import { run, generateMeta } from '@syncano/test';

const config = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
let meta = generateMeta('charge/charges');
let args = {};
let chargeID, customerID;

describe('CREATE, RETRIEVE, UPDATE, CAPTURE CHARGE AND LIST ALL CHARGE', () => {
  describe('creates charge', () => {
    it('returns an error if a `DELETE` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'DELETE';
      run('charge/charges', {
        meta,
        config
      }).then((response) => {
        const actions = 'creating, retrieving and updating charges respectively';
        const expectedMethodTypes = ['POST', 'GET', 'PUT'].join(', ');
        const errorMessage = `Make sure to use ${expectedMethodTypes} for ${actions}.`;
        expect(response.data.message).to.equal(errorMessage);
        done();
      });
    });

    it('creates charge successfully', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      args = {
        chargeParameter: {
          currency: 'usd',
          source: 'tok_mastercard',
          amount: 500,
          capture: false
        }
      };
      run('charge/charges', {
        args,
        meta,
        config
      }).then((response) => {
        chargeID = response.data.data.id;
        expect(response.data.message).to.equal('Charge created');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('Retrieves charge', () => {
    it('retrieves created charge', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        chargeID,
      };
      run('charge/charges', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Charge Retrieved');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('updates charge', () => {
    it('updates existing charge ', (done) => {
      meta.request.REQUEST_METHOD = 'PUT';
      args = {
        chargeID,
        chargeParameter: {
          description: 'Card Test',
          receipt_email: 'test@example.com'
        }
      };
      run('charge/charges', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Charge Updated');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('list all charge', () => {
    it('lists all cards related to customer  ', (done) => {
      meta = generateMeta('charge/list-all-charges');
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        source: {
          object: 'card'
        }
      };
      run('charge/list-all-charges', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('List of Charges');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data.data)
          .to.have.property('data')
          .to.be.an('Array').that.is.not.empty;
        done();
      });
    });
  });

  describe('capture charge', () => {
    it('captures charge related to customer', (done) => {
      meta = generateMeta('charge/capture-charge');
      meta.request.REQUEST_METHOD = 'POST';
      args = {
        chargeID
      };
      run('charge/capture-charge', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Charge Captured');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });
});

