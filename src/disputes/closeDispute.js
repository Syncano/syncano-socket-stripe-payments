import Syncano from 'syncano-server';
import stripePackage from 'stripe';

export default async (ctx) => {
  const { response, logger } = Syncano(ctx);

  const log = logger('Socket scope');
  const stripe = stripePackage(ctx.config.STRIPE_SECRET_KEY);

  try {
    const closeDispute = await stripe.disputes.close(ctx.args.disputeID);
    return response.json({
      message: 'Dispute closed.',
      statusCode: 200,
      data: closeDispute,
    });
  } catch (err) {
    response.json({
      type: err.type,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};
