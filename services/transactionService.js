const { Transaction, Category } = require("../models");
const { sendMail } = require('../utils/sendMail');
const { Op } = require("sequelize");

async function checkBudgetLimit(user, categoryId) {

  const category = await Category.findByPk(categoryId);
  if (!category || !category.limit) return;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const totalExpenses = await Transaction.sum("amount", {
    where: {
      userId: user.id,
      categoryId,
      type: "expense",
      date: {
        [Op.between]: [startOfMonth, endOfMonth]
      }
    }
  });

  if (!totalExpenses) return;

  const percentage = (totalExpenses / category.limit) * 100;

  if (percentage >= 70) {
     const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #d9534f;">⚠️ Alerte de budget dépassé</h2>
      <p>Bonjour ${user.displayName},</p>
      <p>
        Attention: vous avez atteint <strong>${percentage.toFixed(0)}%</strong> 
        de votre limite dans la catégorie 
        "<strong>${category.name}</strong>".
      </p>
      <p style="margin-top: 20px;">
        <span style="background-color: #f0ad4e; color: #fff; padding: 5px 10px; border-radius: 4px;">
          Veuillez faire attention à vos dépenses !
        </span>
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">
        Ceci est un message automatique, merci de ne pas répondre.
      </p>
    </div>
  `;
    await sendMail(
      user.email, 
      "⚠️ Alerte de budget dépassé",
      htmlContent
    );
  }
}

module.exports = { checkBudgetLimit };
