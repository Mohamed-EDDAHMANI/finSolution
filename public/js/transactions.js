function initTransactions() {
  const transactionForm = document.getElementById('transactionForm');
  const transactionsTable = document.getElementById('transactionsTable');
  const balance = document.getElementById('balance');

  if (!transactionForm || !transactionsTable || !balance) return;

  // Helper function to refresh all components
  const refreshAllComponents = async () => {
    try {
      // Refresh categories
      if (window.initCategories) await window.initCategories();
      
      // Refresh budgets
      if (window.initBudgets) await window.initBudgets();
      
      // Refresh charts
      if (window.initCharts) await window.initCharts();
      
      console.log('✅ All components refreshed');
    } catch (err) {
      console.error('Error refreshing components:', err);
    }
  };

  // Ajouter transaction
  transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(transactionForm));
    let flashMessages = [];

    try {
      const res = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const result = await res.json();

      if (!res.ok) {
        if (Array.isArray(result.errors)) {
          result.errors.forEach(err => {
            flashMessages.push({ type: 'error', text: err.message || err });
          });
        } else {
          flashMessages.push({ type: 'error', text: result.message || 'Erreur' });
        }
        showFlashMessages(flashMessages);
        return;
      }

      flashMessages.push({ type: 'success', text: "Transaction ajoutée avec succès !" });
      showFlashMessages(flashMessages);

      const row = document.createElement('tr');
      row.classList.add('border-b', 'border-gray-200', 'hover:bg-gradient-to-r', 'hover:from-blue-50', 'hover:to-cyan-50', 'transition-all', 'duration-200');
      row.dataset.id = result.id;
      
      const categoryName = result.category?.name || 'N/A';
      const isExpense = result.transaction.type === 'expense';
      
      row.innerHTML = `
        <td class="px-6 py-4 text-sm text-gray-700">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            ${new Date(result.transaction.date).toLocaleDateString('fr-FR')}
          </div>
        </td>
        <td class="px-6 py-4 text-sm">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            ${categoryName}
          </span>
        </td>
        <td class="px-6 py-4 text-sm font-semibold ${isExpense ? 'text-red-600' : 'text-green-600'}">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${isExpense ? 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6' : 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'}"></path>
            </svg>
            ${isExpense ? '-' : '+'}${result.transaction.amount} MAD
          </div>
        </td>
        <td class="px-6 py-4 text-sm">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isExpense ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
            ${isExpense ? '💸 Dépense' : '💰 Revenu'}
          </span>
        </td>
        <td class="px-6 py-4 text-sm">
          <div class="flex gap-2">
            <button class="editTransaction text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg" data-id="${result.transaction.id}" title="Éditer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button class="deleteTransaction text-red-600 hover:text-red-800 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg" data-id="${result.transaction.id}" title="Supprimer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </td>`;
      
      transactionsTable.prepend(row);
      transactionForm.reset();

      balance.textContent = result.balance.toFixed(2) + ' MAD';

      // Refresh all components
      await refreshAllComponents();

    } catch (err) {
      showFlashMessages([{ type: 'error', text: err.message }]);
    }
  });

  // Supprimer transaction (event delegation)
  transactionsTable.addEventListener('click', async (e) => {
    if (!e.target.closest('.deleteTransaction')) return;

    const btn = e.target.closest('.deleteTransaction');
    const id = btn.dataset.id;
    
    if (!confirm("Tu veux vraiment supprimer cette transaction ?")) return;

    let flashMessages = [];

    try {
      const res = await fetch(`/api/transactions/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const result = await res.json();

      if (!res.ok) {
        if (Array.isArray(result.errors)) {
          result.errors.forEach(err => flashMessages.push({ type: 'error', text: err.message || err }));
        } else {
          flashMessages.push({ type: 'error', text: result.message || 'Erreur' });
        }
        showFlashMessages(flashMessages);
        return;
      }

      balance.textContent = result.balance.toFixed(2) + ' MAD';

      showFlashMessages([{ type: 'success', text: 'Transaction supprimée avec succès' }]);
      const row = transactionsTable.querySelector(`tr[data-id='${id}']`);
      if (row) row.remove();

      // Refresh all components
      await refreshAllComponents();

    } catch (err) {
      showFlashMessages([{ type: 'error', text: err.message }]);
    }
  });
}

window.initTransactions = initTransactions;

window.initTransactions = initTransactions;
