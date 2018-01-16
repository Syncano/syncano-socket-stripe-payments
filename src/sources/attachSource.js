import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, sourceParameter } = ctx.args;
  const actions = 'attaching Source';
  const expectedMethodTypes = ['POST'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const attachSource = await stripe.customers.createSource(customerID, sourceParameter);
      return response.json({
        message: 'Source Attached.',
        statusCode: 200,
        data: attachSource
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
