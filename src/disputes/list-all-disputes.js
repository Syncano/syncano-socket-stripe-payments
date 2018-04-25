import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;

  try {
    checkRequestType(requestMethod, ['GET'], 'listing all disputes');
    const listAllDispute = await stripe.disputes.list(ctx.args || {});
    return response.json({ message: 'List of Disputes.', statusCode: 200, data: listAllDispute });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
