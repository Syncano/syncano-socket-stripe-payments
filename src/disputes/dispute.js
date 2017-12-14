import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { disputeID, disputeParameter } = ctx.args;

  try {
    if (requestMethod === 'GET') {
      const retrieveDispute = await stripe.disputes.retrieve(disputeID);
      return response.json({
        message: 'Dispute retrieved successfully',
        statusCode: 200,
        data: retrieveDispute,
      });
    } else if (requestMethod === 'PUT') {
      const updateDispute = await stripe.disputes.update(disputesID, disputeParameter);
      return response.json({
        message: 'Dispute updated successfully',
        statusCode: 200,
        data: updateDispute,
      });
    }
    throw new Error(
      'Make sure to use `GET` and `PUT` request method for ' +
        'retrieving and updating disputes respectively.',
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
