import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { disputeID, disputeParameter } = args;
  const actions = 'retrieving and updating disputes';
  const expectedMethodTypes = ['GET', 'PUT'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'GET') {
      const retrieveDispute = await stripe.disputes.retrieve(disputeID);
      return response.json({ message: 'Dispute retrieved successfully', statusCode: 200, data: retrieveDispute });
    }
    else if (requestMethod === 'PUT') {
      const updateDispute = await stripe.disputes.update(disputesID, disputeParameter);
      return response.json({ message: 'Dispute updated successfully', statusCode: 200, data: updateDispute });
    }
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
