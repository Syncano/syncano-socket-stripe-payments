import { assert, expect } from 'chai';
import { run, generateMeta } from 'syncano-test';

const config = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
let meta = generateMeta('sources/source');
let args = {};
let sourceID, customerID = '';


describe('CREATE, RETRIEVE, UPDATE, ATTACH AND DETACH SOURCES', () => {
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
    it('returns an error if a `DELETE` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'DELETE';
      run('sources/source', {
        meta,
        config
      }).then((response) => {
        const actions = 'creating, retrieving and updating sources respectively';
        const expectedMethodTypes = ['POST', 'GET', 'PUT'].join(', ');
        const errorMessage = `Make sure to use ${expectedMethodTypes} for ${actions}.`;
        expect(response.data.message).to.equal(errorMessage);
        done();
      });
    });

    it('creates source successfully', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      args = {
        sourceParameter: {
          type: 'bitcoin',
          amount: 1000,
          currency: 'usd',
          owner: {
            email: 'test@example.com'
          }
        }
      };

      run('sources/source', {
        args,
        meta,
        config
      }).then((response) => {
        sourceID = response.data.data.id;
        expect(response.data.message).to.equal('Source created');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('Retrieves sources', () => {
    it('retrieves created card', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        sourceID
      };
      run('sources/source', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Source Retrieved');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('updates sources', () => {
    it('updates existing sources ', (done) => {
      meta.request.REQUEST_METHOD = 'PUT';
      args = {
        sourceID,
        sourceParameter: {metadata: {order_id: 6789}}
      };
      run('sources/source', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Source Updated');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('attach source', () => {
    it('attach source to a customer  ', (done) => {
      meta = generateMeta('sources/attachSource');
      meta.request.REQUEST_METHOD = 'POST';
      args = {
        customerID,
        sourceParameter: {source: sourceID}
      };
      run('sources/attachSource', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Source Attached.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('detach source', () => {
    it('detach source from a customer ', (done) => {
      meta = generateMeta('sources/detachSource');
      meta.request.REQUEST_METHOD = 'DELETE';
      args = {
        customerID,
        sourceID
      };
      run('sources/detachSource', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Source Detached.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });
});

