import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const actions = 'listing all balance';
  const expectedMethodTypes = ['GET'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const balanceParams = ctx.args.params || {};
      const listBalanceTransaction = await stripe.balance.listTransactions(balanceParams);
      return response.json({
        message: 'List of Balance.',
        statusCode: 200,
        data: listBalanceTransaction
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
