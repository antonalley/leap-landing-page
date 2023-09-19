# Firebase Functions

## To set test api key: 
`firebase functions:config:set stripe.secret_key=sk_test_51NpIzVLKgquOPe9egtqxZ8NVorGnqPDL5t8ZEi3SbNpTvIl1IpKb5Eaow2JFoSWDmXMhb0GJjT73EN9bvSHwS8ns009fPcFtzF`

## to set official api key:
same thing, but replace api key with actual api key

## Test see variables:
firebase functions:config:get


## To set functions every time you update them: 
firebase deploy --only functions