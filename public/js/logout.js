function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      if (res.ok) {
        window.location.href = "/auth/login";
      } else {
        alert("Erreur lors de la déconnexion");
      }
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  });
}

window.initLogout = initLogout;
