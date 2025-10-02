function initCategories() {
  const categoryForm = document.getElementById('categoryForm');
  const categoryIdInput = document.getElementById('categoryId');
  const categoryNameInput = document.getElementById('categoryName');
  const categoryLimitInput = document.getElementById('categoryLimit');
  const budgetList = document.getElementById('budgetList');
  const categorySubmitBtn = document.getElementById('categorySubmitBtn');
  let flashMessages = [];

  if (!categoryForm) return;

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
        body: JSON.stringify({ name, limit }),
        credentials: 'include'
      });

      const result = await res.json();

      if (!res.ok) {
        Array.isArray(result.errors) ? result.errors.forEach(err => {
          flashMessages.push({ type: 'error', text: err.message || err });
        }) : flashMessages.push({ type: 'error', text: result.message || 'Erreur' });
        showFlashMessages(flashMessages);
        return;
      }

      categoryForm.reset();
      categoryIdInput.value = '';
      categorySubmitBtn.textContent = 'Ajouter Catégorie';

      showFlashMessages([{ type: 'success', text: result.message || 'Catégorie enregistrée avec succès' }]);

      setTimeout(() => window.location.reload(), 1000);

    } catch (err) {
      showFlashMessages([{ type: 'error', text: err.message }]);
    }
  });

  budgetList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('updateCategory')) {
      categoryIdInput.value = e.target.dataset.id;
      categoryNameInput.value = e.target.dataset.name;
      categoryLimitInput.value = e.target.dataset.limit;
      categorySubmitBtn.textContent = 'Modifier Catégorie';
    } else if (e.target.classList.contains('deleteCategory')) {
      const id = e.target.dataset.id;
      if (confirm('Voulez-vous supprimer cette catégorie ?')) {
        try {
          const res = await fetch(`/api/categories/delete/${id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          const result = await res.json();

          if (!res.ok) {
            // Si result.errors est un tableau
            if (Array.isArray(result.errors)) {
              const errorMessages = result.errors.map(err => err.message || err);
              showFlashMessages(errorMessages.map(msg => ({ type: 'error', text: msg })));
            } else {
              showFlashMessages([{ type: 'error', text: 'Erreur' }]);
            }
            return;
          }

          showFlashMessages([{ type: 'success', text: 'Catégorie supprimée avec succès' }]);
          setTimeout(() => window.location.reload(), 1000);

        } catch (err) {
          showFlashMessages([{ type: 'error', text: err.message }]);
        }
      }

    }
  });
}

window.initCategories = initCategories;
