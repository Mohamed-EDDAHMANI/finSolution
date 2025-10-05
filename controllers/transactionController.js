const { Transaction, Category } = require('../models');
const { checkBudgetLimit } = require("../services/transactionService");


async function calculateBalance(req) {
    const transactions = await Transaction.findAll({
        where: { userId: req.session.user.id }
    });

    let balance = 0;

    if (Array.isArray(transactions)) {
        transactions.forEach(trx => {
            const amount = Number(trx.amount); // convert string to number
            if (isNaN(amount)) {
                console.warn('Montant invalide pour la transaction:', trx);
                return; // ignore invalid amounts
            }

            if (trx.type === 'expense') {
                balance -= amount;
            } else {
                balance += amount;
            }
        });
    }
    return balance;
}


// GET all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
    try {
        const userId = req.session.user?.id; // get user ID from session
        if (!userId) return res.status(401).json({ message: "Utilisateur non connecté" });

        const transactions = await Transaction.findAll({
            where: { userId },
            include: [{ model: Category, attributes: ['id', 'name'] }],
            order: [['date', 'DESC']]
        });

        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// CREATE a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) return res.status(401).json({ message: "Utilisateur non connecté" });

        const { type, amount, date, categoryId } = req.body;

        if (!type || !amount || !date || !categoryId) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) return res.status(404).json({ errors: "Catégorie non trouvée" });

        const transaction = await Transaction.create({
            type,
            amount,
            date,
            userId,
            categoryId
        });

        const balance = await calculateBalance(req);
        if (type === "expense") {
            await checkBudgetLimit(req.session.user, categoryId);
        }

        res.status(201).json({ transaction, balance: balance || 0, category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// UPDATE a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) return res.status(401).json({ message: "Utilisateur non connecté" });

        const { id } = req.params;
        const { type, montant, date, categoryId } = req.body;

        const transaction = await Transaction.findOne({ where: { id, userId } });
        if (!transaction) return res.status(404).json({ message: "Transaction non trouvée" });

        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) return res.status(404).json({ message: "Catégorie non trouvée" });
            transaction.categoryId = categoryId;
        }

        transaction.type = type || transaction.type;
        transaction.montant = montant || transaction.montant;
        transaction.date = date || transaction.date;

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// DELETE a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const userId = req.session.user?.id;
        if (!userId) return res.status(401).json({ message: "Utilisateur non connecté" });

        const { id } = req.params;
        const transaction = await Transaction.findOne({ where: { id, userId } });
        if (!transaction) return res.status(404).json({ message: "Transaction non trouvée" });

        await transaction.destroy();
        const balance = await calculateBalance(req);
        res.json({ message: "Transaction supprimée", balance: balance || 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

