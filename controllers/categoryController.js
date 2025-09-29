

exports.createCategory = (req, res) => {
    const { name, limit } = req.body;
    console.log('Creating category:', { name, limit });

    // Here you would typically interact with your database to create the category
    // For example:
    // Category.create({ name, limit })
    //     .then(category => res.status(201).json(category))
    //     .catch(error => res.status(500).json({ error: error.message }));

    res.status(201).json({ message: 'Category created successfully', category: { name, limit } });
}