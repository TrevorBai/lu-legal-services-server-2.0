const User = require('../models/user');
const {
  sendWelcomeEmail,
  sendCancelationAccountEmail,
  sendPasswordResetEmail,
} = require('../emails/account');

const registerUser = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.username); // don't await here, let it be asynchronized
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    let token = null;
    if (req.body.expiration) {
      const expiration = '48'; // hours
      token = await user.generateAuthToken(expiration);
    } else {
      token = await user.generateAuthToken();
    }

    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) throw new Error('Unable to find your account');

    const passwordGenerator = Math.random().toString(36).slice(2);
    user.password = passwordGenerator;
    user.confirmedPassword = user.password;
    await user.save();
    sendPasswordResetEmail(user.email, user.username, passwordGenerator);

    res.send({ user });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

const logoutUserOnAllDevices = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

const readLoggedInUser = async (req, res) => {
  res.send(req.user);
};

const readNonLoggedInUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
};

const updateUserProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'username', 'email'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates!' });
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.oldPassword,
      (login = false)
    );
    user.password = req.body.newPassword;
    user.confirmedPassword = req.body.confirmedNewPassword;
    await user.save();

    res.send({ user });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationAccountEmail(req.user.email, req.user.username);
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  resetUserPassword,
  logoutUser,
  logoutUserOnAllDevices,
  readLoggedInUser,
  readNonLoggedInUserById,
  updateUserProfile,
  updateUserPassword,
  deleteUser
};
