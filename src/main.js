// ═══════════════════════════════════════════════════════════════
// ARCHON — Main Entry Point
// ═══════════════════════════════════════════════════════════════

import './styles/global.css';
import './styles/components.css';
import './styles/landing.css';
import './styles/workspace.css';

import { Router } from './router.js';
import { LandingPage } from './views/LandingPage.js';
import { Workspace } from './views/Workspace.js';

// ── Global State ───────────────────────────────────────
export const appState = {
  currentProject: null,
  projectName: 'Novo Projeto',
  description: '',
  components: [],
  selectedComponent: null,
  materials: {},
  simulation: null,
};

// ── Authentication Setup ─────────────────────────────
import { auth, onAuthStateChanged } from './services/firebase.js';
import { AuthModal } from './components/AuthModal.js';

export const authState = {
  user: null,
  isAuthenticated: false
};

const authContainer = document.getElementById('auth-container');
export const authModal = new AuthModal(authContainer, (user) => {
  console.log('User logged in:', user.email);
  // Optionally redirect to workspace
  // router.navigate('/workspace');
});

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    authState.user = user;
    authState.isAuthenticated = true;
    console.log('Firebase Auth: User is signed in and verified.');
  } else {
    authState.user = null;
    authState.isAuthenticated = false;
    console.log('Firebase Auth: No user or not verified.');
    
    // If user tries to stay on workspace without auth, kick them back to landing page
    if (window.location.hash.includes('workspace')) {
      router.navigate('/');
      authModal.show();
    }
  }
});

// ── Router Setup ───────────────────────────────────────
const router = new Router();

router
  .on('/', () => {
    const app = document.getElementById('app');
    app.innerHTML = '';
    return new LandingPage(app, router);
  })
  .on('/workspace', () => {
    if (!authState.isAuthenticated) {
      router.navigate('/');
      authModal.show();
      return null;
    }
    const app = document.getElementById('app');
    app.innerHTML = '';
    return new Workspace(app, router);
  });

// ── Start ──────────────────────────────────────────────
router.start();

// ── Electron IPC Listeners ─────────────────────────────
if (window.electronAPI) {
  window.electronAPI.onNewProject(() => {
    appState.currentProject = null;
    appState.projectName = 'Novo Projeto';
    appState.description = '';
    appState.components = [];
    router.navigate('/');
  });

  window.electronAPI.onProjectLoaded((data) => {
    Object.assign(appState, data);
    router.navigate('/workspace');
  });
}

// ── Settings Modal Logic ───────────────────────────────
import { geminiService } from './ai/GeminiService.js';

const btnOpenSettings = document.getElementById('btn-open-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnSaveSettings = document.getElementById('btn-save-settings');
const settingsModal = document.getElementById('settings-modal');
const inputApiKey = document.getElementById('gemini-api-key');

if (btnOpenSettings && settingsModal) {
  btnOpenSettings.addEventListener('click', () => {
    inputApiKey.value = geminiService.apiKey;
    settingsModal.style.display = 'flex';
  });

  btnCloseSettings.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  btnSaveSettings.addEventListener('click', () => {
    const key = inputApiKey.value.trim();
    geminiService.setApiKey(key);
    settingsModal.style.display = 'none';
    
    // Optional feedback
    const originalText = btnSaveSettings.textContent;
    btnSaveSettings.textContent = 'Salvo!';
    setTimeout(() => { btnSaveSettings.textContent = originalText; }, 2000);
  });

  // Close on backdrop click
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
}
