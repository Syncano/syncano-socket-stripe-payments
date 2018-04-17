import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { chargeID, captureChargeParameter = {} } = args;

  try {
    checkRequestType(requestMethod, ['POST'], 'capturing charge');

    const captureStripeCharge = await stripe.charges.capture(chargeID, captureChargeParameter);
    return response.json({ message: 'Charge Captured', statusCode: 200, data: captureStripeCharge });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
