

module.exports = (sequelize, DataTypes) => {
    const Budget = sequelize.define('Budget', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }
    }, {
        timestamps: true,
        tableName: 'budgets',
    });

    return Budget;
};
