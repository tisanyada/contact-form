const router = require('express').Router();
const adminController = require('../controllers/admin');
const { isAdminAUTH } = require('../middlewares/isAuth');


router.get('/login', adminController.getIndex);
router.post('/login', adminController.login);
router.get('/register', adminController.getRegister);
router.post('/register', adminController.createAdmin);


router.get('/dashboard', isAdminAUTH, adminController.getDashboard);

module.exports = router;