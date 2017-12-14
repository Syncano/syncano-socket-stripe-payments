import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerParameter, customerID } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const createStripeCustomer = await stripe.customers.create(customerParameter || {});
      return response.json({
        message: 'Customer created successfully.',
        statusCode: 200,
        data: createStripeCustomer,
      });
    } else if (requestMethod === 'GET') {
      const retrieveStripeCustomer = await stripe.customers.retrieve(customerID);
      return response.json({
        message: 'Customer retrieved successfully.',
        statusCode: 200,
        data: retrieveStripeCustomer,
      });
    } else if (requestMethod === 'PUT') {
      const updateStripeCustomer = await stripe.customers.update(customerID, customerParameter);
      return response.json({
        message: 'Customer updated successfully',
        statusCode: 200,
        data: updateStripeCustomer,
      });
    } else if (requestMethod === 'DELETE') {
      const deleteStripeCustomer = await stripe.customers.update(customerID);
      return response.json({
        message: 'Customer deleted successfully.',
        statusCode: 200,
        data: deleteStripeCustomer,
      });
    }
    throw new Error(
      'Make sure to use `POST`, `GET`, `PUT` and `DELETE` request method for creating, ' +
        'retrieving, updating and deleting customers respectively.',
      400,
    );
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
