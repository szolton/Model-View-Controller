// public/js/login.js

// Already registered user handler
const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const email = document.querySelector("#email-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();

  if (email && password) {
    try {
      // Send a POST request to the login API endpoint
      const response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error('Failed to login:', response.status, response.statusText);
        alert('Login failed. Please check your credentials.');
        return;
      }

      const data = await response.json();
      if (data.user) {
        // Save username to local storage upon successful login
        localStorage.setItem('username', data.user.name);

        // Redirect or handle successful login
        document.location.replace('/dashboard'); // Example: Redirect to dashboard
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  } else {
    alert('Please enter email and password.');
  }
};

// Event Listener for login form submission
document.querySelector(".login-form").addEventListener("submit", loginFormHandler);

// Function to check if username is saved in local storage
function checkSavedUsername() {
  const savedUsername = localStorage.getItem('username');

  if (savedUsername) {
    console.log('Username found in local storage:', savedUsername);
    // Example: Display the username somewhere in the UI
    // document.querySelector('#username-display').textContent = savedUsername;
  } else {
    console.log('No username found in local storage');
  }
}

// Call this function wherever needed to check for saved username
checkSavedUsername();
