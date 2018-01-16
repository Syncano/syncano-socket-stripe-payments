import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, bankAcctParams, bankAcctID } = ctx.args;
  const actions = 'creating, retrieving, updating & deleting bank account respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT', 'DELETE'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === 'POST') {
      const createBankAcct = await stripe.customers.createSource(customerID, bankAcctParams || {});
      return response.json({
        message: 'Bank account created',
        statusCode: 200,
        data: createBankAcct
      });
    } else if (requestMethod === 'GET') {
      const retrieveBankAcct = await stripe.customers.retrieveSource(customerID, bankAcctID);
      return response.json({
        message: 'Bank Account Retrieved',
        statusCode: 200,
        data: retrieveBankAcct
      });
    } else if (requestMethod === 'PUT') {
      const updateBankAccount = await stripe.customers.updateSource(
        customerID,
        bankAcctID,
        bankAcctParams || {}
      );
      return response.json({
        message: 'Bank Account Updated',
        statusCode: 200,
        data: updateBankAccount
      });
    } else if (requestMethod === 'DELETE') {
      const deleteBankAccount = await stripe.customers.deleteSource(customerID, bankAcctID);
      return response.json({
        message: 'Bank Account Deleted',
        statusCode: 200,
        data: deleteBankAccount
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
