import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);

  try {
    if (ctx.meta.request.REQUEST_METHOD === 'POST') {
      const listAllEvent = await stripe.events.list(ctx.args.eventsParams || {});
      return response.json({
        message: 'List of Events.',
        statusCode: 200,
        data: listAllEvent,
      });
    }
    throw new Error('Make sure to use `POST` request method for listing all events.', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
