
module.exports = (sequelize, DataTypes) => {
    const SavingGoal = sequelize.define('SavingGoal', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        targetAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currentAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00,
        },
        targetDate: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        timestamps: true,
        tableName: 'saving_goals',
    })

    return SavingGoal;
}