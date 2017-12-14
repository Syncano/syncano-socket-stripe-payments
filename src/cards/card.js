import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);
  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, cardParams, cardID } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const createCard = await stripe.customers.createSource(customerID, cardParams);
      return response.json({
        message: 'Card created.',
        statusCode: 200,
        data: createCard,
      });
    } else if (requestMethod === 'GET') {
      const retrieveCard = await stripe.customers.retrieveCard(customerID, cardID);
      return response.json({
        message: 'Card Retrieved',
        statusCode: 200,
        data: retrieveCard,
      });
    } else if (requestMethod === 'PUT') {
      const updateCard = await stripe.customers.updateCard(customerID, cardID, cardParams);
      return response.json({
        message: 'Card Updated',
        statusCode: 200,
        data: updateCard,
      });
    } else if (requestMethod === 'DELETE') {
      const deleteCard = await stripe.customers.deleteCard(customerID, cardID);
      return response.json({
        message: 'Card Deleted',
        statusCode: 200,
        data: deleteCard,
      });
    }
    throw new Error(
      'Make sure to use `POST`, `GET`, `PUT` and `DELETE` request method for creating, ' +
        'retrieving, updating and deleting cards respectively.',
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
