import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, sourceParameter } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const attachSource = await stripe.customers.createSource(customerID, sourceParameter);
      return response.json({
        message: 'Source Attached.',
        statusCode: 200,
        data: attachSource,
      });
    }
    throw new Error('Make sure to use `POST` request method for retrieving balance.', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
