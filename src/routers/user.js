const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');

const {
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
} = require('../controllers/user');

// *********************************************************
//   Operations which don't need to be authenticated first
// *********************************************************
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/passwordReset', resetUserPassword);

// *********************************************************
//     Operations which need to be authenticated first
// *********************************************************
router.post('/logout', auth, logoutUser);
router.post('/logoutAll', auth, logoutUserOnAllDevices);
router.get('/me', auth, readLoggedInUser);
router.get('/:id', auth, readNonLoggedInUserById); // Admin privilege
router.patch('/me', auth, updateUserProfile);
router.patch('/me/updatePassword', auth, updateUserPassword);
router.delete('/me', auth, deleteUser);

module.exports = router;
