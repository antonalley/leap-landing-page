const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(STRIPE_SECRET_KEY);

admin.initializeApp();

exports.payForBeta = functions.https.onCall(async (data, context) => {
  try {
    // Extract id and amount from the data argument
    const { id, amount } = data;

    // Create a Stripe charge
    const charge = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        success_url: "",
        cancel_url: "",
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    unit_amount: 5 * 100,
                    product_data: {
                        name: 'Service Leap Beta Access'
                    }
                }
            }
        ]
    });

    // You can add code here to update user data or perform other actions after successful payment

    return { message: 'Payment successful', chargeId: charge.id };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Payment failed.');
  }
});
