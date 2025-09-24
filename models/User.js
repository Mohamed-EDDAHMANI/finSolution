
// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currency: {
            type: DataTypes.ENUM('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'MAD'),
            allowNull: false,
            defaultValue: 'MAD'
        },
        picture: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true, // createdAt & updatedAt handled automatically
        tableName: 'users'
    });



    return User;
};

