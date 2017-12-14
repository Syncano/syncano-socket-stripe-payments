import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const { chargeID, captureChargeParameter } = ctx.args;

  try {
    if (ctx.meta.request.REQUEST_METHOD === 'POST') {
      const captureStripeCharge = await stripe.charges.capture(
        chargeID,
        captureChargeParameter || {},
      );
      return response.json({
        message: 'Charge Captured',
        statusCode: 200,
        data: captureStripeCharge,
      });
    } throw new Error('Make sure to use `POST` request method for capturing charge', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
