function initTransactions() {
  const transactionForm = document.getElementById('transactionForm');
  const transactionsTable = document.getElementById('transactionsTable');
  const balance = document.getElementById('balance');

  if (!transactionForm || !transactionsTable || !balance) return;

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
          flashMessages.push({ type: 'error', text: 'Erreur' });
        }
        showFlashMessages(flashMessages);
        return;
      }

      flashMessages.push({ type: 'success', text: "Transaction ajoutée avec succès !" });
      showFlashMessages(flashMessages);

      const row = document.createElement('tr');
      row.classList.add('border-b');
      row.dataset.id = result.id;
      row.innerHTML = `
        <td class="px-4 py-2">${new Date(result.date).toLocaleDateString('fr-FR')}</td>
        <td class="px-4 py-2">${result.categorie}</td>
        <td class="px-4 py-2 ${result.type === 'depense' ? 'text-red-500' : 'text-green-500'}">
          ${result.type === 'depense' ? '-' : '+'}${result.montant} MAD
        </td>
        <td class="px-4 py-2">${result.type === 'depense' ? 'Dépense' : 'Revenu'}</td>
        <td class="px-4 py-2">
          <button class="editTransaction text-blue-500 hover:underline" data-id="${result.id}">Éditer</button>
          <button class="deleteTransaction text-red-500 hover:underline ml-2" data-id="${result.id}">Supprimer</button>
        </td>`;
      transactionsTable.prepend(row);
      transactionForm.reset();

      console.log('Updated balance from server:', result.balance);
      // balance.textContent = result.balance.toFixed(2);

    } catch (err) {
      showFlashMessages([{ type: 'error', text: err.message }]);
    }
  });

  // Supprimer transaction (event delegation)
  transactionsTable.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('deleteTransaction')) return;

    const id = e.target.dataset.id;
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
          flashMessages.push({ type: 'error', text: 'Erreur' });
        }
        showFlashMessages(flashMessages);
        return;
      }

      balance.textContent = result.balance.toFixed(2);

      showFlashMessages([{ type: 'success', text: 'Transaction supprimée avec succès' }]);
      const row = transactionsTable.querySelector(`tr[data-id='${id}']`);
      if (row) row.remove();

    } catch (err) {
      showFlashMessages([{ type: 'error', text: err.message }]);
    }
  });
}

window.initTransactions = initTransactions;
