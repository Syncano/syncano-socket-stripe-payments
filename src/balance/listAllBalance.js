import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);

  try {
    if (ctx.meta.request.REQUEST_METHOD === 'POST') {
      const balanceParams = ctx.args.params || {};
      const listBalanceTransaction = await stripe.balance.listTransactions(balanceParams);
      return response.json({
        message: 'List of Balance.',
        statusCode: 200,
        data: listBalanceTransaction,
      });
    }
    throw new Error(
      'Make sure to use `POST` request method for retrieving balance transaction.',
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
