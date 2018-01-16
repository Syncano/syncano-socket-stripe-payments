import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { disputeID, disputeParameter } = ctx.args;
  const actions = 'retrieving and updating disputes';
  const expectedMethodTypes = ['GET', 'PUT'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === 'GET') {
      const retrieveDispute = await stripe.disputes.retrieve(disputeID);
      return response.json({
        message: 'Dispute retrieved successfully',
        statusCode: 200,
        data: retrieveDispute
      });
    } else if (requestMethod === 'PUT') {
      const updateDispute = await stripe.disputes.update(disputesID, disputeParameter);
      return response.json({
        message: 'Dispute updated successfully',
        statusCode: 200,
        data: updateDispute
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
