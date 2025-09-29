const { isRequired, isEmail, minLength, isAlphabetic, isInteger, isNumber, isPositive } = require('./validators');

// Helper to set session messages
const setSessionMessage = (req, type, messages) => {
    req.session.messages = req.session.messages || {};
    req.session.messages[type] = Array.isArray(messages) ? messages : [messages];
};

function validate(rules, template) {
    return (req, res, next) => {
        console.log(req.body)
        const errors = [];

        for (const field in rules) {
            const validators = rules[field];
            const value = req.body[field];
            
            validators.forEach(validator => {
                const result = validator(value);
                if (result !== true) errors.push({ field, message: result });
            });
        }

        if (errors.length > 0) {
            if (req.headers['content-type'] === 'application/json' || req.xhr) {
                return res.status(400).json({ errors });
            }
            // Save errors to session instead of flash
            setSessionMessage(req, 'error', errors.map(e => e.message));
            if (template) {
                return res.redirect(template);
            }else{
                return res.redirect(req.originalUrl)
            }
        }

        next();
    };
}

module.exports = { validate, isRequired, isEmail, minLength, isAlphabetic, isInteger, isNumber, isPositive };
