const modal = document.getElementById("loginModal");
const loginButton = document.getElementById("loginButton");
const closeButton = document.querySelector(".close");
const loginForm = document.getElementById("loginForm");

loginButton.onclick = function() {
  modal.style.display = "block";
}

closeButton.onclick = function() {
  modal.style.display = "none";
}


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

loginForm.onsubmit = async function(event) {
  event.preventDefault(); 

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.status === 401) {
      throw new Error('Unauthorized: Invalid credentials');
    }

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text);
    }

    if (data.success) {

      modal.style.display = "none";
      window.location.href = '/dashboard';
    } else {
      alert("Login failed: " + data.message);
    }
  } catch (error) {
    console.error("Error during login", error);
    document.getElementById("loginError").innerText = error.message || "An error occurred.";
    document.getElementById("loginError").style.display = "block";
  }
};
