const User = require('../models/User');
const router = require('express').Router();

const {verifyToken, verifytokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');

router.put('/:id', verifytokenAndAuthorization, async (req, res) => {
  if(req.body.password){
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
      ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    );
    return res.status(200).json(updatedUser);

  } catch (err) {
   res.status(500).json(err);
  }
});

//DELETE 
router.delete('/:id', verifytokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User deleted successfully!');
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER 
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER 
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new
  try {
    const users = query ? User.find().sort({_id: -1}).limit(5) : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATUS
router.get('/status', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: {$gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt '},
        },
      },
      {
        $group: {
          _id: '$month', 
          total: { $sum: 1},
        }
      }
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;