const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  // console.log(req.method, req.path);
  try {
    let token = null;
    // console.log('req :', req.method);
    if (req.method === 'GET') {
      token = req.header('Authorization').replace('Bearer ', '');
    } else if (req.method === 'PATCH') {
      token = req.headers.authorization;
    } else {
      token = req.body.headers.Authorization;
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    // check both the _id and the token itself as a double security check.
    // If a user logout, he should not read his user info/profile. One user could
    // have his account opened at multiple devices with multiple tokens. If we only
    // check findOne by _id, user can still fetch his profile even after loging out.
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    // res.status(401).send({ error: 'Please authenticate.' });
    res.status(401).send({ error: e });
  }
};

module.exports = auth;
