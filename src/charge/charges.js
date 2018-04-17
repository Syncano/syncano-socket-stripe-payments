import Syncano from '@syncano/core';
import stripePackage from 'stripe';
import checkRequestType from '../util/check-request-type';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, meta, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);
  const requestMethod = meta.request.REQUEST_METHOD;
  const { chargeParameter, chargeID } = args;
  const actions = 'creating, retrieving and updating charges respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);

    if (requestMethod === 'POST') {
      const createStripeCharge = await stripe.charges.create(chargeParameter);
      return response.json({ message: 'Charge created', statusCode: 200, data: createStripeCharge });
    }
    else if (requestMethod === 'GET') {
      const retrieveStripeCharge = await stripe.charges.retrieve(chargeID);
      return response.json({ message: 'Charge Retrieved', statusCode: 200, data: retrieveStripeCharge });
    }
    else if (requestMethod === 'PUT') {
      const updateStripeCharge = await stripe.charges.update(chargeID, chargeParameter || {});
      return response.json({ message: 'Charge Updated', statusCode: 200, data: updateStripeCharge });
    }
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
