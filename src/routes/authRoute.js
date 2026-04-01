const express = require("express");
const {
    registerAdminHandler,
    loginAdminHandler,
    getCurrentAdminHandler,
    logoutAdminHandler,
    registerCustomerHandler,
    loginCustomerHandler,
    getCurrentCustomerHandler,
    logoutCustomerHandler 
} = require("../controllers/authController");
const {authLimiter,apiLimiter,createLimiter} = require("../middleware/rateLimiter");
const { protect,authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/admin/register', authLimiter, registerAdminHandler);
router.post('/admin/login', authLimiter, loginAdminHandler);
router.get('/admin/me', apiLimiter, protect, authorize('admin'), getCurrentAdminHandler);
router.post('/admin/logout', apiLimiter, protect, authorize('admin'), logoutAdminHandler);

router.post('/customer/register', authLimiter, registerCustomerHandler);
router.post('/customer/login', authLimiter, loginCustomerHandler);
router.get('/customer/me', apiLimiter, protect, authorize('customer'), getCurrentCustomerHandler);
router.post('/customer/logout', apiLimiter, protect, authorize('customer'), logoutCustomerHandler);



module.exports = router;
