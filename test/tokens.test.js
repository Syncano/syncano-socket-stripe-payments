import { assert, expect } from 'chai';
import { run, generateMeta } from '@syncano/test';

const config = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
const meta = generateMeta('tokens/token');
let args = {};
let tokenID = '';


describe('CREATE AND RETRIEVE TOKEN', () => {
  describe('creates token', () => {
    it('returns an error if a `DELETE` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'DELETE';
      run('tokens/token', {
        meta,
        config
      }).then((response) => {
        const actions = 'creating and retrieving tokens respectively';
        const expectedMethodTypes = ['POST', 'GET'].join(', ');
        const errorMessage = `Make sure to use ${expectedMethodTypes} for ${actions}.`;
        expect(response.data.message).to.equal(errorMessage);
        done();
      });
    });

    it('creates source successfully', (done) => {
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
        tokenID = response.data.data.id;
        expect(response.data.message).to.equal('Token created successfully');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('Retrieves token', () => {
    it('retrieves created token', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        tokenID
      };
      run('tokens/token', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Token retrieved successfully');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });
});

