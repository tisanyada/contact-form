const router = require('express').Router();
const userController = require('../controllers/user');
const { isAUTH } = require('../middlewares/isAuth');

router.get('/', userController.getIndex);
router.post('/', userController.login);
router.get('/register', userController.getRegister);
router.post('/register', userController.createUser);

router.get('/dashboard', isAUTH, userController.getDashboard);

router.post('/contact', isAUTH, userController.sendMail);

module.exports = router;