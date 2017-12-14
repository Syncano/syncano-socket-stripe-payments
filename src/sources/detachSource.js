import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const { customerID, sourceID } = ctx.args;

  try {
    if (ctx.meta.request.REQUEST_METHOD === 'DELETE') {
      const detachSource = await stripe.customers.deleteSource(customerID, sourceID);
      return response.json({
        message: 'Source Detached.',
        statusCode: 200,
        data: detachSource,
      });
    }
    throw new Error('Make sure to use `DELETE` request method for detaching source.', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
