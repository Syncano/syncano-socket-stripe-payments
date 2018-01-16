import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, ...cardParams } = ctx.args;
  const actions = 'listing all cards';
  const expectedMethodTypes = ['GET'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === 'GET') {
      const listAllCards = await stripe.customers.listCards(customerID, cardParams || {});
      return response.json({
        message: 'List of Cards.',
        statusCode: 200,
        data: listAllCards
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
