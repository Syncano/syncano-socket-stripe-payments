import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { customerID, ...bankAcctParams } = args;

  try {
    checkRequestType(requestMethod, ['GET'], 'listing all bank accounts');
    const listBankAccts = await stripe.customers.listSources(customerID, bankAcctParams || {});
    return response.json({ message: 'List of Bank Accounts.', statusCode: 200, data: listBankAccts });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
