const tutorGrid = document.querySelector("#tutorGrid");
const subjectButtons = document.querySelectorAll(".subject-pill");
const searchInput = document.querySelector("#searchInput");
const levelSelect = document.querySelector("#levelSelect");
const protectedPages = ["booking.html", "notes.html", "profile.html", "sessions.html"];
const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Session state variables
let isLoggedIn = localStorage.getItem("studyMeshLoggedIn") === "true";
let savedProfile = JSON.parse(localStorage.getItem("studyMeshProfile") || "null");
const studyMeshToken = localStorage.getItem("studyMeshToken");

function goToLogin() {
  const next = encodeURIComponent(`${currentPage}${window.location.search}`);
  window.location.href = `login.html?next=${next}`;
}

function handleLogout() {
  localStorage.setItem("studyMeshLoggedIn", "false");
  localStorage.removeItem("studyMeshToken");
  localStorage.removeItem("studyMeshProfile");
  isLoggedIn = false;
  savedProfile = null;
  if (protectedPages.includes(currentPage)) {
    goToLogin();
  } else {
    window.location.href = "index.html";
  }
}

function updateLoginLinks() {
  document.querySelectorAll(".login-link").forEach((link) => {
    if (!isLoggedIn) {
      link.textContent = "Log in";
      link.href = "login.html";
      return;
    }
    link.textContent = "Log out";
    link.href = "#";
    // Avoid multiple listeners
    if (!link.dataset.hasLogoutListener) {
      link.dataset.hasLogoutListener = "true";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        handleLogout();
      });
    }
  });
}

function updateLoggedInUI() {
  if (!isLoggedIn) return;

  // Update Hero actions (Sign up / Log in buttons) on homepage
  const heroActions = document.querySelector(".hero-actions");
  if (heroActions) {
    heroActions.innerHTML = `
      <a class="primary-button" href="profile.html">Go to Profile</a>
      <a class="secondary-button light-button" href="sessions.html">Track Sessions</a>
    `;
  }

  // Update tutor preview texts on homepage
  const tutorPreviewEyebrow = document.querySelector("#tutorPreviewEyebrow");
  const tutorPreviewTitle = document.querySelector("#tutorPreviewTitle");
  const tutorPreviewSubtitle = document.querySelector("#tutorPreviewSubtitle");

  if (tutorPreviewEyebrow) tutorPreviewEyebrow.textContent = "Tutor directory";
  if (tutorPreviewTitle) tutorPreviewTitle.textContent = "Book a session with a peer tutor";
  if (tutorPreviewSubtitle) tutorPreviewSubtitle.textContent = "Select a tutor below to book a session.";
}

async function checkSession() {
  if (studyMeshToken) {
    try {
      const response = await fetch("/api/verify", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${studyMeshToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("studyMeshLoggedIn", "true");
        localStorage.setItem("studyMeshProfile", JSON.stringify(data.profile));
        isLoggedIn = true;
        savedProfile = data.profile;
        updateLoginLinks();
        updateLoggedInUI();
        if (currentPage === "profile.html") {
          renderProfilePage();
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Session verification failed:", error);
    }
  } else {
    if (isLoggedIn) {
      handleLogout();
    } else if (protectedPages.includes(currentPage)) {
      goToLogin();
    }
  }
}

// Initial session check
if (protectedPages.includes(currentPage) && !studyMeshToken) {
  goToLogin();
} else {
  checkSession();
}

updateLoginLinks();
updateLoggedInUI();

document.querySelectorAll('a[href^="booking.html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (isLoggedIn || studyMeshToken) return;
    event.preventDefault();
    const next = encodeURIComponent(link.getAttribute("href"));
    window.location.href = `login.html?next=${next}`;
  });
});

function filterTutors() {
  if (!tutorGrid) return;

  const activeSubject = document.querySelector(".subject-pill.active")?.dataset.subject || "all";
  const query = (searchInput?.value || "").trim().toLowerCase();
  const level = levelSelect?.value || "all";

  tutorGrid.querySelectorAll(".tutor-card").forEach((card) => {
    const subjectMatch = activeSubject === "all" || card.dataset.subject === activeSubject;
    const levelMatch = level === "all" || card.dataset.level === level;
    const text = `${card.textContent} ${card.dataset.keywords}`.toLowerCase();
    const queryMatch = !query || text.includes(query);
    card.classList.toggle("hidden", !(subjectMatch && levelMatch && queryMatch));
  });
}

subjectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    subjectButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterTutors();
  });
});

searchInput?.addEventListener("input", filterTutors);
levelSelect?.addEventListener("change", filterTutors);

const bookingForm = document.querySelector("#bookingForm");
const bookingMessage = document.querySelector("#bookingMessage");
const tutorSelect = document.querySelector("#tutorSelect");
const subjectSelect = document.querySelector("#subjectSelect");
const dateInput = document.querySelector("#dateInput");
const placeSelect = document.querySelector("#placeSelect");

if (tutorSelect) {
  const tutorName = new URLSearchParams(window.location.search).get("tutor");
  if (tutorName) {
    [...tutorSelect.options].forEach((option) => {
      option.selected = option.value === tutorName || option.text === tutorName;
    });
  }
}

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const selectedTime = formData.get("time");
  const tutor = tutorSelect?.value || "your tutor";
  const session = {
    tutor,
    subject: subjectSelect?.value || "General study",
    date: dateInput?.value || "Selected date",
    time: selectedTime,
    place: placeSelect?.value || "Study Mesh room"
  };
  const savedSessions = JSON.parse(localStorage.getItem("studyMeshSessions") || "[]");
  savedSessions.unshift(session);
  localStorage.setItem("studyMeshSessions", JSON.stringify(savedSessions.slice(0, 6)));
  bookingMessage.innerHTML = `Booked with ${tutor} at ${selectedTime}. <a href="sessions.html">View session tracker</a>`;
  bookingForm.reset();
});

const sessionTracker = document.querySelector("#sessionTracker");

function formatDate(value) {
  if (!value || value === "Selected date") return value;
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

if (sessionTracker) {
  const savedSessions = JSON.parse(localStorage.getItem("studyMeshSessions") || "[]");
  savedSessions.forEach((session) => {
    const card = document.createElement("article");
    card.className = "tracker-card panel";
    card.innerHTML = `
      <div>
        <span class="status-chip">Confirmed</span>
        <h2>${session.subject} tutoring</h2>
      </div>
      <dl>
        <div><dt>Tutor</dt><dd>${session.tutor}</dd></div>
        <div><dt>Schedule</dt><dd>${formatDate(session.date)}, ${session.time}</dd></div>
        <div><dt>Place</dt><dd>${session.place}</dd></div>
        <div><dt>Subject</dt><dd>${session.subject}</dd></div>
      </dl>
    `;
    sessionTracker.prepend(card);
  });
}

const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "Logging in...";
  
  const emailInput = loginForm.querySelector('input[type="email"]');
  const passwordInput = loginForm.querySelector('input[type="password"]');
  const email = emailInput?.value.trim().toLowerCase();
  const password = passwordInput?.value;

  if (!email || !password) {
    loginMessage.textContent = "Please fill in all fields.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("studyMeshUsers") || "{}");
  const registeredUser = users[email];

  if (!registeredUser) {
    loginMessage.textContent = "No account found with this email. Please sign up.";
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        hash: registeredUser.hash,
        profile: registeredUser.profile
      })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("studyMeshToken", data.token);
      localStorage.setItem("studyMeshLoggedIn", "true");
      localStorage.setItem("studyMeshProfile", JSON.stringify(data.profile));
      
      loginMessage.textContent = "Logged in successfully. Redirecting...";
      const next = new URLSearchParams(window.location.search).get("next") || "profile.html";
      window.setTimeout(() => {
        window.location.href = next;
      }, 800);
    } else {
      const data = await response.json();
      loginMessage.textContent = data.error || "Login failed. Check your password.";
    }
  } catch (error) {
    console.error("Login request failed:", error);
    loginMessage.textContent = "Server error. Please try again.";
  }
});

const signupForm = document.querySelector("#signupForm");
const signupMessage = document.querySelector("#signupMessage");

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupMessage.textContent = "Creating profile...";

  const email = document.querySelector("#signupEmail").value.trim().toLowerCase();
  const password = document.querySelector("#signupPassword").value;

  const profile = {
    name: document.querySelector("#signupName").value.trim(),
    grade: document.querySelector("#signupGrade").value.trim(),
    email: email,
    bio: document.querySelector("#signupBio").value.trim(),
    goals: splitList(document.querySelector("#signupGoals").value),
    tutoring: splitList(document.querySelector("#signupTutoring").value),
    availability: document.querySelector("#signupAvailability").value.trim(),
    linkedin: document.querySelector("#signupLinkedin").value.trim()
  };

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password, profile })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("studyMeshToken", data.token);
      localStorage.setItem("studyMeshLoggedIn", "true");
      localStorage.setItem("studyMeshProfile", JSON.stringify(data.profile));

      const users = JSON.parse(localStorage.getItem("studyMeshUsers") || "{}");
      users[email] = {
        hash: data.hash,
        profile: data.profile
      };
      localStorage.setItem("studyMeshUsers", JSON.stringify(users));

      signupMessage.textContent = "Profile created successfully. Opening your profile...";
      window.setTimeout(() => {
        window.location.href = "profile.html";
      }, 700);
    } else {
      const data = await response.json();
      signupMessage.textContent = data.error || "Failed to create profile.";
    }
  } catch (error) {
    console.error("Signup request failed:", error);
    signupMessage.textContent = "Server error. Please try again.";
  }
});

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
}

function renderList(selector, items, fallback) {
  const list = document.querySelector(selector);
  if (!list) return;
  const values = items?.length ? items : fallback;
  list.innerHTML = "";
  values.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderTags(selector, items, fallback) {
  const row = document.querySelector(selector);
  if (!row) return;
  const values = items?.length ? items : fallback;
  row.innerHTML = "";
  values.forEach((item) => {
    const tag = document.createElement("span");
    tag.textContent = item;
    row.appendChild(tag);
  });
}

function renderProfilePage() {
  const profile = JSON.parse(localStorage.getItem("studyMeshProfile") || "null");
  if (!profile) return;
  const name = profile.name || "Study Mesh Student";
  const grade = profile.grade || "Student";
  const availability = profile.availability || "Availability not set";
  const tutoring = profile.tutoring?.length ? profile.tutoring.join(", ") : "Peer tutoring";
  const linkedin = profile.linkedin || "https://www.linkedin.com";

  setText("#profileInitial", name.charAt(0).toUpperCase());
  setText("#profileName", name);
  setText("#profileBio", `${grade} learner. ${profile.bio || "Ready to learn and tutor with Study Mesh."}`);
  setText("#profileOffer", `${name} can tutor ${tutoring}. Available: ${availability}.`);
  setText("#profileContact", `Contact ${name} for tutoring history, study projects, and peer mentor experience.`);
  setText("#profileLinkedinText", linkedin.replace(/^https?:\/\//, ""));

  renderList("#profileGoals", profile.goals, ["Add learning goals from the sign up page"]);
  renderTags("#profileTags", profile.tutoring, ["Peer mentor"]);

  const linkedinButton = document.querySelector("#profileLinkedinButton");
  const linkedinCard = document.querySelector("#profileLinkedinCard");
  if (linkedinButton) linkedinButton.href = linkedin;
  if (linkedinCard) linkedinCard.href = linkedin;

  // Render stats
  const sessionsCount = profile.sessionsCount !== undefined ? profile.sessionsCount : 0;
  const rating = profile.rating !== undefined ? profile.rating : 0;
  const points = profile.points !== undefined ? profile.points : 0;
  const badgesCount = profile.badgesCount !== undefined ? profile.badgesCount : 0;

  setText("#statSessions", sessionsCount);
  setText("#statRating", rating === 0 ? "0" : rating.toFixed(1));
  setText("#statPoints", points);
  setText("#statBadges", badgesCount);

  // Render badges list
  const badgeRow = document.querySelector("#profileBadges");
  if (badgeRow) {
    badgeRow.innerHTML = "";
    const badges = profile.badges || [];
    if (badges.length === 0) {
      badgeRow.innerHTML = '<span class="no-badges" style="color: var(--text-muted); font-size: 0.9rem;">No badges earned yet</span>';
    } else {
      badges.forEach((badge) => {
        const span = document.createElement("span");
        span.textContent = badge;
        badgeRow.appendChild(span);
      });
    }
  }
}

if (currentPage === "profile.html" && savedProfile) {
  renderProfilePage();
}

const editProfileButton = document.querySelector("#editProfileButton");
const profileEditPanel = document.querySelector("#profileEditPanel");
const profileEditForm = document.querySelector("#profileEditForm");
const profileEditMessage = document.querySelector("#profileEditMessage");

function fillProfileEditForm(profile) {
  if (!profileEditForm) return;
  document.querySelector("#editName").value = profile?.name || "Alex Rivera";
  document.querySelector("#editGrade").value = profile?.grade || "Junior college";
  document.querySelector("#editEmail").value = profile?.email || "alex@school.edu.sg";
  document.querySelector("#editBio").value = profile?.bio || "Junior College learner, algebra tutor, and weekend study group host.";
  document.querySelector("#editGoals").value = (profile?.goals || ["Improve H2 Mathematics timed practice scores"]).join(", ");
  document.querySelector("#editTutoring").value = (profile?.tutoring || ["Lower Secondary Mathematics", "E-Math", "beginner HTML"]).join(", ");
  document.querySelector("#editAvailability").value = profile?.availability || "Monday, Wednesday, Saturday";
  document.querySelector("#editLinkedin").value = profile?.linkedin || "https://www.linkedin.com/in/alex-rivera-study-mesh";
}

editProfileButton?.addEventListener("click", () => {
  fillProfileEditForm(savedProfile);
  profileEditPanel?.classList.toggle("hidden");
  profileEditPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
});

profileEditForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  profileEditMessage.textContent = "Saving changes...";
  const updatedProfile = {
    name: document.querySelector("#editName").value.trim(),
    grade: document.querySelector("#editGrade").value.trim(),
    email: document.querySelector("#editEmail").value.trim(),
    bio: document.querySelector("#editBio").value.trim(),
    goals: splitList(document.querySelector("#editGoals").value),
    tutoring: splitList(document.querySelector("#editTutoring").value),
    availability: document.querySelector("#editAvailability").value.trim(),
    linkedin: document.querySelector("#editLinkedin").value.trim()
  };

  const token = localStorage.getItem("studyMeshToken");
  if (!token) {
    profileEditMessage.textContent = "Error: Session expired. Please log in again.";
    handleLogout();
    return;
  }

  try {
    const response = await fetch("/api/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ profile: updatedProfile })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("studyMeshToken", data.token);
      localStorage.setItem("studyMeshProfile", JSON.stringify(data.profile));

      // Update mock database in localStorage
      const email = data.profile.email.toLowerCase();
      const users = JSON.parse(localStorage.getItem("studyMeshUsers") || "{}");
      if (users[email]) {
        users[email].profile = data.profile;
        localStorage.setItem("studyMeshUsers", JSON.stringify(users));
      }

      profileEditMessage.textContent = "Profile details saved.";
      window.setTimeout(() => window.location.reload(), 500);
    } else {
      const data = await response.json();
      profileEditMessage.textContent = data.error || "Failed to update profile details.";
    }
  } catch (error) {
    console.error("Profile edit request failed:", error);
    profileEditMessage.textContent = "Server error. Please try again.";
  }
});

const paymentModal = document.querySelector("#paymentModal");
const closePaymentModal = document.querySelector("#closePaymentModal");
const paymentSummary = document.querySelector("#paymentSummary");
const paymentMessage = document.querySelector("#paymentMessage");

document.querySelectorAll(".buy-note-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (!isLoggedIn) {
      goToLogin();
      return;
    }
    paymentSummary.textContent = `${button.dataset.note} costs ${button.dataset.price}. Choose how you want to pay.`;
    paymentMessage.textContent = "";
    paymentModal?.classList.remove("hidden");
  });
});

closePaymentModal?.addEventListener("click", () => {
  paymentModal?.classList.add("hidden");
});

paymentModal?.addEventListener("click", (event) => {
  if (event.target === paymentModal) paymentModal.classList.add("hidden");
});

document.querySelectorAll(".payment-options button").forEach((button) => {
  button.addEventListener("click", () => {
    paymentMessage.textContent = `${button.dataset.method} selected. Payment instructions will be sent to your school email.`;
  });
});
