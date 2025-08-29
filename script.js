// ------- DATA MODEL (default 34 items) -------
const defaultData = {
  about: "A cozy place to enjoy fresh coffee, study, work, or just relax with friends. Every cup is made with love to make you feel at home.",
  items: [
    // Hot (5)
    {category:"Hot", name:"Espresso", price:2.5, image:""},
    {category:"Hot", name:"Americano", price:3, image:""},
    {category:"Hot", name:"Cappuccino", price:3.5, image:""},
    {category:"Hot", name:"Latte", price:3.5, image:""},
    {category:"Hot", name:"Mocha", price:4, image:""},
    // Iced (5)
    {category:"Iced", name:"Iced Americano", price:3, image:""},
    {category:"Iced", name:"Iced Latte", price:3.5, image:""},
    {category:"Iced", name:"Iced Mocha", price:4, image:""},
    {category:"Iced", name:"Cold Brew", price:4, image:""},
    {category:"Iced", name:"Iced Caramel Macchiato", price:4.5, image:""},
    // Refreshers (4)
    {category:"Refreshers", name:"Lemon Mint Refresher", price:3.5, image:""},
    {category:"Refreshers", name:"Berry Blast Refresher", price:3.5, image:""},
    {category:"Refreshers", name:"Mango Passion Refresher", price:3.5, image:""},
    {category:"Refreshers", name:"Peach Iced Tea", price:3.5, image:""},
    // Smoothie (4)
    {category:"Smoothie", name:"Strawberry Smoothie", price:4, image:""},
    {category:"Smoothie", name:"Mango Smoothie", price:4, image:""},
    {category:"Smoothie", name:"Banana Smoothie", price:3.5, image:""},
    {category:"Smoothie", name:"Mixed Berry Smoothie", price:4.5, image:""},
    // Milkshake (4)
    {category:"Milkshake", name:"Chocolate Milkshake", price:4, image:""},
    {category:"Milkshake", name:"Vanilla Milkshake", price:4, image:""},
    {category:"Milkshake", name:"Strawberry Milkshake", price:4, image:""},
    {category:"Milkshake", name:"Oreo Milkshake", price:4.5, image:""},
    // Boba (5)
    {category:"Boba", name:"Classic Milk Tea", price:4, image:""},
    {category:"Boba", name:"Brown Sugar Boba", price:4.5, image:""},
    {category:"Boba", name:"Taro Boba", price:4.5, image:""},
    {category:"Boba", name:"Matcha Boba", price:4.5, image:""},
    {category:"Boba", name:"Strawberry Boba", price:4.5, image:""},
    // Frappe (4)
    {category:"Frappe", name:"Coffee Frappe", price:4, image:""},
    {category:"Frappe", name:"Mocha Frappe", price:4.5, image:""},
    {category:"Frappe", name:"Caramel Frappe", price:4.5, image:""},
    {category:"Frappe", name:"Vanilla Frappe", price:4, image:""},
    // Shisha (3)
    {category:"Shisha", name:"Apple Shisha", price:6, image:""},
    {category:"Shisha", name:"Mint Shisha", price:6, image:""},
    {category:"Shisha", name:"Grape Shisha", price:6, image:""}
  ]
};

const CATEGORIES = ["Hot","Iced","Refreshers","Smoothie","Milkshake","Boba","Frappe","Shisha"];

// ------- STORAGE HELPERS -------
const KEY = "latte-site-data-v1";
function loadData(){
  const raw = localStorage.getItem(KEY);
  if(!raw) return JSON.parse(JSON.stringify(defaultData));
  try { return JSON.parse(raw) } catch(e){ return JSON.parse(JSON.stringify(defaultData)); }
}
function saveData(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ------- RENDER MENU -------
let state = loadData();
const grid = document.getElementById("menu-grid");
const search = document.getElementById("search");
const catFilter = document.getElementById("categoryFilter");

function renderCategoryFilter(){
  catFilter.innerHTML = "<option value='all'>All categories</option>" + CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join("");
}
renderCategoryFilter();

function renderMenu(){
  document.getElementById("about-text").textContent = state.about;
  grid.innerHTML = "";
  const q = (search.value||"").toLowerCase();
  const cat = catFilter.value || "all";
  state.items
    .filter(it => cat==="all" ? true : it.category===cat)
    .filter(it => it.name.toLowerCase().includes(q))
    .forEach(it => {
      const card = document.createElement("div");
      card.className = "card";
      const img = document.createElement("img");
      img.src = it.image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop";
      img.alt = it.name;
      const title = document.createElement("div");
      title.innerHTML = `<strong>${it.name}</strong>`;
      const meta = document.createElement("div");
      meta.className = "category-chip";
      meta.textContent = it.category;
      const price = document.createElement("div");
      price.className = "price";
      price.textContent = formatPrice(it.price);
      card.append(img, title, meta, price);
      grid.appendChild(card);
    });
}
function formatPrice(p){
  if (p === undefined || p === null || p === "") return "";
  return "$" + Number(p).toFixed(2);
}

search.addEventListener("input", renderMenu);
catFilter.addEventListener("change", renderMenu);
renderMenu();

// ------- SETTINGS / ADMIN -------
const openBtn = document.getElementById("settings-btn");
const modal = document.getElementById("settings-panel");
const closeBtn = document.getElementById("close-settings");
const loginBtn = document.getElementById("login-btn");
const adminControls = document.getElementById("admin-controls");
const editAbout = document.getElementById("edit-about");
const saveAboutBtn = document.getElementById("save-about");
const usernameInput = document.getElementById("admin-user");
const passwordInput = document.getElementById("admin-pass");

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden","false");
});
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden","true");
});

loginBtn.addEventListener("click", () => {
  const u = usernameInput.value.trim();
  const p = passwordInput.value;
  if (u === "admin" && p === "latte112233"){
    document.getElementById("login-form").classList.add("hidden");
    adminControls.classList.remove("hidden");
    editAbout.value = state.about;
    buildEditor();
  } else {
    alert("Wrong username or password!");
  }
});

saveAboutBtn.addEventListener("click", () => {
  state.about = editAbout.value.trim() || defaultData.about;
  saveData(state);
  renderMenu();
  alert("About updated!");
});

// ------- TABS -------
const tabs = document.querySelectorAll(".tab");
const panels = {
  about: document.getElementById("tab-about"),
  items: document.getElementById("tab-items"),
  backup: document.getElementById("tab-backup")
};
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    Object.values(panels).forEach(p => p.classList.add("hidden"));
    panels[btn.dataset.tab].classList.remove("hidden");
  });
});

// ------- EDITOR -------
const editor = document.getElementById("editor");
const newCat = document.getElementById("new-item-category");
const newName = document.getElementById("new-item-name");
const newPrice = document.getElementById("new-item-price");
const newImage = document.getElementById("new-item-image");
const addItemBtn = document.getElementById("add-item");

function buildEditor(){
  // populate category dropdowns
  newCat.innerHTML = CATEGORIES.map(c=>`<option value="${c}">${c}</option>`).join("");

  editor.innerHTML = "";
  state.items.forEach((it, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "editor-card";

    const img = document.createElement("img");
    img.className = "img-preview";
    img.src = it.image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop";
    img.alt = it.name;

    const row1 = document.createElement("div");
    row1.className = "row";
    const nameInput = document.createElement("input");
    nameInput.type = "text"; nameInput.value = it.name;
    const priceInput = document.createElement("input");
    priceInput.type = "number"; priceInput.step = "0.5"; priceInput.value = it.price;
    row1.append(nameInput, priceInput);

    const row2 = document.createElement("div");
    row2.className = "row";
    const catSelect = document.createElement("select");
    catSelect.innerHTML = CATEGORIES.map(c=>`<option ${c===it.category?'selected':''} value="${c}">${c}</option>`).join("");
    const file = document.createElement("input");
    file.type = "file"; file.accept = "image/*";
    row2.append(catSelect, file);

    const actions = document.createElement("div");
    actions.className = "actions";
    const saveBtn = document.createElement("button");
    saveBtn.className = "btn primary"; saveBtn.textContent = "Save";
    const delBtn = document.createElement("button");
    delBtn.className = "btn danger"; delBtn.textContent = "Delete";

    actions.append(saveBtn, delBtn);

    wrap.append(img, row1, row2, actions);
    editor.appendChild(wrap);

    // events
    saveBtn.addEventListener("click", async () => {
      it.name = nameInput.value.trim() || it.name;
      it.price = Number(priceInput.value)||it.price;
      it.category = catSelect.value;
      if (file.files && file.files[0]) {
        const dataUrl = await fileToDataURL(file.files[0]);
        it.image = dataUrl;
        img.src = dataUrl;
      }
      saveData(state);
      renderMenu();
      alert("Item saved!");
    });

    delBtn.addEventListener("click", () => {
      if (!confirm("Delete this item?")) return;
      state.items.splice(idx,1);
      saveData(state);
      buildEditor();
      renderMenu();
    });
  });
}

addItemBtn.addEventListener("click", async () => {
  const item = {
    category: newCat.value,
    name: (newName.value || "").trim() || "New Item",
    price: Number(newPrice.value)||0,
    image: ""
  };
  if (newImage.files && newImage.files[0]) {
    item.image = await fileToDataURL(newImage.files[0]);
  }
  state.items.push(item);
  saveData(state);
  newName.value = ""; newPrice.value=""; newImage.value="";
  buildEditor();
  renderMenu();
});

function fileToDataURL(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ------- BACKUP / RESTORE -------
document.getElementById("export-data").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "latte-data.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("import-data").addEventListener("click", () => {
  const file = document.getElementById("import-file").files[0];
  if (!file) { alert("Choose a file first."); return; }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.items || !Array.isArray(data.items)) throw new Error("Invalid file");
      state = data;
      saveData(state);
      buildEditor();
      renderMenu();
      alert("Imported successfully!");
    } catch(e){
      alert("Import failed: " + e.message);
    }
  };
  reader.readAsText(file);
});

document.getElementById("reset-data").addEventListener("click", () => {
  if (!confirm("Reset to default demo data?")) return;
  state = JSON.parse(JSON.stringify(defaultData));
  saveData(state);
  buildEditor();
  renderMenu();
});

// ------- MISC -------
document.getElementById("year").textContent = new Date().getFullYear();

