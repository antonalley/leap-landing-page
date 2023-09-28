# Firebase Functions

## To set API KEY: 
`firebase functions:config:set stripe.secret_key=sk_test_***`
### Testing mode:
`firebase functions:config:set stripe.testing_secret_key=`

## to set official api key:
same thing, but replace api key with actual api key

## Test see variables:
firebase functions:config:get


## To set functions every time you update them: 
firebase deploy --only functions


## Troubleshoot
I often get errors trying to deploy. Not sure which one of these helps, but I made sure i cd'd into the functions directory. And I made sure all the web apps were down that would be calling that function