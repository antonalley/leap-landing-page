const functions = require('firebase-functions');
// const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

// admin.initializeApp();

exports.payForBeta = functions.https.onCall(async (data, context) => {
  try {
    // Extract id and amount from the data argument
    const { user_id } = data;

    console.log('Starting payment for user: ', user_id)

    // Create a Stripe charge
    const charge = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        success_url: `http://localhost:3000/?paymentsuccess=true&user_id=${user_id}`,
        cancel_url: `http://localhost:3000/?paymentsuccess=false&user_id=${user_id}`,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    unit_amount: 5 * 100, // the cents
                    product_data: {
                        name: 'Service Leap Early Adopter Community'
                    }
                }
            }
        ]
    });

    console.log('Chare completed wiht id', charge.id)

    // You can add code here to update user data or perform other actions after successful payment

    return { message: 'Success', url: charge.url };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Payment failed.');
  }
});
