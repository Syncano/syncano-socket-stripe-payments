import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const actions = 'retrieving balance transaction';
  const expectedMethodTypes = ['GET'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === 'GET') {
      const retrieveBalanceTransaction = await stripe.balance.retrieveTransaction(ctx.args.transID);
      return response.json(
        {
          message: 'Balance transaction report.',
          statusCode: 200,
          data: retrieveBalanceTransaction
        },
        200
      );
    }
  } catch ({ type, message, statusCode }) {
    response.json({
      type,
      message,
      statusCode
    });
  }
};
