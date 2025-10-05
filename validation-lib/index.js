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
const setSessionMessage = (req, type, messages, callback) => {
    req.session.messages = req.session.messages || {};
    req.session.messages[type] = Array.isArray(messages) ? messages : [messages];
    
    // Auto-save session after setting message
    req.session.save((err) => {
        if (err) {
            console.error('Session save error in validation:', err);
        }
        if (callback) callback(err);
    });
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
            const errorMessages = errors.map(e => e.message);
            
            setSessionMessage(req, 'error', errorMessages, () => {
                if (options.redirect) {
                    // Redirect to given view/template
                    return res.redirect(options.redirect);
                } else if (req.originalUrl) {
                    // Redirect back to the same URL
                    return res.redirect(req.originalUrl);
                } else {
                    // --- Case 3: No template / redirect
                    return res.status(400).send(errorMessages.join(', '));
                }
            });
            return;
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
