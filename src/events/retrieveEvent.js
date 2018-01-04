import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const actions = 'retrieving event';
  const expectedMethodTypes = ['POST', 'GET', 'PUT', 'DELETE'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const retrieveEvent = await stripe.events.retrieve(ctx.args.eventID);
      return response.json(
        {
          message: 'Event retrieved successfully.',
          statusCode: 200,
          data: retrieveEvent
        },
        200
      );
    }
  } catch ({ type, message, statusCode }) {
    response.json({
      type,
      message,
      statusCode
    });
  }
};
