import Syncano from 'syncano-server';
import stripePackage from 'stripe';
import checkRequestType from '../utility/checkRequestType';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;
  const { customerID, cardParams, cardID } = ctx.args;
  const actions = 'creating, retrieving, updating and deleting cards respectively';
  const expectedMethodTypes = ['POST', 'GET', 'PUT', 'DELETE'];

  try {
    checkRequestType(requestMethod, expectedMethodTypes, actions);
    if (requestMethod === expectedMethodTypes[0]) {
      const createCard = await stripe.customers.createSource(customerID, cardParams);
      return response.json({
        message: 'Card created.',
        statusCode: 200,
        data: createCard
      });
    } else if (requestMethod === expectedMethodTypes[1]) {
      const retrieveCard = await stripe.customers.retrieveCard(customerID, cardID);
      return response.json({
        message: 'Card Retrieved',
        statusCode: 200,
        data: retrieveCard
      });
    } else if (requestMethod === expectedMethodTypes[2]) {
      const updateCard = await stripe.customers.updateCard(customerID, cardID, cardParams);
      return response.json({
        message: 'Card Updated',
        statusCode: 200,
        data: updateCard
      });
    } else if (requestMethod === expectedMethodTypes[3]) {
      const deleteCard = await stripe.customers.deleteCard(customerID, cardID);
      return response.json({
        message: 'Card Deleted',
        statusCode: 200,
        data: deleteCard
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
