import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { tokenParams, customerID, tokenID } = ctx.args;
  const actions = 'creating and retrieving tokens respectively';
  const expectedMethodTypes = ['POST', 'GET'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const createToken = await stripe.tokens.create(tokenParams || {});
      return response.json({
        message: 'Token created successfully',
        statusCode: 200,
        data: createToken
      });
    } else if (requestMethod === expectedMethodTypes[1]) {
      const retrieveTokens = await stripe.tokens.retrieve(tokenID);
      return response.json({
        message: 'Token retrieved successfully',
        statusCode: 200,
        data: retrieveTokens
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
