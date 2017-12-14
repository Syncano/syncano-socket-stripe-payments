import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, cardParams } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const listAllCards = await stripe.customers.listCards(customerID, cardParams || {});
      return response.json({
        message: 'List of Cards.',
        statusCode: 200,
        data: listAllCards,
      });
    }
    throw new Error('Make sure to use `POST` request method for listing all cards.', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
