// validators.js

// ✅ Required field
const isRequired = (msg = 'This field is required') => value => value ? true : msg;

// ✅ Email validation
const isEmail = (msg = 'Invalid email') => value =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : msg;

// ✅ Minimum length
const minLength = (length, msg) => value =>
  value && value.length >= length ? true : msg || `Minimum length is ${length}`;

// ✅ Maximum length
const maxLength = (length, msg) => value =>
  value && value.length <= length ? true : msg || `Maximum length is ${length}`;

// ✅ Numeric value
const isNumber = (msg = 'This field must be a number') => value =>
  !isNaN(value) ? true : msg;

// ✅ Integer
const isInteger = (msg = 'This field must be an integer') => value =>
  Number.isInteger(Number(value)) ? true : msg;

// ✅ Positive number
const isPositive = (msg = 'This number must be positive') => value =>
  Number(value) > 0 ? true : msg;

// ✅ Regex pattern
const matches = (pattern, msg = 'Invalid format') => value =>
  pattern.test(value) ? true : msg;

// ✅ Password strength
// At least 1 uppercase, 1 lowercase, 1 number, 1 special character, min 8 chars
const strongPassword = (msg = 'Password must contain uppercase, lowercase, number, special char and at least 8 chars') => value =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value) ? true : msg;

// ✅ Confirm password (compare two fields)
// usage: confirmPassword(() => req.body.password)
const confirmPassword = (getOriginalValue, msg = 'Passwords do not match') => value =>
  value === getOriginalValue() ? true : msg;

// ✅ URL validation
const isURL = (msg = 'Invalid URL') => value =>
  /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_.]*)?)?$/.test(value) ? true : msg;

// ✅ Custom function
// usage: custom(value => value > 10 ? true : 'Must be > 10')
const custom = fn => value => fn(value);

// ✅  is string 
// the value dont have to enclude numbers or special characters
const isAlphabetic = (msg = 'This field must only contain letters and spaces') => value =>
  /^[A-Za-z\s]+$/.test(value) ? true : msg;

module.exports = {
  isRequired,
  isEmail,
  minLength,
  maxLength,
  isNumber,
  isInteger,
  isPositive,
  matches,
  strongPassword,
  confirmPassword,
  isURL,
  custom,
  isAlphabetic
};
