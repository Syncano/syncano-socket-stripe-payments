import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, bankAcctID, bankAcctParams } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const verifyBankAcct = await stripe.customers.verifySource(
        customerID,
        bankAcctID,
        bankAcctParams || {},
      );
      return response.json({
        message: 'Bank Account Retrieved.',
        statusCode: 200,
        data: verifyBankAcct,
      });
    }
    throw new Error('Make sure to use `POST` request method for verifying bank accounts', 400);
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
