// ------- GLOBAL SAVE ALL -------
const saveAllBtn = document.getElementById("save-all");

if (saveAllBtn) {
  saveAllBtn.addEventListener("click", () => {
    const pwd = prompt("Enter password to save changes:", "");
    if (pwd === null) return; // cancelled
    if (pwd === "adamlatte") {
      saveData(state);
      renderMenu();
      alert("All changes saved!");
    } else {
      alert("Wrong password!");
    }
  });
}

// ------- CATEGORY BAR EVENTS -------
document.querySelectorAll(".category-bar button").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.getAttribute("data-cat");
    if (catFilter) {
      catFilter.value = cat;
      renderMenu();
    }
  });
});
