import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const { chargeParameter, chargeID } = ctx.args;

  try {
    if (ctx.meta.request.REQUEST_METHOD === 'POST') {
      const createStripeCharge = await stripe.charges.create(chargeParameter);
      return response.json({
        message: 'Charge created',
        statusCode: 200,
        data: createStripeCharge,
      });
    } else if (ctx.meta.request.REQUEST_METHOD === 'GET') {
      const retrieveStripeCharge = await stripe.charges.retrieve(chargeID);
      return response.json({
        message: 'Charge Retrieved',
        statusCode: 200,
        data: retrieveStripeCharge,
      });
    } else if (ctx.meta.request.REQUEST_METHOD === 'PUT') {
      const updateStripeCharge = await stripe.charges.update(chargeID, chargeParameter || {});
      return response.json({
        message: 'Charge Updated',
        statusCode: 200,
        data: updateStripeCharge,
      });
    }
    throw new Error(
      'Make sure to use `POST`, `GET` and `PUT` request method for creating, ' +
        'retrieving and updating charges respectively.',
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
