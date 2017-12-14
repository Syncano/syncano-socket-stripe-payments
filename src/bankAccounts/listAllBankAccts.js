import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, bankAcctParams } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const listBankAccts = await stripe.customers.listSources(customerID, bankAcctParams || {});
      return response.json({
        message: 'List of Bank Accounts.',
        statusCode: 200,
        data: listBankAccts,
      });
    }
    throw new Error('Make sure to use `POST` request method for listing all bank accounts', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
