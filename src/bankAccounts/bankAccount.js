import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, bankAcctParams, bankAcctID } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const createBankAcct = await stripe.customers.createSource(customerID, bankAcctParams || {});
      return response.json({
        message: 'Bank account created',
        statusCode: 200,
        data: createBankAcct,
      });
    } else if (requestMethod === 'GET') {
      const retrieveBankAcct = await stripe.customers.retrieveSource(customerID, bankAcctID);
      return response.json({
        message: 'Bank Account Retrieved',
        statusCode: 200,
        data: retrieveBankAcct,
      });
    } else if (requestMethod === 'PUT') {
      const updateBankAccount = await stripe.customers.updateCard(
        customerID,
        bankAcctID,
        bankAcctParams || {},
      );
      return response.json({
        message: 'Bank Account Updated',
        statusCode: 200,
        data: updateBankAccount,
      });
    } else if (requestMethod === 'DELETE') {
      const deleteBankAccount = await stripe.customers.deleteSource(customerID, bankAcctID);
      return response.json({
        message: 'Bank Account Deleted',
        statusCode: 200,
        data: deleteBankAccount,
      });
    }
    throw new Error(
      'Make sure to use `POST`, `GET`, `PUT` & `DELETE` request method for creating, ' +
        'retrieving, updating & deleting bank account respectively.',
      400,
    );
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
