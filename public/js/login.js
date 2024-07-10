// public/js/login.js

// Already registered user handler
const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const email = document.querySelector("#email-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();

  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        document.location.replace(data.redirect);
      } else {
        alert(data.message);
      }
    } else {
      alert(response.statusText);
    }
  }
};


// Event Listeners
document.querySelector(".login-form").addEventListener("submit", loginFormHandler);
