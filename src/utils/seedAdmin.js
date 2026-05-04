const bcrypt = require("bcrypt");
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
    const existingDefaultAdmin = await User.findOne({
      role: "admin",
      email: defaultAdmin.email,
    });

    if (existingDefaultAdmin) {
      const storedPassword = existingDefaultAdmin.password;
      const hasValidStoredPassword =
        typeof storedPassword === "string" && storedPassword.trim().length > 0;

      const passwordMatches = hasValidStoredPassword
        ? await bcrypt.compare(defaultAdmin.password, storedPassword)
        : false;

      if (!passwordMatches) {
        existingDefaultAdmin.password = defaultAdmin.password;
        await existingDefaultAdmin.save();
        console.log("Default admin password repaired");
      } else {
        console.log("Admin user already exists, skipping seed");
      }

      return;
    }

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("An admin user already exists, skipping default admin seed");
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