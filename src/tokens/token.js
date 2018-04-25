import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { tokenParams = {}, tokenID } = args;
  const actions = 'creating and retrieving tokens respectively';
  const expectedMethodTypes = ['POST', 'GET'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === 'POST') {
      const createToken = await stripe.tokens.create(tokenParams);
      return response.json({ message: 'Token created successfully', statusCode: 200, data: createToken });
    }
    else if (requestMethod === 'GET') {
      const retrieveTokens = await stripe.tokens.retrieve(tokenID);
      return response.json({ message: 'Token retrieved successfully', statusCode: 200, data: retrieveTokens });
    }
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
