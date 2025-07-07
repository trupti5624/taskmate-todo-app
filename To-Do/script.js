class TaskMate {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("taskmate_tasks")) || [];
    this.notes = JSON.parse(localStorage.getItem("taskmate_notes")) || [];
    this.userData = JSON.parse(localStorage.getItem("taskmate_user_data")) || {
      name: "",
      email: "",
      bio: "",
      preferences: {
        defaultDueDate: 7,
        notificationsEnabled: false,
        autoSave: 30,
      },
    };
    this.currentFilter = "all";
    this.editingTaskId = null;
    this.editingNoteId = null;
    this.theme = localStorage.getItem("taskmate_theme") || "light";
    this.autoSaveInterval = null;

    this.initializeElements();
    this.bindEvents();
    this.setTheme(this.theme);
    this.loadQuote();
    this.setupAutoSave();
    this.render();
  }

  initializeElements() {
    // Task elements
    this.taskTitle = document.getElementById("taskTitle");
    this.taskDueDate = document.getElementById("taskDueDate");
    this.taskDescription = document.getElementById("taskDescription");
    this.addTaskBtn = document.getElementById("addTaskBtn");
    this.taskList = document.getElementById("taskList");
    this.taskCount = document.getElementById("taskCount");
    this.clearCompletedBtn = document.getElementById("clearCompleted");
    this.taskEmptyState = document.getElementById("taskEmptyState");
    this.filterBtns = document.querySelectorAll(".filter-btn");

    // Note elements
    this.noteTitle = document.getElementById("noteTitle");
    this.noteContent = document.getElementById("noteContent");
    this.addNoteBtn = document.getElementById("addNoteBtn");
    this.notesList = document.getElementById("notesList");
    this.notesEmptyState = document.getElementById("notesEmptyState");

    // Quote elements
    this.quoteText = document.getElementById("quoteText");
    this.quoteAuthor = document.getElementById("quoteAuthor");
    this.refreshQuote = document.getElementById("refreshQuote");

    // Theme toggle
    this.themeToggle = document.getElementById("themeToggle");

    // User profile elements
    this.userProfileBtn = document.getElementById("userProfileBtn");
    this.userProfileModal = document.getElementById("userProfileModal");
    this.closeUserModal = document.getElementById("closeUserModal");
    this.userName = document.getElementById("userName");
    this.userEmail = document.getElementById("userEmail");
    this.userBio = document.getElementById("userBio");
    this.defaultDueDate = document.getElementById("defaultDueDate");
    this.notificationsEnabled = document.getElementById("notificationsEnabled");
    this.autoSave = document.getElementById("autoSave");
    this.saveProfile = document.getElementById("saveProfile");
    this.cancelProfile = document.getElementById("cancelProfile");
    this.exportData = document.getElementById("exportData");
    this.importData = document.getElementById("importData");
    this.clearAllData = document.getElementById("clearAllData");
    this.importFile = document.getElementById("importFile");
  }

  bindEvents() {
    // Task events
    this.addTaskBtn.addEventListener("click", () => this.addTask());
    this.taskTitle.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });
    this.clearCompletedBtn.addEventListener("click", () =>
      this.clearCompleted()
    );

    // Note events
    this.addNoteBtn.addEventListener("click", () => this.addNote());
    this.noteTitle.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addNote();
    });

    // Filter events
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // Quote events
    this.refreshQuote.addEventListener("click", () => this.loadQuote());

    // Theme toggle
    this.themeToggle.addEventListener("click", () => this.toggleTheme());

    // User profile events
    this.userProfileBtn.addEventListener("click", () => this.openUserProfile());
    this.closeUserModal.addEventListener("click", () =>
      this.closeUserProfile()
    );
    this.saveProfile.addEventListener("click", () => this.saveUserProfile());
    this.cancelProfile.addEventListener("click", () => this.closeUserProfile());
    this.exportData.addEventListener("click", () => this.exportUserData());
    this.importData.addEventListener("click", () => this.importFile.click());
    this.clearAllData.addEventListener("click", () => this.clearAllUserData());
    this.importFile.addEventListener("change", (e) => this.handleFileImport(e));

    // Close modal when clicking outside
    this.userProfileModal.addEventListener("click", (e) => {
      if (e.target === this.userProfileModal) {
        this.closeUserProfile();
      }
    });
  }

  // Task Management
  addTask() {
    const title = this.taskTitle.value.trim();
    let dueDate = this.taskDueDate.value;
    const description = this.taskDescription.value.trim();

    if (!title) {
      this.showNotification("Please enter a task title", "error");
      return;
    }

    // If no due date is selected, use default from user preferences
    if (!dueDate) {
      const defaultDays = this.userData.preferences?.defaultDueDate || 7;
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + defaultDays);
      dueDate = defaultDate.toISOString().split("T")[0];
    }

    const task = {
      id: Date.now(),
      title: title,
      description: description,
      dueDate: dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.render();
    this.resetTaskForm();
    this.showNotification("Task added successfully!", "success");
  }

  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.render();
    }
  }

  deleteTask(id) {
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
      taskElement.classList.add("removing");
      setTimeout(() => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.saveTasks();
        this.render();
        this.showNotification("Task deleted successfully!", "success");
      }, 300);
    }
  }

  editTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;

    this.editingTaskId = id;
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    const contentElement = taskElement.querySelector(".task-content");

    contentElement.innerHTML = `
            <input type="text" class="edit-input" value="${this.escapeHtml(
              task.title
            )}" maxlength="100">
            <textarea class="edit-textarea" maxlength="200">${this.escapeHtml(
              task.description
            )}</textarea>
            <input type="date" class="edit-input" value="${task.dueDate}">
            <div class="edit-actions">
                <button class="save-btn"><i class="fas fa-check"></i> Save</button>
                <button class="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
            </div>
        `;

    const titleInput = contentElement.querySelector('input[type="text"]');
    const descInput = contentElement.querySelector("textarea");
    const dateInput = contentElement.querySelector('input[type="date"]');
    const saveBtn = contentElement.querySelector(".save-btn");
    const cancelBtn = contentElement.querySelector(".cancel-btn");

    titleInput.focus();
    titleInput.select();

    saveBtn.addEventListener("click", () =>
      this.saveTaskEdit(id, titleInput.value, descInput.value, dateInput.value)
    );
    cancelBtn.addEventListener("click", () => this.cancelTaskEdit(id));

    titleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter")
        this.saveTaskEdit(
          id,
          titleInput.value,
          descInput.value,
          dateInput.value
        );
    });
  }

  saveTaskEdit(id, title, description, dueDate) {
    const titleText = title.trim();
    if (!titleText || !dueDate) {
      this.showNotification("Please fill in all required fields", "error");
      return;
    }

    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.title = titleText;
      task.description = description.trim();
      task.dueDate = dueDate;
      this.saveTasks();
      this.render();
      this.showNotification("Task updated successfully!", "success");
    }
    this.editingTaskId = null;
  }

  cancelTaskEdit(id) {
    this.render();
    this.editingTaskId = null;
  }

  clearCompleted() {
    this.tasks = this.tasks.filter((t) => !t.completed);
    this.saveTasks();
    this.render();
    this.showNotification("Completed tasks cleared!", "success");
  }

  // Note Management
  addNote() {
    const title = this.noteTitle.value.trim();
    const content = this.noteContent.value.trim();

    if (!title || !content) {
      this.showNotification("Please fill in all required fields", "error");
      return;
    }

    const note = {
      id: Date.now(),
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
    };

    this.notes.unshift(note);
    this.saveNotes();
    this.render();
    this.resetNoteForm();
    this.showNotification("Note added successfully!", "success");
  }

  deleteNote(id) {
    const noteElement = document.querySelector(`[data-note-id="${id}"]`);
    if (noteElement) {
      noteElement.classList.add("removing");
      setTimeout(() => {
        this.notes = this.notes.filter((n) => n.id !== id);
        this.saveNotes();
        this.render();
        this.showNotification("Note deleted successfully!", "success");
      }, 300);
    }
  }

  editNote(id) {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return;

    this.editingNoteId = id;
    const noteElement = document.querySelector(`[data-note-id="${id}"]`);
    const contentElement = noteElement.querySelector(".note-content");

    contentElement.innerHTML = `
            <input type="text" class="edit-input" value="${this.escapeHtml(
              note.title
            )}" maxlength="50">
            <textarea class="edit-textarea" maxlength="500">${this.escapeHtml(
              note.content
            )}</textarea>
            <div class="edit-actions">
                <button class="save-btn"><i class="fas fa-check"></i> Save</button>
                <button class="cancel-btn"><i class="fas fa-times"></i> Cancel</button>
            </div>
        `;

    const titleInput = contentElement.querySelector('input[type="text"]');
    const contentInput = contentElement.querySelector("textarea");
    const saveBtn = contentElement.querySelector(".save-btn");
    const cancelBtn = contentElement.querySelector(".cancel-btn");

    titleInput.focus();
    titleInput.select();

    saveBtn.addEventListener("click", () =>
      this.saveNoteEdit(id, titleInput.value, contentInput.value)
    );
    cancelBtn.addEventListener("click", () => this.cancelNoteEdit(id));

    titleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter")
        this.saveNoteEdit(id, titleInput.value, contentInput.value);
    });
  }

  saveNoteEdit(id, title, content) {
    const titleText = title.trim();
    const contentText = content.trim();
    if (!titleText || !contentText) {
      this.showNotification("Please fill in all required fields", "error");
      return;
    }

    const note = this.notes.find((n) => n.id === id);
    if (note) {
      note.title = titleText;
      note.content = contentText;
      this.saveNotes();
      this.render();
      this.showNotification("Note updated successfully!", "success");
    }
    this.editingNoteId = null;
  }

  cancelNoteEdit(id) {
    this.render();
    this.editingNoteId = null;
  }

  // Filter Management
  setFilter(filter) {
    this.currentFilter = filter;
    this.filterBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });
    this.render();
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case "active":
        return this.tasks.filter((t) => !t.completed);
      case "completed":
        return this.tasks.filter((t) => t.completed);
      default:
        return this.tasks;
    }
  }

  // Quote Management
  async loadQuote() {
    try {
      this.quoteText.textContent = "Loading...";
      this.quoteAuthor.textContent = "";

      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();

      this.quoteText.textContent = data.content;
      this.quoteAuthor.textContent = `- ${data.author}`;
    } catch (error) {
      this.quoteText.textContent =
        "The only way to do great work is to love what you do.";
      this.quoteAuthor.textContent = "- Steve Jobs";
    }
  }

  // Theme Management
  toggleTheme() {
    const newTheme = this.theme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("taskmate_theme", theme);

    const icon = this.themeToggle.querySelector("i");
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
  }

  // Utility Functions
  resetTaskForm() {
    this.taskTitle.value = "";
    this.taskDueDate.value = "";
    this.taskDescription.value = "";
    this.taskTitle.focus();
  }

  resetNoteForm() {
    this.noteTitle.value = "";
    this.noteContent.value = "";
    this.noteTitle.focus();
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  isOverdue(dueDate) {
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-circle"
                : "info-circle"
            }"></i>
            <span>${message}</span>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "#10b981"
                : type === "error"
                ? "#ef4444"
                : "#3b82f6"
            };
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Storage Functions
  saveTasks() {
    localStorage.setItem("taskmate_tasks", JSON.stringify(this.tasks));
  }

  saveNotes() {
    localStorage.setItem("taskmate_notes", JSON.stringify(this.notes));
  }

  // User Data Management
  openUserProfile() {
    this.loadUserDataToForm();
    this.userProfileModal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  closeUserProfile() {
    this.userProfileModal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  loadUserDataToForm() {
    this.userName.value = this.userData.name || "";
    this.userEmail.value = this.userData.email || "";
    this.userBio.value = this.userData.bio || "";
    this.defaultDueDate.value = this.userData.preferences?.defaultDueDate || 7;
    this.notificationsEnabled.checked =
      this.userData.preferences?.notificationsEnabled || false;
    this.autoSave.value = this.userData.preferences?.autoSave || 30;
  }

  saveUserProfile() {
    this.userData.name = this.userName.value.trim();
    this.userData.email = this.userEmail.value.trim();
    this.userData.bio = this.userBio.value.trim();
    this.userData.preferences = {
      defaultDueDate: parseInt(this.defaultDueDate.value) || 7,
      notificationsEnabled: this.notificationsEnabled.checked,
      autoSave: parseInt(this.autoSave.value) || 30,
    };

    this.saveUserData();
    this.setupAutoSave();
    this.closeUserProfile();
    this.showNotification("Profile saved successfully!", "success");
  }

  saveUserData() {
    localStorage.setItem("taskmate_user_data", JSON.stringify(this.userData));
  }

  setupAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    const interval = this.userData.preferences?.autoSave || 30;
    if (interval > 0) {
      this.autoSaveInterval = setInterval(() => {
        this.saveTasks();
        this.saveNotes();
        this.saveUserData();
      }, interval * 1000);
    }
  }

  exportUserData() {
    const exportData = {
      tasks: this.tasks,
      notes: this.notes,
      userData: this.userData,
      theme: this.theme,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `taskmate-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showNotification("Data exported successfully!", "success");
  }

  handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (importedData.tasks) this.tasks = importedData.tasks;
        if (importedData.notes) this.notes = importedData.notes;
        if (importedData.userData) this.userData = importedData.userData;
        if (importedData.theme) this.setTheme(importedData.theme);

        this.saveTasks();
        this.saveNotes();
        this.saveUserData();
        this.render();

        this.showNotification("Data imported successfully!", "success");
      } catch (error) {
        this.showNotification(
          "Invalid file format. Please select a valid backup file.",
          "error"
        );
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset file input
  }

  clearAllUserData() {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      this.tasks = [];
      this.notes = [];
      this.userData = {
        name: "",
        email: "",
        bio: "",
        preferences: {
          defaultDueDate: 7,
          notificationsEnabled: false,
          autoSave: 30,
        },
      };

      localStorage.removeItem("taskmate_tasks");
      localStorage.removeItem("taskmate_notes");
      localStorage.removeItem("taskmate_user_data");

      this.render();
      this.showNotification("All data cleared successfully!", "success");
    }
  }

  // Render Functions
  render() {
    this.renderTasks();
    this.renderNotes();
  }

  renderTasks() {
    const filteredTasks = this.getFilteredTasks();
    const activeCount = this.tasks.filter((t) => !t.completed).length;

    this.taskList.innerHTML = "";
    this.taskCount.textContent = `${activeCount} task${
      activeCount !== 1 ? "s" : ""
    } remaining`;

    if (filteredTasks.length === 0) {
      this.taskEmptyState.style.display = "block";
      this.taskList.style.display = "none";
    } else {
      this.taskEmptyState.style.display = "none";
      this.taskList.style.display = "block";

      filteredTasks.forEach((task) => {
        const li = this.createTaskElement(task);
        this.taskList.appendChild(li);
      });
    }

    // Show/hide clear completed button
    const completedCount = this.tasks.filter((t) => t.completed).length;
    this.clearCompletedBtn.style.display =
      completedCount > 0 ? "block" : "none";
  }

  renderNotes() {
    this.notesList.innerHTML = "";

    if (this.notes.length === 0) {
      this.notesEmptyState.style.display = "block";
      this.notesList.style.display = "none";
    } else {
      this.notesEmptyState.style.display = "none";
      this.notesList.style.display = "block";

      this.notes.forEach((note) => {
        const div = this.createNoteElement(note);
        this.notesList.appendChild(div);
      });
    }
  }

  createTaskElement(task) {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.dataset.taskId = task.id;

    const isOverdue = !task.completed && this.isOverdue(task.dueDate);

    li.innerHTML = `
            <div class="task-header">
                <div class="task-checkbox ${
                  task.completed ? "checked" : ""
                }" onclick="taskMate.toggleTask(${task.id})">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ""}
                </div>
                <div class="task-content">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    ${
                      task.description
                        ? `<div class="task-description">${this.escapeHtml(
                            task.description
                          )}</div>`
                        : ""
                    }
                    <div class="task-meta">
                        <div class="task-due-date ${
                          isOverdue ? "overdue" : ""
                        }">
                            <i class="fas fa-calendar"></i>
                            Due: ${this.formatDate(task.dueDate)}
                            ${isOverdue ? " (Overdue)" : ""}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="taskMate.editTask(${
                      task.id
                    })" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="taskMate.deleteTask(${
                      task.id
                    })" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

    return li;
  }

  createNoteElement(note) {
    const div = document.createElement("div");
    div.className = "note-item";
    div.dataset.noteId = note.id;

    div.innerHTML = `
            <div class="note-header">
                <div class="note-content">
                    <div class="note-title">${this.escapeHtml(note.title)}</div>
                    <div class="note-content">${this.escapeHtml(
                      note.content
                    )}</div>
                    <div class="note-meta">
                        <i class="fas fa-clock"></i>
                        Created: ${this.formatDate(note.createdAt)}
                    </div>
                </div>
                <div class="note-actions">
                    <button class="edit-btn" onclick="taskMate.editNote(${
                      note.id
                    })" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="taskMate.deleteNote(${
                      note.id
                    })" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

    return div;
  }
}

// Initialize the app
const taskMate = new TaskMate();

// Add CSS animations for notifications
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// --- Authentication Logic ---
(function() {
  const authModal = document.getElementById("authModal");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");
  const loginError = document.getElementById("loginError");
  const signupError = document.getElementById("signupError");
  const authTitle = document.getElementById("authTitle");
  const logoutBtn = document.getElementById("logoutBtn");

  // Helper: get/set user in localStorage
  function getUsers() {
    return JSON.parse(localStorage.getItem("taskmate_users") || "{}");
  }
  function setUsers(users) {
    localStorage.setItem("taskmate_users", JSON.stringify(users));
  }
  function setLoggedIn(email) {
    localStorage.setItem("taskmate_logged_in", email);
  }
  function getLoggedIn() {
    return localStorage.getItem("taskmate_logged_in");
  }
  function logout() {
    localStorage.removeItem("taskmate_logged_in");
    window.location.reload();
  }

  // Show/hide modal
  function showAuthModal() {
    authModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
  function hideAuthModal() {
    authModal.style.display = "none";
    document.body.style.overflow = "";
  }

  // Switch forms
  showSignup.onclick = (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    authTitle.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
    loginError.textContent = "";
    signupError.textContent = "";
  };
  showLogin.onclick = (e) => {
    e.preventDefault();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    authTitle.innerHTML = '<i class="fas fa-user-lock"></i> Login';
    loginError.textContent = "";
    signupError.textContent = "";
  };

  // Signup logic
  signupForm.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document
      .getElementById("signupEmail")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("signupPassword").value;
    if (!name || !email || !password) {
      signupError.textContent = "All fields are required.";
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      signupError.textContent = "Please enter a valid email.";
      return;
    }
    if (password.length < 6) {
      signupError.textContent = "Password must be at least 6 characters.";
      return;
    }
    const users = getUsers();
    if (users[email]) {
      signupError.textContent = "Account already exists. Please login.";
      return;
    }
    users[email] = { name, email, password };
    setUsers(users);
    setLoggedIn(email);
    signupError.textContent = "";
    // Clear only this user's data for a fresh start
    localStorage.removeItem(`taskmate_tasks_${email}`);
    localStorage.removeItem(`taskmate_notes_${email}`);
    localStorage.removeItem(`taskmate_user_data_${email}`);
    localStorage.removeItem(`taskmate_theme_${email}`);
    hideAuthModal();
    window.location.reload(); // Reload to ensure a fresh state
  };

  // Login logic
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const email = document
      .getElementById("loginEmail")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("loginPassword").value;
    if (!email || !password) {
      loginError.textContent = "All fields are required.";
      return;
    }
    const users = getUsers();
    if (!users[email]) {
      loginError.textContent = "Account not found. Please sign up.";
      return;
    }
    if (users[email].password !== password) {
      loginError.textContent = "Incorrect password.";
      return;
    }
    setLoggedIn(email);
    loginError.textContent = "";
    hideAuthModal();
  };

  // Block app until logged in
  function blockAppIfNotLoggedIn() {
    if (!getLoggedIn()) {
      showAuthModal();
      // Optionally, blur or block the rest of the app here
    } else {
      hideAuthModal();
    }
  }

  // On page load
  blockAppIfNotLoggedIn();

  if (logoutBtn) {
    logoutBtn.onclick = logout;
  }
})();

// --- End Authentication Logic ---

// --- User-specific localStorage helpers ---
function getUserKey(base) {
  const email = localStorage.getItem("taskmate_logged_in");
  return email ? `${base}_${email}` : base;
}

// --- Patch TaskMate class for user-specific data ---
const originalTaskMate = TaskMate;
TaskMate = class extends originalTaskMate {
  constructor() {
    const email = localStorage.getItem("taskmate_logged_in");
    super();
    // Overwrite with user-specific data
    this.tasks =
      JSON.parse(localStorage.getItem(getUserKey("taskmate_tasks"))) || [];
    this.notes =
      JSON.parse(localStorage.getItem(getUserKey("taskmate_notes"))) || [];
    this.userData = JSON.parse(
      localStorage.getItem(getUserKey("taskmate_user_data"))
    ) || {
      name: "",
      email: "",
      bio: "",
      preferences: {
        defaultDueDate: 7,
        notificationsEnabled: false,
        autoSave: 30,
      },
    };
    this.theme = localStorage.getItem(getUserKey("taskmate_theme")) || "light";
    this.setTheme(this.theme);
  }

  saveTasks() {
    localStorage.setItem(
      getUserKey("taskmate_tasks"),
      JSON.stringify(this.tasks)
    );
  }
  saveNotes() {
    localStorage.setItem(
      getUserKey("taskmate_notes"),
      JSON.stringify(this.notes)
    );
  }
  saveUserData() {
    localStorage.setItem(
      getUserKey("taskmate_user_data"),
      JSON.stringify(this.userData)
    );
  }
  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(getUserKey("taskmate_theme"), theme);
    const icon = this.themeToggle.querySelector("i");
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
  }
  clearAllUserData() {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      this.tasks = [];
      this.notes = [];
      this.userData = {
        name: "",
        email: "",
        bio: "",
        preferences: {
          defaultDueDate: 7,
          notificationsEnabled: false,
          autoSave: 30,
        },
      };
      localStorage.removeItem(getUserKey("taskmate_tasks"));
      localStorage.removeItem(getUserKey("taskmate_notes"));
      localStorage.removeItem(getUserKey("taskmate_user_data"));
      this.render();
      this.showNotification("All data cleared successfully!", "success");
    }
  }
};
// --- End user-specific patch ---
