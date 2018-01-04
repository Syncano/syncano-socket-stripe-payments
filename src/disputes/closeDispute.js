import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);

  try {
    const closeDispute = await stripe.disputes.close(ctx.args.disputeID);
    return response.json({
      message: 'Dispute closed.',
      statusCode: 200,
      data: closeDispute
    });
  } catch ({ type, message, statusCode }) {
    response.json({
      type,
      message,
      statusCode
    });
  }
};
