import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { customerID, bankAcctID, bankAcctParams = {} } = args;

  try {
    checkRequestType(requestMethod, ['POST'], 'verifying bank accounts');
    const verifyBankAcct = await stripe.customers.verifySource(customerID, bankAcctID, bankAcctParams);
    return response.json({ message: 'Bank Account Retrieved.', statusCode: 200, data: verifyBankAcct });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
