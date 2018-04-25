import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { customerID, sourceParameter } = args;

  try {
    checkRequestType(requestMethod, ['POST'], 'attaching Source');

    const attachSource = await stripe.customers.createSource(customerID, sourceParameter);
    return response.json({ message: 'Source Attached.', statusCode: 200, data: attachSource });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
