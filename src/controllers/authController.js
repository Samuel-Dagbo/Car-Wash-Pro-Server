const asyncHandler = require("../utils/asyncHandler");
const {
    registerAdmin,
    loginAdmin,
    registerCustomer,
    loginCustomer
} = require("../services/authService");

const registerAdminHandler = asyncHandler(async (req, res) => {
    const admin = await registerAdmin(req.body);
    res.status(201).json({ success: true, data: admin });
});

const loginAdminHandler = asyncHandler(async (req, res) => {
    const admin = await loginAdmin(req.body);
    res.status(200).json({ success: true, data: admin });
});

const getCurrentAdminHandler = asyncHandler(async (req, res) => {
    const admin = req.admin || req.user;
    res.status(200).json({ success: true, data: admin });
});

const logoutAdminHandler = asyncHandler(async (req, res) => {
    // For JWT, logout is handled on the client by deleting the token.
    // Optionally, you can implement token blacklisting here.
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

const registerCustomerHandler = asyncHandler(async (req, res) => {
    const customer = await registerCustomer(req.body);
    res.status(201).json({ success: true, data: customer });
});

const loginCustomerHandler = asyncHandler(async (req, res) => {
    const customer = await loginCustomer(req.body);
    res.status(200).json({ success: true, data: customer });
});

const getCurrentCustomerHandler = asyncHandler(async (req, res) => {
    const customer = req.customer || req.user;
    res.status(200).json({ success: true, data: customer });
});

const logoutCustomerHandler = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = {
    registerAdminHandler,
    loginAdminHandler,
    getCurrentAdminHandler,
    logoutAdminHandler,
    registerCustomerHandler,
    loginCustomerHandler,
    getCurrentCustomerHandler,
    logoutCustomerHandler
}