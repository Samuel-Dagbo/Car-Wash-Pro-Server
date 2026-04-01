const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");

const registerAdmin = async (data) =>{
    const email = data.email?.toLowerCase().trim();
    const name = data.name?.trim() || `${data.firstName || ""} ${data.lastName || ""}`.trim();
    const contact = data.contact?.trim() || data.phoneNumber?.trim();

    const existingAdmin = await User.findOne({ email });

    if(existingAdmin){
        throw new AppError("User already exists", 409)
    }

    const admin = await User.create({
        name,
        email,
        contact,
        password: data.password,
        role: data.role || "admin"
    });
    return admin;
};

const registerCustomer = async (data) => {
    const email = data.email?.toLowerCase().trim();
    const name = data.name?.trim();
    const contact = data.contact?.trim();

    if (!name || !email || !contact || !data.password) {
        throw new AppError("Name, email, contact and password are required", 400);
    }

    const existingCustomer = await User.findOne({ email });

    if (existingCustomer) {
        throw new AppError("User already exists", 409);
    }

    const customer = await User.create({
        name,
        email,
        contact,
        password: data.password,
        role: "customer"
    });

    return customer;
};

const loginAdmin = async(data)=>{
    if (!data?.email || !data?.password) {
        throw new AppError("Email and password are required", 400);
    }

    const admin = await User.findOne({ email: data.email?.toLowerCase().trim(), role: "admin" });

    if(!admin){
        throw new AppError("User does not have an account", 404)
    }

    const isMatch = await admin.matchPassword(data.password);
    if(!isMatch){
        throw new AppError("Invalid credentials", 401)
    }

    // update last login time
    await updateLastLogin(admin._id);

    const token = generateToken(admin);

    admin.password = undefined;

    return{
        token,
        admin
    };
};

const loginCustomer = async (data) => {
    if (!data?.email || !data?.password) {
        throw new AppError("Email and password are required", 400);
    }

    const customer = await User.findOne({ email: data.email?.toLowerCase().trim(), role: "customer" });

    if (!customer) {
        throw new AppError("User does not have an account", 404);
    }

    const isMatch = await customer.matchPassword(data.password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken(customer);

    customer.password = undefined;

    return {
        token,
        customer
    };
};

const updateLastLogin = async (adminId) => {
    const admin = await User.findByIdAndUpdate(
        adminId,
        { lastLogin: new Date() },
        { new: true }
    );

    return admin;
};


module.exports ={
    registerAdmin,
    loginAdmin,
    registerCustomer,
    loginCustomer
}