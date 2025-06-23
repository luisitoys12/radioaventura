import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getDatabase, ref, onValue, set, push, remove } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Firebase config - reuse from global window.firebaseConfig or define here
const firebaseConfig = window.firebaseConfig || {
  apiKey: "AIzaSyBE7WhOpjB9q_z3Bx_N6PtPEJuV6wS8qLk",
  authDomain: "radioaventura-1e6e0.firebaseapp.com",
  databaseURL: "https://radioaventura-1e6e0-default-rtdb.firebaseio.com",
  projectId: "radioaventura-1e6e0",
  storageBucket: "radioaventura-1e6e0.firebasestorage.app",
  messagingSenderId: "4896086531",
  appId: "1:4896086531:web:9dbafd9a896acc7754cc36",
  measurementId: "G-8WM1YFRLWR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Preloaded admin credentials
const ADMIN_EMAIL = "admin@example.com"; // Replace with actual admin email
const ADMIN_PASSWORD = "adminpassword"; // Replace with actual admin password

// Elements for login UI
const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
const logoutBtn = document.getElementById('logout-btn');

// Auto-login on page load
signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD)
  .then((userCredential) => {
    console.log("Admin logged in:", userCredential.user.email);
    if (loginStatus) loginStatus.textContent = `Logged in as ${userCredential.user.email}`;
    if (loginForm) loginForm.style.display = 'none';
    loadAdminData();
  })
  .catch((error) => {
    console.error("Login failed:", error);
    if (loginStatus) loginStatus.textContent = "Login failed. Please check credentials.";
    if (loginForm) loginForm.style.display = 'block';
  });

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginStatus) loginStatus.textContent = `Logged in as ${user.email}`;
    if (loginForm) loginForm.style.display = 'none';
    loadAdminData();
  } else {
    if (loginStatus) loginStatus.textContent = "Not logged in";
    if (loginForm) loginForm.style.display = 'block';
  }
});

// Logout button handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      if (loginStatus) loginStatus.textContent = "Logged out";
      if (loginForm) loginForm.style.display = 'block';
    });
  });
}

// --- Existing admin data functions below ---

// Utility function to create list item with delete button
function createListItem(text, key, onDelete) {
  const li = document.createElement('li');
  li.textContent = text;
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Eliminar';
  delBtn.className = 'delete';
  delBtn.onclick = () => onDelete(key);
  li.appendChild(delBtn);
  return li;
}

// --- Messages Section ---
const messagesList = document.getElementById('messages-list');
const messageText = document.getElementById('message-text');
const addMessageBtn = document.getElementById('add-message-btn');

const messagesRef = ref(db, 'messages');

function loadMessages() {
  onValue(messagesRef, (snapshot) => {
    messagesList.innerHTML = '';
    const data = snapshot.val();
    if (data) {
      Object.entries(data).forEach(([key, message]) => {
        const li = createListItem(message.text, key, deleteMessage);
        messagesList.appendChild(li);
      });
    }
  });
}

function addMessage() {
  const text = messageText.value.trim();
  if (!text) return alert('El mensaje no puede estar vacío');
  const newMessageRef = push(messagesRef);
  set(newMessageRef, { text, timestamp: Date.now() });
  messageText.value = '';
}

function deleteMessage(key) {
  if (confirm('¿Seguro que quieres eliminar este mensaje?')) {
    remove(ref(db, `messages/${key}`));
  }
}

// --- Streams Config Section ---
const serviceSelect = document.getElementById('service-select');
const baseUrlInput = document.getElementById('base-url');
const idUserInput = document.getElementById('id-user');
const multiStreamSelect = document.getElementById('multi-stream');
const sliderTimingInput = document.getElementById('slider-timing');
const carouselTimingInput = document.getElementById('carousel-timing');
const timeRefreshInput = document.getElementById('time-refresh');
const moduleVideoTopsSelect = document.getElementById('module-video-tops');
const moduleNewsSelect = document.getElementById('module-news');
const moduleTeamSelect = document.getElementById('module-team');
const saveStreamsConfigBtn = document.getElementById('save-streams-config-btn');

const streamsConfigRef = ref(db, 'config/streams');

function loadStreamsConfig() {
  onValue(streamsConfigRef, (snapshot) => {
    const config = snapshot.val();
    if (config) {
      serviceSelect.value = config.service || 'live365';
      baseUrlInput.value = config.base_url || '';
      idUserInput.value = config.id_user || '';
      multiStreamSelect.value = config.multi_stream ? 'true' : 'false';
      sliderTimingInput.value = config.sliderTiming || 10000;
      carouselTimingInput.value = config.carouselTiming || 5000;
      timeRefreshInput.value = config.timeRefresh || 10000;
      moduleVideoTopsSelect.value = config.module_video_tops ? 'true' : 'false';
      moduleNewsSelect.value = config.module_news ? 'true' : 'false';
      moduleTeamSelect.value = config.module_team ? 'true' : 'false';
    }
  });
}

function saveStreamsConfig() {
  const config = {
    service: serviceSelect.value,
    base_url: baseUrlInput.value,
    id_user: Number(idUserInput.value),
    multi_stream: multiStreamSelect.value === 'true',
    sliderTiming: Number(sliderTimingInput.value),
    carouselTiming: Number(carouselTimingInput.value),
    timeRefresh: Number(timeRefreshInput.value),
    module_video_tops: moduleVideoTopsSelect.value === 'true',
    module_news: moduleNewsSelect.value === 'true',
    module_team: moduleTeamSelect.value === 'true',
  };
  set(streamsConfigRef, config)
    .then(() => alert('Configuración guardada correctamente'))
    .catch((error) => alert('Error al guardar configuración: ' + error));
}

saveStreamsConfigBtn.addEventListener('click', saveStreamsConfig);
loadStreamsConfig();

function loadAdminData() {
  loadMessages();
  loadStreamsConfig();
  loadPrograms();
}

// --- Programs Section ---
const programDay = document.getElementById('program-day');
const programTitle = document.getElementById('program-title');
const programTime = document.getElementById('program-time');
const programDescription = document.getElementById('program-description');
const addProgramBtn = document.getElementById('add-program-btn');
const programsList = document.getElementById('programs-list');

function loadPrograms() {
  const day = programDay.value;
  const dayRef = ref(db, `programs/${day}`);
  onValue(dayRef, (snapshot) => {
    programsList.innerHTML = '';
    const data = snapshot.val();
    if (data && Array.isArray(data)) {
      data.forEach((program, index) => {
        const text = `${program.time} - ${program.title}: ${program.description}`;
        const li = createListItem(text, index, () => deleteProgram(day, index));
        programsList.appendChild(li);
      });
    }
  });
}

function addProgram() {
  const day = programDay.value;
  const title = programTitle.value.trim();
  const time = programTime.value.trim();
  const description = programDescription.value.trim();
  if (!title || !time) return alert('El título y el horario son obligatorios');
  const dayRef = ref(db, `programs/${day}`);
  onValue(dayRef, (snapshot) => {
    let data = snapshot.val() || [];
    data.push({ title, time, description });
    set(dayRef, data);
    programTitle.value = '';
    programTime.value = '';
    programDescription.value = '';
  }, { onlyOnce: true });
}

function deleteProgram(day, index) {
  const dayRef = ref(db, `programs/${day}`);
  onValue(dayRef, (snapshot) => {
    let data = snapshot.val() || [];
    if (index >= 0 && index < data.length) {
      data.splice(index, 1);
      set(dayRef, data);
    }
  }, { onlyOnce: true });
}

addProgramBtn.addEventListener('click', addProgram);
programDay.addEventListener('change', loadPrograms);
loadPrograms();

// TODO: Implement similar CRUD for news, team, history, slider sections
