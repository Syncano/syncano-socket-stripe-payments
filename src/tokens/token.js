import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { tokenParams, customerID, tokenID } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const createToken = await stripe.tokens.create(tokenParams || {});
      return response.json({
        message: 'Token created successfully',
        statusCode: 200,
        data: createToken,
      });
    } else if (requestMethod === 'GET') {
      const retrieveTokens = await stripe.tokens.retrieve(tokenID);
      return response.json({
        message: 'Token retrieved successfully',
        statusCode: 200,
        data: retrieveTokens,
      });
    }
    throw new Error(
      'Make sure to use `POST` and `GET` request method for ' +
        'creating and retrieving tokens respectively.',
      400,
    );
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
