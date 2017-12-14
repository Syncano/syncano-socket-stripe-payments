import { assert, expect } from 'chai';
import { run, generateMeta } from 'syncano-test';

const config = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
};
let meta = generateMeta('customers/customer');
let args = {};
let customerID = '';

describe('CREATE, RETRIEVE, UPDATE, DELETE CUSTOMER AND LIST ALL CUSTOMERS', () => {
  describe('creates customer', () => {
    it('returns an error if a `PATCH` request method is passed to Url', (done) => {
      meta.request.REQUEST_METHOD = 'PATCH';
      run('customers/customer', {
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Make sure to use `POST`, `GET`, `PUT` and `DELETE` '
        + 'request method for creating, retrieving, updating and' +
        ' deleting customers respectively.');
        done();
      });
    });

    it('creates customer successfully', (done) => {
      meta.request.REQUEST_METHOD = 'POST';
      run('customers/customer', {
        meta,
        config
      }).then((response) => {
        customerID = response.data.data.id;
        expect(response.data.message).to.equal('Customer created successfully.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('Retrieves customer', () => {
    it('retrieves created customer', (done) => {
      meta.request.REQUEST_METHOD = 'GET';
      args = {
        customerID
      };
      run('customers/customer', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Customer retrieved successfully.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('updates customer', () => {
    it('updates existing customer ', (done) => {
      meta.request.REQUEST_METHOD = 'PUT';
      args = {
        customerID,
        customerParameter:
              {
                account_balance: 1000,
                description: 'testing things',
                email: 'testing@syncano.com'
              }
      };
      run('customers/customer', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Customer updated successfully');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });

  describe('list all customers', () => {
    it('lists all existing customers', (done) => {
      meta = generateMeta('customers/listAllCustomers');
      meta.request.REQUEST_METHOD = 'POST';
      args = {
        listCustomersParameter:
        {
          limit: 1
        }
      };
      run('customers/listAllCustomers', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('List of Customers.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data.data)
          .to.have.property('data')
          .to.be.an('Array').that.is.not.empty;
        done();
      });
    });
  });

  describe('deletes customer', () => {
    it('deletes existing customer ', (done) => {
      meta.request.REQUEST_METHOD = 'DELETE';
      args = {
        customerID
      };
      run('customers/customer', {
        args,
        meta,
        config
      }).then((response) => {
        expect(response.data.message).to.equal('Customer deleted successfully.');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data).to.have.property('data');
        done();
      });
    });
  });
});

