import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, bankAcctID, bankAcctParams } = ctx.args;
  const actions = 'verifying bank accounts';
  const expectedMethodTypes = ['POST'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === 'POST') {
      const verifyBankAcct = await stripe.customers.verifySource(
        customerID,
        bankAcctID,
        bankAcctParams || {}
      );
      return response.json({
        message: 'Bank Account Retrieved.',
        statusCode: 200,
        data: verifyBankAcct
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
