const e = require('connect-flash');
const { Category } = require('../models');

exports.createCategory = async (req, res) => {
    const { name, limit } = req.body;
    console.log('Creating category:', { name, limit, userId: req.session.user.id });

     const existing = await Category.findOne({ where: { name } });
        if (existing) {
            req.session.messages = req.session.messages || {};
            req.session.messages['error'] = ['Category name must be unique'];
            return res.status(400).json({ message: 'Category name must be unique' });
        }

    // Here you would typically interact with your database to create the category
    // For example:
    try {
        await Category.create({ name, limit, userId: req.session.user.id });
        req.session.messages = req.session.messages || {};
        req.session.messages['success'] = ['Category created successfully'];
        res.status(201).json({ message: 'Category created successfully.', category: { name, limit } });
    } catch (error) {
        req.session.messages = req.session.messages || {};
        req.session.messages['error'] = ['Failed to create category'];
        res.status(500).json({ message: 'Failed to create category', error: error.message });
    }

}

exports.update = async (req, res) => {
  try {
    const { name, limit } = req.body;
    const { id } = req.params;

    const [updated] = await Category.update(
      { name, limit },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Catégorie introuvable" });
    }

    const category = await Category.findByPk(id);

    if (req.accepts('json')) {
      return res.json({ status: "success", data: category });
    }

    req.session.messages = { success: ["Catégorie mise à jour avec succès"] };
    return res.redirect('/categories');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Erreur serveur" });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Catégorie introuvable" });
    }

    if (req.accepts('json')) {
      return res.json({ status: "success", message: "Catégorie supprimée" });
    }

    req.session.messages = { success: ["Catégorie supprimée avec succès"] };
    return res.redirect('/categories');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Erreur serveur" });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Catégorie introuvable" });
    }

    if (req.accepts('json')) {
      return res.json({ status: "success", message: "Catégorie supprimée" });
    }

    req.session.messages = { success: ["Catégorie supprimée avec succès"] };
    return res.redirect('/categories');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Erreur serveur" });
  }
};

exports.getCategories = async (req, res) => {
    try {
        // console.log('User ID from session:', req.session.user);
        const categories = await Category.findAll({ where: { userId: req.session.user.id } });
        // console.log('Fetched categories:', categories);
        res.status(200).json({ categories });
    } catch (error) {
        return false;
        // res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
};