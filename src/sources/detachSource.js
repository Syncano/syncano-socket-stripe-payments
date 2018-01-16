import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, sourceID } = ctx.args;
  const actions = 'detaching source';
  const expectedMethodTypes = ['DELETE'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (ctx.meta.request.REQUEST_METHOD === expectedMethodTypes[0]) {
      const detachSource = await stripe.customers.deleteSource(customerID, sourceID);
      return response.json({
        message: 'Source Detached.',
        statusCode: 200,
        data: detachSource
      });
    }
  } catch ({ type, message, statusCode }) {
    response.json({
      type,
      message,
      statusCode
    });
  }
};
