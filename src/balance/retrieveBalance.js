import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);

  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);

  try {
    if (ctx.meta.request.REQUEST_METHOD === 'GET') {
      const retrieveStripeBalance = await stripe.balance.retrieve();
      return response.json({
        message: 'Balance report.',
        statusCode: 200,
        data: retrieveStripeBalance,
      });
    }
    throw new Error('Make sure to use `GET` request method for retrieving balance.', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
