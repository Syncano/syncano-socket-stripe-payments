import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { customerID, ...cardParams } = args;

  try {
    checkRequestType(requestMethod, ['GET'], 'listing all cards');
    const listAllCards = await stripe.customers.listCards(customerID, cardParams || {});
    return response.json({ message: 'List of Cards.', statusCode: 200, data: listAllCards });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
