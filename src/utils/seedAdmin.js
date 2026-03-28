const bcrypt = require("bcryptjs");
const User = require("../models/User");

const defaultAdmin = {
  name: "admin",
  email: "admin@carwash.com",
  contact: "1234567890",
  password: "admin123",
  role: "admin",
};

async function seedAdminIfEmpty() {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists, skipping seed");
      return;
    }

    await User.create({
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      contact: defaultAdmin.contact,
      password: defaultAdmin.password, // ✅ correct
      role: defaultAdmin.role,
    });

    console.log("Seeded default admin user");
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
  }
}

module.exports = seedAdminIfEmpty;