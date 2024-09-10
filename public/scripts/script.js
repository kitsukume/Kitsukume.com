// Login modal functionality
const modal = document.getElementById("loginModal");
const loginButton = document.getElementById("loginButton");
const closeButton = document.querySelector(".close");
const loginForm = document.getElementById("loginForm");

if (modal && loginButton && closeButton && loginForm) {
  loginButton.onclick = function() {
    modal.style.display = "block";
  }

  closeButton.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target === modal) {
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
      const loginError = document.getElementById("loginError");
      if (loginError) {
        loginError.innerText = error.message || "An error occurred.";
        loginError.style.display = "block";
      }
    }
  }
}

// Assign/Remove role functionality
document.addEventListener('DOMContentLoaded', () => {
  const actionType = document.getElementById('actionType');
  const removeButton = document.getElementById('removeButton');
  const assignButton = document.getElementById('assignButton');
  const form = document.getElementById('assignRoleForm');
  const message = document.getElementById('message');

  if (actionType && removeButton && assignButton && form && message) {
    async function submitForm(action) {
      const formData = new FormData(form);
      formData.set('process', action);

      const data = Object.fromEntries(formData.entries());
      

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        

        if (response.ok) {
          const result = await response.json();
          
          message.textContent = result.message || 'Operation successful';

          const usersTable = document.getElementById('usersTable');
          if (usersTable) {
            if (result.users) {
              usersTable.innerHTML = ''; // Clear existing rows
              result.users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                  <td>${user.id}</td>
                  <td>${user.email}</td>
                  <td>${user.roles.join(', ')}</td>
                `;
                usersTable.appendChild(row);
              });
            } else {
              usersTable.innerHTML = '<tr><td colspan="3">No users found</td></tr>';
            }
          }
        } else {
          const error = await response.text();
          message.textContent = error || 'Failed to process request';
        }
      } catch (error) {
        console.error('Error:', error);
        message.textContent = 'Failed to process request';
      }
    }

    removeButton.addEventListener('click', (e) => {
      e.preventDefault();
      submitForm('remove');
    });

    assignButton.addEventListener('click', (e) => {
      e.preventDefault();
      submitForm('assign');
    });
  }
});




document.addEventListener('DOMContentLoaded', function() {
  var selected = document.querySelector('.select-selected');
  var items = document.querySelector('.select-items');
  var select = document.getElementById('roleName');

  // Initially hide the dropdown items
  items.style.display = 'none';

  selected.addEventListener('click', function(e) {
    e.stopPropagation();
    // Toggle the dropdown menu
    items.style.display = items.style.display === 'none' ? 'block' : 'none';
  });

  items.addEventListener('click', function(e) {
    if (e.target && e.target.nodeName === 'DIV') {
      // Set the selected item text
      selected.innerHTML = e.target.innerHTML;
      // Update the hidden select element's value
      select.value = e.target.getAttribute('data-value');
      // Hide the dropdown menu
      items.style.display = 'none';
    }
  });

  document.addEventListener('click', function(e) {
    // Close the dropdown if the user clicks outside of it
    if (!e.target.closest('.custom-select')) {
      items.style.display = 'none';
    }
  });
});
