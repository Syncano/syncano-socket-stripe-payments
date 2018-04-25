import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { sourceParameter = {}, sourceID, clientSecret } = args;
  const actions = 'creating, retrieving and updating sources respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'POST') {
      const createSource = await stripe.sources.create(sourceParameter);
      return response.json({ message: 'Source created', statusCode: 200, data: createSource });
    }
    else if (requestMethod === 'GET') {
      const params = { };
      if (clientSecret) {
        params.client_secret = clientSecret;
      }
      const retrieveSource = await stripe.sources.retrieve(sourceID, params);
      return response.json({ message: 'Source Retrieved', statusCode: 200, data: retrieveSource });
    }
    else if (requestMethod === 'PUT') {
      const updateSource = await stripe.sources.update(sourceID, sourceParameter || {});
      return response.json({ message: 'Source Updated', statusCode: 200, data: updateSource });
    }
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
