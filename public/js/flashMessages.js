function showFlashMessages(flashMessages) {
    console.log("Flash messages to show:", flashMessages);
    const flashContainer = document.createElement('div');
    flashContainer.classList.add('flash-container', 'fixed', 'top-4', 'left-1/2', 'transform', '-translate-x-1/2', 'z-50', 'flex', 'flex-col', 'items-center');
    document.body.appendChild(flashContainer);

    let index = 0;
    let stop = false; // flag bach n9dro nstop affichage

    // listener global: click anywhere stops messages
    function stopMessages() {
        stop = true;
        flashContainer.remove(); // remove container w tous les messages
        flashMessages.length = 0; // khawi variable dyal les erreurs
        document.removeEventListener('click', stopMessages); // cleanup
    }
    document.addEventListener('click', stopMessages);

    function showNextMessage() {
        if (index >= flashMessages.length || stop) return;

        const msgData = flashMessages[index];
        const msgDiv = document.createElement('div');
        msgDiv.className = `flash-message px-4 py-3 rounded-lg mb-2 shadow-lg transition duration-500 ${
            msgData.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'}`;
        msgDiv.innerHTML = `<span class="font-medium">${msgData.type === 'success' ? 'Success!' : 'Error!'}</span> ${msgData.text}`;
        msgDiv.style.opacity = 0;
        flashContainer.appendChild(msgDiv);

        setTimeout(() => msgDiv.style.opacity = 1, 10);

        setTimeout(() => {
            if (!stop) {
                msgDiv.style.opacity = 0;
                setTimeout(() => {
                    if (!stop) {
                        msgDiv.remove();
                        index++;
                        showNextMessage();
                    }
                }, 500);
            }
        }, 4000);
    }

    showNextMessage();
    flashMessages = [];
}
