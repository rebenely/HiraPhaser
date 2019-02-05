let jwt = require('jsonwebtoken');
let config = require('./config');
module.exports  = {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.secret,
          { expiresIn: '12h' // expires in 12h
          }
        );
        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.status(403).send({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.status(400).send({
        success: false,
        message: 'Username and Password Required!'
      });
    }
  },
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
}
