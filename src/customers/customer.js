import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerParameter, customerID } = ctx.args;
  const actions = 'creating, retrieving, updating and deleting customers respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT', 'DELETE'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const createStripeCustomer = await stripe.customers.create(customerParameter || {});
      return response.json({
        message: 'Customer created successfully.',
        statusCode: 200,
        data: createStripeCustomer,
      });
    } else if (requestMethod === expectedMethodTypes[1]) {
      const retrieveStripeCustomer = await stripe.customers.retrieve(customerID);
      return response.json({
        message: 'Customer retrieved successfully.',
        statusCode: 200,
        data: retrieveStripeCustomer,
      });
    } else if (requestMethod === expectedMethodTypes[2]) {
      const updateStripeCustomer = await stripe.customers.update(customerID, customerParameter);
      return response.json({
        message: 'Customer updated successfully',
        statusCode: 200,
        data: updateStripeCustomer,
      });
    } else if (requestMethod === expectedMethodTypes[3]) {
      const deleteStripeCustomer = await stripe.customers.del(customerID);
      return response.json({
        message: 'Customer deleted successfully.',
        statusCode: 200,
        data: deleteStripeCustomer,
      });
    }
  } catch ({type, message, statusCode}) {
    response.json({
      type,
      message,
      statusCode
    });
  }
};
