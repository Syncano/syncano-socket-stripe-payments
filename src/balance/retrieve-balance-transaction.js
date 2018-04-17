import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;

  try {
    checkRequestType(requestMethod, ['GET'], 'retrieving balance transaction');
    const retrieveBalanceTransaction = await stripe.balance.retrieveTransaction(args.transID);
    return response.json({ message: 'Balance transaction report.', statusCode: 200, data: retrieveBalanceTransaction });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
