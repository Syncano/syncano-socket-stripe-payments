import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { customerID, sourceID } = args;

  try {
    checkRequestType(requestMethod, ['DELETE'], 'detaching source');

    const detachSource = await stripe.customers.deleteSource(customerID, sourceID);
    return response.json({ message: 'Source Detached.', statusCode: 200, data: detachSource });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
