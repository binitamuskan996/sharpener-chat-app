const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config(); 

const authenticate = (req, res, next) => {
  try {
const token = req.headers['authorization']?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    console.log('Decoded token:', decoded);
    
    User.findByPk(decoded.userId).then(user => {
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      req.user = user;
      next();
    }).catch(err => { 
      throw new Error(err);
    });
    
  } catch(err) {
    console.log('Auth error:', err.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
}

module.exports = { authenticate };