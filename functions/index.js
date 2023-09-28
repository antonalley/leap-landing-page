const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.secret_key);


const stripeTest = require('stripe')(functions.config().stripe.testing_secret_key)

exports.payForBeta = functions.https.onCall(async (data, context) => {
  try {
    // Extract id and amount from the data argument
    var { user_id, redirect_address, testing } = data;

    if (!redirect_address) {
      redirect_address = "https://service-leap-prod.web.app"
    }
    let useStripe;
    if (testing){
      useStripe = stripeTest;
    } else {
      useStripe = stripe
    }

    console.log('Starting payment for user: ', user_id)

    // Create a Stripe charge
    const charge = await useStripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        success_url: `${redirect_address}?paymentsuccess=true&user_id=${user_id}`,
        cancel_url: `${redirect_address}?paymentsuccess=false&user_id=${user_id}`,
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

    console.log('Charge completed with id', charge.id)

    // You can add code here to update user data or perform other actions after successful payment

    return { message: 'Success', url: charge.url };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Payment failed.');
  }
});

exports.CreateConnectAccount = functions.https.onCall(async (data, context) => {
  // TODO: not tested yet
  try {

    var { user_email, redirect_address, testing } = data;

    if (!redirect_address) {
      redirect_address = "https://service-leap-prod.web.app"
    }

    let useStripe;
    if (testing){
      useStripe = stripeTest;
    } else {
      useStripe = stripe
    }

    // Create Account
    const account = await useStripe.accounts.create({
      type: "standard",
      email: user_email,
      // capabilities: {
      //   card_payments: {requested: true},
      //   transfers: {requested: true},
      // }
    })

    // Get Onboarding link
    const accountLink = await useStripe.accountLinks.create({
      account: account.id,
      refresh_url: `${redirect_address}/account/settings?stripe_created=false`,
      return_url: `${redirect_address}/account/settings?stripe_created=true`,
      type: 'account_onboarding',
    })

    return { message: 'success', url: accountLink.url, connect_account_id: account.id}

  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Account Create Failed');

  }
})

exports.GetAccountSetupLink = functions.https.onCall(async (data, context) => {
  try {
    var {acct_id, redirect_address, testing} = data;

    if (!redirect_address) {
      redirect_address = "https://service-leap-prod.web.app"
    }

    let useStripe;
    if (testing){
      useStripe = stripeTest;
    } else {
      useStripe = stripe
    }

    const accountLink = await useStripe.accountLinks.create({
      account: acct_id,
      refresh_url: `${redirect_address}/account/settings?stripe_created=false`,
      return_url: `${redirect_address}/account/settings?stripe_created=true`,
      type: 'account_onboarding',
    })

    return { success: true, url: accountLink.url }

  } catch(error){
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Failed to Create Link');
  }
})

exports.ChargeClient = functions.https.onCall(async (data, context) => {

  try {
    // TODO

  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Charge Failed');
  }

})


exports.GetStripeAccount = functions.https.onCall(async (data, context) => {
  try{
    const { acct_id, testing } = data;

    let useStripe;
    if (testing){
      useStripe = stripeTest;
    } else {
      useStripe = stripe
    }

    const account = await useStripe.accounts.retrieve(acct_id);

    return { success: true, account: account }

  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'Failed to get account');
  }
})

