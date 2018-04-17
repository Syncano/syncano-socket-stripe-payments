import Syncano from '@syncano/core';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const { config, args } = ctx;
  const stripe = stripePackage(config.STRIPE_SECRET_KEY);

  try {
    const closeDispute = await stripe.disputes.close(args.disputeID);
    return response.json({ message: 'Dispute closed.', statusCode: 200, data: closeDispute });
  } catch ({ type, message, statusCode = 400 }) {
    return response.json({ type, message, statusCode }, statusCode);
  }
};
