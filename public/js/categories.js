function initCategories() {
  const categoryForm = document.getElementById('categoryForm');
  const categoryIdInput = document.getElementById('categoryId');
  const categoryNameInput = document.getElementById('categoryName');
  const categoryLimitInput = document.getElementById('categoryLimit');
  const categoryList = document.getElementById('categoryList');
  const categorySubmitBtn = document.getElementById('categorySubmitBtn');
  let flashMessages = [];

  if (!categoryForm) return;

  // Helper function to refresh all components
  const refreshAllComponents = async () => {
    try {
      // Refresh budgets
      if (window.initBudgets) await window.initBudgets();
      
      // Refresh charts
      if (window.initCharts) await window.initCharts();
      
      console.log('✅ Components refreshed after category change');
    } catch (err) {
      console.error('Error refreshing components:', err);
    }
  };

  categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = categoryIdInput.value;
    const name = categoryNameInput.value.trim();
    const limit = Number(categoryLimitInput.value);
    
    if (!name || isNaN(limit)) {
      showFlashMessages([{ type: 'error', text: 'Nom et limite valides requis' }]);
      return;
    }

    try {
      const url = id ? `/api/categories/update/${id}` : '/api/categories/create';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, limit })
      });

      const result = await res.json();

      if (!res.ok) {
        flashMessages = [];
        
        Array.isArray(result.errors) ? result.errors.forEach(err => {
          flashMessages.push({ type: 'error', text: err.message || err });
        }) : flashMessages.push({ type: 'error', text: result.message || 'Erreur' });
        showFlashMessages(flashMessages);
        return;
      }

      categoryForm.reset();
      categoryIdInput.value = '';
      categorySubmitBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Ajouter Catégorie</span>
      `;

      showFlashMessages([{ type: 'success', text: result.message || 'Catégorie enregistrée avec succès' }]);

      // Refresh components instead of full reload
      await refreshAllComponents();
      setTimeout(() => window.location.reload(), 1000);

    } catch (err) {
      showFlashMessages([{ type: 'error', text: err.message }]);
    }
  });

  categoryList.addEventListener('click', async (e) => {
    const updateBtn = e.target.closest('.updateCategory');
    const deleteBtn = e.target.closest('.deleteCategory');
    
    if (updateBtn) {
      categoryIdInput.value = updateBtn.dataset.id;
      categoryNameInput.value = updateBtn.dataset.name;
      categoryLimitInput.value = updateBtn.dataset.limit;
      categorySubmitBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        <span>Modifier Catégorie</span>
      `;
      
      // Scroll to form
      categoryForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
    } else if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      
      if (confirm('Voulez-vous supprimer cette catégorie ?')) {
        try {
          const res = await fetch(`/api/categories/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          const result = await res.json();

          if (!res.ok) {
            if (Array.isArray(result.errors)) {
              const errorMessages = result.errors.map(err => err.message || err);
              showFlashMessages(errorMessages.map(msg => ({ type: 'error', text: msg })));
            } else {
              showFlashMessages([{ type: 'error', text: result.message || 'Erreur' }]);
            }
            return;
          }

          showFlashMessages([{ type: 'success', text: 'Catégorie supprimée avec succès' }]);
          
          // Refresh components
          await refreshAllComponents();
          setTimeout(() => window.location.reload(), 1000);

        } catch (err) {
          showFlashMessages([{ type: 'error', text: err.message }]);
        }
      }
    }
  });
}

window.initCategories = initCategories;
