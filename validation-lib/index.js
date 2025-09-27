// index.js
const { isRequired, isEmail, minLength, isAlphabetic } = require('./validators');

function validate(rules) {

    return (req, res, next) => {
        const errors = [];

        for (const field in rules) {
            // EX : 'email': [isRequired(), isEmail()] => validators = [isRequired(), isEmail()] is an array of functions
            const validators = rules[field];
            // Get the value from req.body for EX : email , password ... values : simo@gmail.com , 123456
            const value = req.body[field];

            validators.forEach(validator => {
                const result = validator(value);
                // If validation fails, result will be the error message (string), otherwise true   
                if (result !== true) errors.push({ field, message: result });
            });
        }

        if (errors.length > 0) {
            // req.flash('error', errors.map(e => e.message).join(', '));
            req.flash('error', errors);
            return res.redirect(req.originalUrl);
        }

        next();
    };
}

module.exports = { validate, isRequired, isEmail, minLength , isAlphabetic };
