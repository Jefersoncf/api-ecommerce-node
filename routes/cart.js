const router = require('express').Router();
const Cart = require('../models/Cart');

const {verifyToken, verifytokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');

//CREATE
  router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } catch (error) {
      res.status(500).json(error);
    }
  })


//UPDATE
router.put('/:id', verifytokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    );
    return res.status(200).json(updatedCart);

  } catch (err) {
   res.status(500).json(err);
  }
});

//DELETE 
router.delete('/:id', verifytokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json('Cart has been deleted successfully!');
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER CART
router.get('/find/:userId', verifytokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.userId});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL 
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;