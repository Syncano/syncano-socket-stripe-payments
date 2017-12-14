import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { sourceParameter, sourceID, clientSecret } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const createSource = await stripe.sources.create(sourceParameter);
      return response.json({
        message: 'Source created',
        statusCode: 200,
        data: createSource,
      });
    } else if (requestMethod === 'GET') {
      const retrieveSource = await stripe.sources.retrieve(
        sourceID,
        { client_secret: clientSecret } || {},
      );
      return response.json({
        message: 'Source Retrieved',
        statusCode: 200,
        data: retrieveSource,
      });
    } else if (requestMethod === 'PUT') {
      const updateSource = await stripe.sources.update(sourceID, sourceParameter || {});
      return response.json({
        message: 'Source Updated',
        statusCode: 200,
        data: updateSource,
      });
    }
    throw new Error(
      'Make sure to use `POST`, `GET` and `PUT` request method for creating, ' +
        'retrieving and updating sources respectively.',
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
