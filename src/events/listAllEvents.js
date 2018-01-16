import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const actions = 'listing all events';
  const expectedMethodTypes = ['POST'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const listAllEvent = await stripe.events.list(ctx.args || {});
      return response.json({
        message: 'List of Events.',
        statusCode: 200,
        data: listAllEvent
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
