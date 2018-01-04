import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { chargeID, captureChargeParameter } = ctx.args;
  const actions = 'capturing charge';
  const expectedMethodTypes = ['POST'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const captureStripeCharge = await stripe.charges.capture(
        chargeID,
        captureChargeParameter || {}
      );
      return response.json({
        message: 'Charge Captured',
        statusCode: 200,
        data: captureStripeCharge
      });
    }
  } catch ({ type, message, statusCode }) {
    response.json({
      type,
      message,
      statusCode
    });
  }
};
