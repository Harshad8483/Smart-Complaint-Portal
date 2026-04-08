const API = "http://localhost:3000/api";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert("Login failed: " + (data.message || "Invalid credentials"));
    }
  } catch (err) {
    console.error(err);
    alert("Connection error!");
  }
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "index.html";
    } else {
      alert("Registration failed: " + (data.message || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("Connection error!");
  }
}

async function fetchComplaints() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${API}/complaints`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const complaints = await res.json();
    
    const list = document.getElementById("list");
    if (!list) return;

    list.innerHTML = "";
    
    if (complaints.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; color: #94a3b8; padding: 2rem;">
          <i class="fa-solid fa-folder-open fa-3x" style="margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>No active complaints found. Submit one to get started.</p>
        </div>`;
      return;
    }

    complaints.forEach(c => {
      // Determine Progress state
      const status = c.status || 'Pending';
      let step1 = '', step2 = '', step3 = '', fillWidth = '0%';
      
      if (status === 'Pending') {
        step1 = 'active'; fillWidth = '0%';
      } else if (status === 'In Progress') {
        step1 = 'completed'; step2 = 'active'; fillWidth = '50%';
      } else if (status === 'Resolved') {
        step1 = 'completed'; step2 = 'completed'; step3 = 'completed'; fillWidth = '100%';
      }

      const el = document.createElement("div");
      el.className = "complaint-item";
      el.style.marginBottom = "1.5rem";
      
      el.innerHTML = `
        <div class="complaint-header">
          <span class="complaint-category"><i class="fa-solid fa-tag"></i> ${c.category || 'General'}</span>
          <span class="complaint-status" style="font-weight: 600; color: ${status === 'Resolved' ? '#10B981' : '#6366f1'}">${status}</span>
        </div>
        <div class="complaint-desc">${c.description || 'No description provided.'}</div>
        
        <div class="progress-tracker">
          <div class="timeline-fill" style="width: ${fillWidth};"></div>
          
          <div class="tracker-step ${step1}">
            <div class="tracker-dot"><i class="fa-solid ${step1 === 'completed' ? 'fa-check' : 'fa-clipboard-list'}"></i></div>
            <div class="tracker-label">Submitted</div>
          </div>
          
          <div class="tracker-step ${step2}">
            <div class="tracker-dot"><i class="fa-solid ${step2 === 'completed' ? 'fa-check' : 'fa-spinner'}"></i></div>
            <div class="tracker-label">Tracking Progress</div>
          </div>
          
          <div class="tracker-step ${step3}">
            <div class="tracker-dot"><i class="fa-solid ${step3 === 'completed' ? 'fa-check' : 'fa-flag-checkered'}"></i></div>
            <div class="tracker-label">Resolution Complete</div>
          </div>
        </div>
      `;
      list.appendChild(el);
    });
  } catch (err) {
    console.error("Error fetching complaints", err);
    document.getElementById("list").innerHTML = '<p style="color: #ef4444; padding: 1rem;">Failed to load complaints.</p>';
  }
}

async function createComplaint() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    return;
  }

  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (!category || !description) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch(`${API}/complaints`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ category, description })
    });

    if (res.ok) {
      document.getElementById("category").value = "";
      document.getElementById("description").value = "";
      alert("Complaint submitted successfully!");
      fetchComplaints();
    } else {
      alert("Failed to submit complaint");
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting complaint");
  }
}

// Auto-run if on dashboard
if (window.location.pathname.includes("dashboard.html")) {
  fetchComplaints();
}
