import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { customerID, bankAcctParams = {}, bankAcctID } = args;
  const actions = 'creating, retrieving, updating & deleting bank account respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT', 'DELETE'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'POST') {
      const createBankAcct = await stripe.customers.createSource(customerID, bankAcctParams);
      return response.json({ message: 'Bank account created', statusCode: 200, data: createBankAcct });
    }
    else if (requestMethod === 'GET') {
      const retrieveBankAcct = await stripe.customers.retrieveSource(customerID, bankAcctID);
      return response.json({ message: 'Bank Account Retrieved', statusCode: 200, data: retrieveBankAcct });
    }
    else if (requestMethod === 'PUT') {
      const updateBankAccount = await stripe.customers.updateSource(customerID, bankAcctID, bankAcctParams);
      return response.json({ message: 'Bank Account Updated', statusCode: 200, data: updateBankAccount });
    }
    else if (requestMethod === 'DELETE') {
      const deleteBankAccount = await stripe.customers.deleteSource(customerID, bankAcctID);
      return response.json({ message: 'Bank Account Deleted', statusCode: 200, data: deleteBankAccount });
    }
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
