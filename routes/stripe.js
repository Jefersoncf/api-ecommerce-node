const router = require('express').Router();
const stripe = require('stripe');

const connect = process.env.STRIPE_KEY;

router.post('payment', (req, res) => {
  connect.charges.create({
    source: req.body.tokenId,
    amount: req.body.amount,
    currency: 'br',
  }, (stripeErr, stripeResponse) => {
    if(stripeErr){
      res.status(500).json(stripeErr);
    }else {
      res.status(200).json(stripeResponse);
    }
  });
});

module.exports = router;