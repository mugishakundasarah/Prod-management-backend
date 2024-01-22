const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { authValidationSchema } = require('../utils/validation');

// Sign up route
router.post('/signup', async (req, res) => {
  try {
    let {error, value} = authValidationSchema.validate(req.body)

    if(error) {
      return res.json({message: error.details[0].message, status: 404})
    }

    let email = value.email 
    console.log(email)
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(value.password, 10);

    const newUser = await User.create({ email, password: hashedPassword });

    return res.status(201).json({ message: 'User created successfully', user: newUser , status: 200});
  } catch (error) {
    console.error('Error signing up:', error);
    return res.status(500).json({ message: 'Internal server error'});
  }
});

router.get('/users',async (req, res) => {
  try {
    let users = await User.find()
    return res.status(200).json(users);
  } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ message: 'Internal server error' }); 
  }
})

// Sign in route
router.post('/signin', async (req, res) => {
  try {
    let {error,value} = authValidationSchema.validate(req.body)

    if(error) {
      return res.json({message: error.details[0].message, status: 404})
    }


    let email = value.email
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ message: 'Invalid username or password' , status: 401});
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: 'Invalid username or password', status: 401});
    }


    // Generate and sign a JWT token
    const token = jwt.sign({ user_id: user.dataValues.id } , process.env.JWT_SECRET_KEY, { expiresIn: '2d'});

    let LoggedInUser = {
      email: user.email,
    }

    return res.status(200).json({ token, user: LoggedInUser, status: 200 });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;