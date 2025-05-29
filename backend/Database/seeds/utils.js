const bcrypt = require('bcrypt');

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the string to generate
 * @returns {string} - Random string
 */
function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random email address
 * @returns {string} - Random email address
 */
function randomEmail() {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'test.com'];
  const username = randomString(8).toLowerCase();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

/**
 * Generate a random password
 * @returns {string} - Random password
 */
function randomPassword() {
  return randomString(12);
}

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Generate a random phone number
 * @returns {string} - Random phone number
 */
function randomPhone() {
  return `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
}

/**
 * Generate a random floating point number within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} decimals - Number of decimal places
 * @returns {number} - Random float
 */
function randomFloat(min = 0, max = 1000, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

/**
 * Generate a random name
 * @returns {string} - Random name
 */
function randomName() {
  const firstNames = ['John', 'Jane', 'Alex', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Olivia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Taylor'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

/**
 * Generate a random date within a range
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {Date} - Random date
 */
function randomDate(start = new Date(2020, 0, 1), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

module.exports = {
  randomString,
  randomEmail,
  randomPassword,
  hashPassword,
  randomPhone,
  randomFloat,
  randomName,
  randomDate
};
