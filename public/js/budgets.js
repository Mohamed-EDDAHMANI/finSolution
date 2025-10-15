function initBudgets() {
  const budgetForm = document.getElementById("budgetForm");
  const budgetList = document.getElementById("budgetList");
  const submitBtn = budgetForm?.querySelector("button[type=submit]");

  if (!budgetForm || !budgetList) return;

  let editingBudgetId = null;

  // Helper to reset form
  const resetForm = () => {
    budgetForm.reset();
    editingBudgetId = null;
    if (submitBtn) {
      submitBtn.innerHTML = `
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span class="text-sm sm:text-base">Ajouter Budget</span>
      `;
    }
  };

  // Helper function to refresh components
  const refreshAllComponents = async () => {
    try {
      if (window.initCategories) await window.initCategories();
      if (window.initCharts) await window.initCharts();
      console.log('✅ Components refreshed after budget change');
    } catch (err) {
      console.error('Error refreshing components:', err);
    }
  };

  // Handle Create/Update Budget
  budgetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      month: parseInt(budgetForm.month.value),
      amount: parseFloat(budgetForm.amount.value),
      categoryId: budgetForm.categoryId.value,
    };

    if (!formData.month || !formData.amount || !formData.categoryId) {
      showFlashMessages([{ type: "error", text: "Tous les champs sont requis" }]);
      return;
    }

    try {
      let res, data;

      if (editingBudgetId) {
        // Update mode
        res = await fetch(`/api/budgets/${editingBudgetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: 'include'
        });
        data = await res.json();

        if (res.ok) {
          showFlashMessages([{ type: "success", text: "Budget modifié avec succès" }]);
          resetForm();
          await refreshAllComponents();
          setTimeout(() => location.reload(), 1000);
        } else {
          showFlashMessages([{ type: "error", text: data.errors || data.message || "Erreur lors de la mise à jour" }]);
        }
      } else {
        // Create mode
        res = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: 'include'
        });
        data = await res.json();

        if (res.ok) {
          showFlashMessages([{ type: "success", text: data.message || "Budget créé avec succès" }]);
          budgetForm.reset();
          await refreshAllComponents();
          setTimeout(() => location.reload(), 1000);
        } else {
          showFlashMessages([{ type: "error", text: data.errors || data.message || "Erreur lors de la création du budget" }]);
        }
      }
    } catch (err) {
      console.error(err);
      showFlashMessages([{ type: "error", text: "Erreur réseau: " + err.message }]);
    }
  });

  // Event delegation for Edit and Delete
  budgetList.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".editBudget");
    const deleteBtn = e.target.closest(".deleteBudget");

    // Delete Budget
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      
      if (!confirm("Voulez-vous vraiment supprimer ce budget ?")) return;

      try {
        const res = await fetch(`/api/budgets/${id}`, { 
          method: "DELETE",
          credentials: 'include'
        });
        const data = await res.json();
        
        if (res.ok) {
          showFlashMessages([{ type: "success", text: "Budget supprimé avec succès" }]);
          await refreshAllComponents();
          setTimeout(() => location.reload(), 1000);
        } else {
          showFlashMessages([{ type: "error", text: data.errors || data.message || "Erreur lors de la suppression" }]);
        }
      } catch (err) {
        console.error(err);
        showFlashMessages([{ type: "error", text: "Erreur réseau: " + err.message }]);
      }
    }

    // Edit Budget
    if (editBtn) {
      const id = editBtn.dataset.id;
      const month = editBtn.dataset.month;
      const amount = editBtn.dataset.amount;
      const categoryId = editBtn.dataset.categoryid;

      editingBudgetId = id;

      // Fill form with data
      budgetForm.month.value = month;
      budgetForm.amount.value = amount;
      budgetForm.categoryId.value = categoryId;

      // Update button text
      if (submitBtn) {
        submitBtn.innerHTML = `
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span class="text-sm sm:text-base">Modifier Budget</span>
        `;
      }

      // Scroll to form
      budgetForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

window.initBudgets = initBudgets;
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
