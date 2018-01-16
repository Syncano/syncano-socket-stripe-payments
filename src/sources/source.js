import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { sourceParameter, sourceID, clientSecret } = ctx.args;
  const actions = 'creating, retrieving and updating sources respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const createSource = await stripe.sources.create(sourceParameter);
      return response.json({
        message: 'Source created',
        statusCode: 200,
        data: createSource
      });
    } else if (requestMethod === expectedMethodTypes[1]) {
      const retrieveSource = await stripe.sources.retrieve(
        sourceID,
        { client_secret: clientSecret } || {}
      );
      return response.json({
        message: 'Source Retrieved',
        statusCode: 200,
        data: retrieveSource
      });
    } else if (requestMethod === expectedMethodTypes[2]) {
      const updateSource = await stripe.sources.update(sourceID, sourceParameter || {});
      return response.json({
        message: 'Source Updated',
        statusCode: 200,
        data: updateSource
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
