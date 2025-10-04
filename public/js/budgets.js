function initBudgets() {
  const budgetForm = document.getElementById("budgetForm");
  const budgetList = document.getElementById("budgetList");
  const submitBtn = budgetForm.querySelector("button[type=submit]");

  let editingBudgetId = null; // state ديال mode

  // Handle Create/Update Budget
  budgetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      month: parseInt(budgetForm.month.value),
      amount: parseFloat(budgetForm.amount.value),
      categoryId: budgetForm.categoryId.value,
    };

    try {
      let res, data;

      if (editingBudgetId) {
        // ---- Update mode ----
        res = await fetch(`/api/budgets/${editingBudgetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        data = await res.json();

        if (res.ok) {
          showFlashMessages([{ type: "success", text: "Budget modifié avec succès" }]);
          resetForm();
          location.reload(); // أو تحدث اللائحة بلا ما reload
        } else {
          showFlashMessages([{ type: "error", text: data.errors || "Erreur lors de la mise à jour" }]);
        }
      } else {
        // ---- Create mode ----
        res = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        data = await res.json();

        if (res.ok) {
          showFlashMessages([{ type: "success", text: data.message || "Budget créé avec succès" }]);
          budgetForm.reset();
          budgetList.insertAdjacentHTML(
            "afterbegin",
            `
          <li class="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
            <div class="text-sm text-gray-700">
              <p><span class="font-semibold">Mois :</span> ${data.month}</p>
              <p><span class="font-semibold">Montant :</span> ${data.amount} MAD</p>
              <p><span class="font-semibold">Catégorie :</span> ${data.Category ? data.Category.name : "N/A"}</p>
            </div>
            <div class="flex gap-2">
              <button class="editBudget bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition" data-id="${data.id}">Modifier</button>
              <button class="deleteBudget bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition" data-id="${data.id}">Supprimer</button>
            </div>
          </li>`
          );
        } else {
          showFlashMessages([{ type: "error", text: data.errors || "Erreur lors de la création du budget" }]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Delete Budget
  budgetList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("deleteBudget")) {
      const id = e.target.dataset.id;
      try {
        const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
          setTimeout(() => window.location.reload(), 200);
        } else {
          showFlashMessages([{ type: "error", text: data.errors || "Erreur lors de la suppression" }]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Edit Budget
  budgetList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("editBudget")) {
      const id = e.target.dataset.id;
      editingBudgetId = id;

      // نعمر الفورم بالبيانات ديال li
      const li = e.target.closest("li");
      const month = li.querySelector("p:nth-child(1)").innerText.replace("Mois :", "").trim();
      const amount = li.querySelector("p:nth-child(2)").innerText.replace("Montant :", "").replace("MAD", "").trim();
      const category = li.querySelector("p:nth-child(3)").innerText.replace("Catégorie :", "").trim();

      budgetForm.month.value = month;
      budgetForm.amount.value = amount;
      // ميمكنش نعرف id ديال category من النص، خصنا نخزنوها ف data-* أحسن
      // budgetForm.categoryId.value = categoryIdFromData

      // نبدل الزر
      submitBtn.textContent = "Modifier Budget";

      // نضيف زر ديال Cancel
      if (!document.getElementById("cancelEdit")) {
        const cancelBtn = document.createElement("button");
        cancelBtn.id = "cancelEdit";
        cancelBtn.type = "button";
        cancelBtn.className = "ml-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition";
        cancelBtn.textContent = "Annuler";
        submitBtn.insertAdjacentElement("afterend", cancelBtn);

        cancelBtn.addEventListener("click", resetForm);
      }
    }
  });

  function resetForm() {
    editingBudgetId = null;
    budgetForm.reset();
    submitBtn.textContent = "+ Ajouter Budget";
    const cancelBtn = document.getElementById("cancelEdit");
    if (cancelBtn) cancelBtn.remove();
  }
}

window.initBudgets = initBudgets;
