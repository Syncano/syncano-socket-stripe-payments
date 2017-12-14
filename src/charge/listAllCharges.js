import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);

  try {
    if (ctx.meta.request.REQUEST_METHOD === 'POST') {
      const listStripeCharges = await stripe.charges.list(ctx.args.listChargesParameter || {});
      return response.json({
        message: 'List of Charges',
        statusCode: 200,
        data: listStripeCharges,
      });
    }
    throw new Error('Make sure to use `POST` request method for listing all charges', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
