// ================== STATE ==================
let isEditMode = false;
let currentUserId = null;
let currentPage = 1;
const rowsPerPage = 5;

let currentSortKey = null;
let sortDirection = "asc";

// ================== ELEMENTS ==================
const modalTitle = document.getElementById("modalTitle");
const table = document.getElementById("userTable");
const searchInput = document.getElementById("searchInput");
const pagination = document.getElementById("pagination");

const modal = document.getElementById("modalBackdrop");
const addUserBtn = document.getElementById("addUserBtn");
const closeModal = document.getElementById("closeModal");
const userForm = document.getElementById("userForm");

// ================== DATA ==================
let users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", role: "Viewer" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Editor" },
  { id: 5, name: "Daniel Wilson", email: "daniel@example.com", role: "Viewer" },
  { id: 6, name: "Sophia Taylor", email: "sophia@example.com", role: "Admin" },
  { id: 7, name: "Chris Anderson", email: "chris@example.com", role: "Editor" },
  { id: 8, name: "Olivia Martinez", email: "olivia@example.com", role: "Viewer" },
  { id: 9, name: "Matthew Thomas", email: "matthew@example.com", role: "Editor" },
  { id: 10, name: "Ava Moore", email: "ava@example.com", role: "Viewer" },
  { id: 11, name: "James Jackson", email: "james@example.com", role: "Admin" },
  { id: 12, name: "Isabella White", email: "isabella@example.com", role: "Editor" },
  { id: 13, name: "Benjamin Harris", email: "benjamin@example.com", role: "Viewer" },
  { id: 14, name: "Mia Martin", email: "mia@example.com", role: "Editor" },
  { id: 15, name: "Lucas Thompson", email: "lucas@example.com", role: "Viewer" },
  { id: 16, name: "Charlotte Garcia", email: "charlotte@example.com", role: "Admin" },
  { id: 17, name: "Henry Martinez", email: "henry@example.com", role: "Editor" },
  { id: 18, name: "Amelia Robinson", email: "amelia@example.com", role: "Viewer" },
  { id: 19, name: "Ethan Clark", email: "ethan@example.com", role: "Editor" },
  { id: 20, name: "Harper Lewis", email: "harper@example.com", role: "Viewer" }
];
localStorage.setItem('users', JSON.stringify(users)); // force overwrite
let filteredUsers = [...users];

// ================== UTILS ==================
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

// ================== SORT ==================
function sortBy(key) {
  if (currentSortKey === key) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    currentSortKey = key;
    sortDirection = "asc";
  }

  filteredUsers.sort((a, b) => {
    const A = a[key].toLowerCase();
    const B = b[key].toLowerCase();
    return sortDirection === "asc" ? A.localeCompare(B) : B.localeCompare(A);
  });

  currentPage = 1;
  renderUsers(filteredUsers);
}

// ================== RENDER ==================
function renderUsers(data) {
  table.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const paginated = data.slice(start, start + rowsPerPage);

  if (!paginated.length) {
    table.innerHTML = `
      <tr>
        <td colspan="4" class="p-4 text-center text-gray-500">No users found</td>
      </tr>
    `;
  }

  paginated.forEach(user => {
    table.innerHTML += `
      <tr class="border-b hover:bg-gray-50">
        <td class="p-3">${user.name}</td>
        <td class="p-3">${user.email}</td>
        <td class="p-3">${user.role}</td>
        <td class="p-3 space-x-2">
          <button onclick="editUser(${user.id})" class="text-blue-600">Edit</button>
          <button onclick="deleteUser(${user.id})" class="text-red-600">Delete</button>
        </td>
      </tr>
    `;
  });

  renderPagination(data.length);
}

// ================== PAGINATION ==================
function renderPagination(total) {
  pagination.innerHTML = "";
  const pages = Math.ceil(total / rowsPerPage);

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `px-3 py-1 border rounded ${i === currentPage ? "bg-blue-600 text-white" : ""}`;
    btn.onclick = () => {
      currentPage = i;
      renderUsers(filteredUsers);
    };
    pagination.appendChild(btn);
  }
}

// ================== SEARCH ==================
searchInput.addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  currentPage = 1;

  filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(val) ||
    u.email.toLowerCase().includes(val)
  );

  currentSortKey ? sortBy(currentSortKey) : renderUsers(filteredUsers);
});

// ================== ADD / EDIT / DELETE ==================
addUserBtn.onclick = () => {
  isEditMode = false;
  userForm.reset();
  modalTitle.textContent = "Add User";
  modal.classList.replace("hidden", "flex");
};

function editUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  isEditMode = true;
  currentUserId = id;
  modalTitle.textContent = "Edit User";

  name.value = user.name;
  email.value = user.email;
  role.value = user.role;

  modal.classList.replace("hidden", "flex");
}

function deleteUser(id) {
  if (!confirm("Delete this user?")) return;
  users = users.filter(u => u.id !== id);
  saveUsers();
  filteredUsers = [...users];
  renderUsers(filteredUsers);
}

userForm.onsubmit = e => {
  e.preventDefault();

  const userData = {
    id: isEditMode ? currentUserId : Date.now(),
    name: name.value.trim(),
    email: email.value.trim(),
    role: role.value
  };

  if (isEditMode) {
    users = users.map(u => u.id === currentUserId ? userData : u);
  } else {
    users.push(userData);
  }

  saveUsers();
  filteredUsers = [...users];
  modal.classList.replace("flex", "hidden");
  renderUsers(filteredUsers);
};

closeModal.onclick = () => modal.classList.replace("flex", "hidden");

// ================== INIT ==================
renderUsers(filteredUsers);



const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});
