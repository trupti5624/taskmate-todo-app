# TaskMate – A Simple To-Do & Notes App

A modern, responsive web application for managing tasks and notes with a beautiful UI and powerful features.

![TaskMate App](https://img.shields.io/badge/Status-Complete-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎯 Features

### ✅ Must-Have Features

- **Add Tasks**: Create tasks with title, due date, and optional description
- **Task Management**: Mark tasks as complete/incomplete with visual feedback
- **Delete Tasks**: Remove tasks with smooth animations
- **Local Storage**: All data persists between browser sessions
- **Task List**: Clean, organized display of all tasks

### 🚀 Bonus Features

- **Edit Tasks**: Modify existing tasks inline
- **Notes Section**: Create and manage personal notes
- **Quote of the Day**: Daily inspirational quotes from [quotable.io](https://api.quotable.io/random)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Light/Dark Mode**: Toggle between themes with persistent preference
- **Task Filtering**: View All, Active, or Completed tasks
- **Clear Completed**: Bulk remove finished tasks
- **Due Date Tracking**: Visual indicators for overdue tasks
- **Beautiful Animations**: Smooth transitions and hover effects
- **User Profiles**: Personal information and preferences management
- **Data Export/Import**: Backup and restore all your data
- **Auto-Save**: Automatic data saving with configurable intervals
- **Default Due Dates**: Set default due dates for new tasks
- **Data Management**: Clear all data with confirmation
- **Authentication**: Login/Signup modal, user accounts, and secure access
- **Logout**: Logout button in the profile modal

## 🔐 Authentication & User Accounts

- **Login/Signup Modal**: Users must log in or sign up before using the app.
- **Account Storage**: User credentials (email, password, name) are securely stored in localStorage.
- **Session Persistence**: Once logged in, users stay logged in until they log out.
- **Logout**: Click the "Logout" button in the profile modal to end your session.
- **Validation**: All fields are validated for correctness and security.
- **Multi-User**: Multiple accounts can be created and used on the same device/browser.

## 🎨 Design Features

- **Modern UI**: Clean, card-based design with gradients
- **Theme Support**: Light and dark mode with automatic preference saving
- **Responsive Layout**: Adapts to any screen size
- **Smooth Animations**: Slide-in effects, hover states, and transitions
- **Intuitive Icons**: Font Awesome icons for better UX
- **Color-coded Elements**: Visual feedback for different states

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)**: Vanilla JS with classes and modern syntax
- **Local Storage API**: Data persistence
- **Fetch API**: External quote integration
- **Font Awesome**: Beautiful icons

## 📦 Installation & Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Quick Start

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Start Using** TaskMate immediately!

### File Structure

```
TaskMate/
├── index.html          # Main HTML structure
├── style.css           # Complete CSS styling with themes
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## 🚀 How to Use

### Authentication

- When you open the app, a login/signup modal will appear.
- **Sign up** if you don't have an account, or **log in** if you do.
- After logging in, you can use all features of the app.
- To log out, open your profile and click the **Logout** button.

### Adding Tasks

1. Enter a task title in the "Enter task title..." field
2. Select a due date using the date picker
3. Optionally add a description
4. Click "Add Task" or press Enter

### Managing Tasks

- **Complete**: Click the circular checkbox next to any task
- **Edit**: Click the pencil icon to modify task details
- **Delete**: Click the trash icon to remove a task
- **Filter**: Use the filter buttons to view different task states

### Using Notes

1. Enter a note title
2. Write your note content
3. Click "Add Note" to save
4. Edit or delete notes using the action buttons

### Theme Switching

- Click the moon/sun icon in the header to toggle between light and dark modes
- Your preference is automatically saved

### Quote of the Day

- View the daily inspirational quote at the top of the app
- Click the refresh button to get a new quote

### User Profile & Data Management

- **Access Profile**: Click the user icon in the header to open your profile
- **Personal Information**: Add your name, email, and bio
- **Preferences**: Set default due dates, enable notifications, and configure auto-save
- **Export Data**: Download a backup of all your tasks, notes, and settings
- **Import Data**: Restore your data from a previously exported backup file
- **Clear All Data**: Remove all data with confirmation (use with caution)
- **Logout**: Click the logout button to end your session

## 🎯 Key Features Explained

### Task Management

- **Due Date Tracking**: Tasks show their due date and highlight overdue items
- **Visual States**: Completed tasks are visually distinct with strikethrough text
- **Bulk Actions**: Clear all completed tasks with one click
- **Smart Filtering**: View tasks by status (All, Active, Completed)

### Notes System

- **Simple Notes**: Quick note-taking with title and content
- **Persistent Storage**: Notes are saved locally and persist between sessions
- **Easy Editing**: Inline editing with save/cancel options

### Data Persistence & Security

- **Local Storage**: All data (tasks, notes, user accounts, preferences) is saved to your browser's local storage
- **No Server Required**: Works completely offline
- **Cross-Session**: Data persists when you close and reopen the browser
- **Authentication**: Only logged-in users can access their data

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Friendly**: Great experience on tablets
- **Desktop Optimized**: Full-featured desktop experience

## 🔧 Customization

### Modifying Colors

Edit the CSS variables in `style.css`:

```css
:root {
  --accent-color: #3b82f6; /* Primary accent color */
  --success-color: #10b981; /* Success/green color */
  --danger-color: #ef4444; /* Danger/red color */
  /* ... more variables */
}
```

### Adding Features

The modular JavaScript structure makes it easy to add new features:

- Add new task properties in the `addTask()` method
- Create new filter options in `getFilteredTasks()`
- Extend the UI in the HTML structure

## 🌐 Browser Compatibility

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## 📱 Mobile Support

- **Touch-Friendly**: Large touch targets for mobile devices
- **Responsive Layout**: Adapts to different screen sizes
- **Mobile Optimized**: Optimized for mobile browsers

## 🔒 Privacy & Security

- **Local Storage**: All data stays on your device
- **No External Tracking**: No analytics or tracking scripts
- **Offline Capable**: Works without internet connection
- **No Data Collection**: Your data never leaves your browser

## 🐛 Troubleshooting

### Common Issues

**Tasks/Notes not saving:**

- Check if your browser supports local storage
- Try clearing browser cache and reloading

**Quote not loading:**

- Check your internet connection
- The app will show a fallback quote if the API is unavailable

**Styling issues:**

- Ensure all CSS files are properly linked
- Check browser console for any errors

## 🤝 Contributing

Feel free to contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Font Awesome** for the beautiful icons
- **Quotable.io** for the inspirational quotes API
- **Modern CSS** techniques for the beautiful design

## 📞 Support

If you have any questions or need help:

- Create an issue in the repository
- Check the troubleshooting section above
- Review the code comments for implementation details

---

**Enjoy organizing your life with TaskMate! 🎉**
