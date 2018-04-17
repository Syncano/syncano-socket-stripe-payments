import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { customerParameter = {}, customerID } = args;
  const actions = 'creating, retrieving, updating and deleting customers respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT', 'DELETE'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'POST') {
      const createStripeCustomer = await stripe.customers.create(customerParameter);
      return response.json({ message: 'Customer created successfully.', statusCode: 200, data: createStripeCustomer });
    }
    else if (requestMethod === 'GET') {
      const retrieveStripeCustomer = await stripe.customers.retrieve(customerID);
      return response.json({
        message: 'Customer retrieved successfully.', statusCode: 200, data: retrieveStripeCustomer });
    }
    else if (requestMethod === 'PUT') {
      const updateStripeCustomer = await stripe.customers.update(customerID, customerParameter);
      return response.json({ message: 'Customer updated successfully', statusCode: 200, data: updateStripeCustomer });
    }
    else if (requestMethod === 'DELETE') {
      const deleteStripeCustomer = await stripe.customers.del(customerID);
      return response.json({ message: 'Customer deleted successfully.', statusCode: 200, data: deleteStripeCustomer });
    }
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
