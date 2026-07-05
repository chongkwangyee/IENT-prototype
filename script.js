const tutorGrid = document.querySelector("#tutorGrid");
const subjectButtons = document.querySelectorAll(".subject-pill");
const searchInput = document.querySelector("#searchInput");
const levelSelect = document.querySelector("#levelSelect");

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
      option.selected = option.value === tutorName;
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

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  loginMessage.textContent = "Logged in for the demo. Redirecting to your profile...";
  window.setTimeout(() => {
    window.location.href = "profile.html";
  }, 800);
});

const signupForm = document.querySelector("#signupForm");
const signupMessage = document.querySelector("#signupMessage");

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const profile = {
    name: document.querySelector("#signupName").value.trim(),
    grade: document.querySelector("#signupGrade").value.trim(),
    email: document.querySelector("#signupEmail").value.trim(),
    bio: document.querySelector("#signupBio").value.trim(),
    goals: splitList(document.querySelector("#signupGoals").value),
    tutoring: splitList(document.querySelector("#signupTutoring").value),
    availability: document.querySelector("#signupAvailability").value.trim(),
    linkedin: document.querySelector("#signupLinkedin").value.trim()
  };
  localStorage.setItem("studyMeshProfile", JSON.stringify(profile));
  signupMessage.textContent = "Profile created. Opening your profile...";
  window.setTimeout(() => {
    window.location.href = "profile.html";
  }, 700);
});

const savedProfile = JSON.parse(localStorage.getItem("studyMeshProfile") || "null");

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

if (savedProfile) {
  const name = savedProfile.name || "Study Mesh Student";
  const grade = savedProfile.grade || "Student";
  const availability = savedProfile.availability || "Availability not set";
  const tutoring = savedProfile.tutoring?.length ? savedProfile.tutoring.join(", ") : "Peer tutoring";
  const linkedin = savedProfile.linkedin || "https://www.linkedin.com";

  setText("#profileInitial", name.charAt(0).toUpperCase());
  setText("#profileName", name);
  setText("#profileBio", `${grade} learner. ${savedProfile.bio || "Ready to learn and tutor with Study Mesh."}`);
  setText("#profileOffer", `${name} can tutor ${tutoring}. Available: ${availability}.`);
  setText("#profileContact", `Contact ${name} for tutoring history, study projects, and peer mentor experience.`);
  setText("#profileLinkedinText", linkedin.replace(/^https?:\/\//, ""));

  renderList("#profileGoals", savedProfile.goals, ["Add learning goals from the sign up page"]);
  renderTags("#profileTags", savedProfile.tutoring, ["Peer mentor"]);

  const linkedinButton = document.querySelector("#profileLinkedinButton");
  const linkedinCard = document.querySelector("#profileLinkedinCard");
  if (linkedinButton) linkedinButton.href = linkedin;
  if (linkedinCard) linkedinCard.href = linkedin;
}
