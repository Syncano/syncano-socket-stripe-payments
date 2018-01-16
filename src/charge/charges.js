import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { chargeParameter, chargeID } = ctx.args;
  const actions = 'creating, retrieving and updating charges respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === 'POST') {
      const createStripeCharge = await stripe.charges.create(chargeParameter);
      return response.json({
        message: 'Charge created',
        statusCode: 200,
        data: createStripeCharge
      });
    } else if (requestMethod === 'GET') {
      const retrieveStripeCharge = await stripe.charges.retrieve(chargeID);
      return response.json({
        message: 'Charge Retrieved',
        statusCode: 200,
        data: retrieveStripeCharge
      });
    } else if (requestMethod === 'PUT') {
      const updateStripeCharge = await stripe.charges.update(chargeID, chargeParameter || {});
      return response.json({
        message: 'Charge Updated',
        statusCode: 200,
        data: updateStripeCharge
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
