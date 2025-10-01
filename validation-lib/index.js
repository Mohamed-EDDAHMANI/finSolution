const {
    isRequired,
    isEmail,
    minLength,
    isAlphabetic,
    isInteger,
    isNumber,
    isPositive
} = require('./validators');

// Helper to set session messages
const setSessionMessage = (req, type, messages) => {
    req.session.messages = req.session.messages || {};
    req.session.messages[type] = Array.isArray(messages) ? messages : [messages];
};

function validate(rules, options = {}) {
    return (req, res, next) => {
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
            // --- Case 1: Request AJAX / JSON API
            if (req.headers['content-type'] === 'application/json' || req.xhr || req.accepts('json')) {
                return res.status(422).json({
                    status: "error",
                    errors
                });
            }

            // --- Case 2: Request Web (session + redirect)
            setSessionMessage(req, 'error', errors.map(e => e.message));

            if (options.redirect) {
                // Redirect to given view/template
                return res.redirect(options.redirect);
            } else if (req.originalUrl) {
                // Redirect back to the same URL
                return res.redirect(req.originalUrl);
            } else {
                // --- Case 3: No template / redirect (e.g. traitement route)
                return res.status(400).send(errors.map(e => e.message).join(', '));
            }
        }

        next();
    };
}

module.exports = {
    validate,
    isRequired,
    isEmail,
    minLength,
    isAlphabetic,
    isInteger,
    isNumber,
    isPositive
};
