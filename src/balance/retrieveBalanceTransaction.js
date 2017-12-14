import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);

  try {
    if (ctx.meta.request.REQUEST_METHOD === 'GET') {
      const retrieveBalanceTransaction = await stripe.balance.retrieveTransaction(ctx.args.transID);
      return response.json(
        {
          message: 'Balance transaction report.',
          statusCode: 200,
          data: retrieveBalanceTransaction,
        },
        200,
      );
    }
    throw new Error(
      'Make sure to use `GET` request method for retrieving balance transaction.',
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
