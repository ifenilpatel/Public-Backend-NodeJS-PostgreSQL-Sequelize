const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Generate JWT token
const generateToken = (payload) => {
  const options = {
    expiresIn: "1d", // Token expires in 1 day
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

// Hash password
const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    console.error("Password hashing failed:", error.message);
    throw error;
  }
};

// Compare passwords
const comparePasswords = async (password, hashedPassword) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (error) {
    console.error("Password comparison failed:", error.message);
    throw error;
  }
};

// Encrypt string
const encodeString = (text) => {
  try {
    const algorithm = "aes-256-cbc"; // Use aes-256-cbc for better security
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32-byte key for aes-256-cbc
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`; // Return IV and encrypted text
  } catch (error) {
    console.error("Encryption failed:", error.message);
    return null;
  }
};

// Decrypt string
const decodeString = (text) => {
  try {
    const [ivHex, encryptedText] = text.split(":");
    const algorithm = "aes-256-cbc"; // Use aes-256-cbc for better security
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32-byte key for aes-256-cbc
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePasswords,
  encodeString,
  decodeString,
};
