// ═══════════════════════════════════════════════════════════════
// ARCHON — Landing Page View
// ═══════════════════════════════════════════════════════════════

import { icons } from '../icons.js';
import { AIEngine } from '../ai/AIEngine.js';
import { appState, authState, authModal } from '../main.js';
import { auth, signOut } from '../services/firebase.js';

export class LandingPage {
  constructor(container, router) {
    this.container = container;
    this.router = router;
    this.ai = new AIEngine();
    this.particleCanvas = null;
    this.animationId = null;
    this.render();
    this.initParticles();
    
    // Listen for auth state changes to update the title bar button
    this.unsubscribeAuth = auth.onAuthStateChanged((user) => {
      const btnAuth = document.getElementById('btn-title-auth');
      if (btnAuth) {
        if (user && user.emailVerified) {
           btnAuth.innerHTML = `${icons.logout || '🚪'} Sair`;
           btnAuth.onclick = () => signOut(auth);
        } else {
           btnAuth.innerHTML = `${icons.user || '👤'} Entrar / Criar Conta`;
           btnAuth.onclick = () => authModal.show();
        }
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="landing">
        <!-- Title Bar -->
        <div class="title-bar">
          <div class="title-bar-left">
            <div class="title-bar-logo">
              <span class="gradient-text">${icons.archon}</span>
              <span class="gradient-text">ARCHON</span>
            </div>
          </div>
          <div class="title-bar-controls">
            <button class="title-bar-btn" id="btn-title-auth" style="width: auto; padding: 0 16px; font-weight: 500;">
               Entrar / Criar Conta
            </button>
            <div class="separator-v"></div>
            <button class="title-bar-btn" id="btn-minimize">${icons.minimize}</button>
            <button class="title-bar-btn" id="btn-maximize">${icons.maximize}</button>
            <button class="title-bar-btn close" id="btn-close">${icons.close}</button>
          </div>
        </div>

        <!-- Background -->
        <div class="landing-bg">
          <canvas id="particle-canvas"></canvas>
          <div class="landing-gradient"></div>
        </div>

        <!-- Content -->
        <div class="landing-content">
          <div class="landing-logo">
            <div class="landing-logo-icon">${icons.archon}</div>
            <span class="landing-logo-text gradient-text">ARCHON</span>
          </div>

          <div class="landing-hero">
            <h1><span class="gradient-text">Transforme ideias</span><br/>em projetos reais</h1>
            <p>Descreva o que você quer criar e a inteligência artificial vai projetar, modelar e simular seu produto em 3D.</p>
          </div>

          <div class="landing-input-area">
            <div class="landing-textarea-wrapper">
              <textarea
                id="project-description"
                class="landing-textarea"
                placeholder="Descreva seu projeto... Ex: 'Quero criar um drone agrícola barato para monitorar lavouras de soja'"
                rows="4"
              ></textarea>
              <span class="landing-char-count"><span id="char-count">0</span>/500</span>
            </div>
            <div class="landing-submit-row">
              <button class="landing-submit-btn" id="btn-generate">
                ${icons.sparkles}
                Gerar Projeto
                ${icons.rocket}
              </button>
            </div>
          </div>

          <div class="landing-quickstart">
            <h3>Início Rápido</h3>
            <div class="quickstart-grid">
              <div class="quickstart-card" data-template="drone">
                <div class="quickstart-icon">🛸</div>
                <h4>Drone Agrícola</h4>
                <p>Quadricóptero de baixo custo para monitoramento de lavouras</p>
              </div>
              <div class="quickstart-card" data-template="motorcycle">
                <div class="quickstart-icon">🏍️</div>
                <h4>Moto Elétrica</h4>
                <p>Motocicleta elétrica compacta para deslocamento urbano</p>
              </div>
              <div class="quickstart-card" data-template="robot">
                <div class="quickstart-icon">🤖</div>
                <h4>Robô Doméstico</h4>
                <p>Robô assistente autônomo para tarefas do dia a dia</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Features footer -->
        <div class="landing-features">
          <div class="landing-feature">${icons.cube} Modelagem 3D</div>
          <div class="landing-feature">${icons.sparkles} IA Generativa</div>
          <div class="landing-feature">${icons.activity} Simulação</div>
          <div class="landing-feature">${icons.palette} Materiais Reais</div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Window controls
    const btnMin = document.getElementById('btn-minimize');
    const btnMax = document.getElementById('btn-maximize');
    const btnClose = document.getElementById('btn-close');

    if (window.electronAPI) {
      btnMin?.addEventListener('click', () => window.electronAPI.minimize());
      btnMax?.addEventListener('click', () => window.electronAPI.maximize());
      btnClose?.addEventListener('click', () => window.electronAPI.close());
    } else {
      // In browser mode, hide window controls but keep the auth button
      const controls = document.querySelectorAll('.title-bar-controls > button:not(#btn-title-auth), .title-bar-controls .separator-v');
      controls.forEach(c => c.style.display = 'none');
    }

    // Char count
    const textarea = document.getElementById('project-description');
    const charCount = document.getElementById('char-count');
    textarea?.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len;
      if (len > 500) textarea.value = textarea.value.slice(0, 500);
    });

    // Generate button
    const btnGenerate = document.getElementById('btn-generate');
    btnGenerate?.addEventListener('click', () => {
      if (!authState.isAuthenticated) {
        authModal.show();
        return;
      }
      const desc = textarea?.value.trim();
      if (desc) this.generateProject(desc);
    });

    // Quick-start cards
    const cards = document.querySelectorAll('.quickstart-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const template = card.dataset.template;
        const descriptions = {
          drone: 'Quero criar um drone agrícola barato para monitorar lavouras de soja com câmera RGB',
          motorcycle: 'Preciso de uma moto elétrica simples e compacta para deslocamento urbano',
          robot: 'Quero projetar um robô doméstico autônomo para organização e limpeza',
        };
        textarea.value = descriptions[template] || '';
        charCount.textContent = textarea.value.length;
        this.generateProject(descriptions[template]);
      });
    });

    // Enter key
    textarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const desc = textarea.value.trim();
        if (desc) this.generateProject(desc);
      }
    });
  }

  async generateProject(description) {
    appState.description = description;
    
    // Show loading UI immediately
    this.showLoading(description);

    try {
      // Generate with real AI
      const project = await this.ai.generateProject(description);
      
      appState.currentProject = project;
      appState.projectName = project.name;
      appState.components = this.flattenComponents(project.components);
      
      // Let the loading animation finish its sequence if it's too fast,
      // but the actual generation is complete. The animation logic handles 
      // advancing the steps and eventually triggering the router navigation.
      this.generationComplete = true; 
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar projeto na IA: ' + err.message);
      
      const overlay = document.querySelector('.loading-overlay');
      if (overlay) overlay.remove();
    }
  }

  flattenComponents(components) {
    const flat = [];
    for (const comp of components) {
      flat.push(comp);
      if (comp.children) {
        flat.push(...this.flattenComponents(comp.children));
      }
    }
    return flat;
  }

  showLoading(description) {
    this.generationComplete = false;
    const steps = this.ai.getGenerationSteps();

    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner-ring"></div>
      <div class="loading-text">
        <h3>Gerando seu projeto...</h3>
        <p>${description.slice(0, 80)}${description.length > 80 ? '...' : ''}</p>
      </div>
      <div class="loading-steps" id="loading-steps">
        ${steps.map((s, i) => `
          <div class="loading-step ${i === 0 ? 'active' : ''}" data-step="${i}">
            <span class="step-icon">${i === 0 ? '<span class="spinner"></span>' : '○'}</span>
            <span>${s.label}</span>
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(overlay);

    let currentStep = 0;
    const advanceStep = () => {
      // If the AI has finished generating, we can speed through the remaining animation steps
      const delay = this.generationComplete ? 100 : (steps[currentStep - 1]?.duration || 500);

      if (currentStep >= steps.length) {
        if (!this.generationComplete) {
          // If animation finished but AI hasn't, just wait
          setTimeout(advanceStep, 500);
          return;
        }
        overlay.remove();
        this.router.navigate('/workspace');
        return;
      }

      const allSteps = overlay.querySelectorAll('.loading-step');
      allSteps.forEach((el, i) => {
        if (i < currentStep) {
          el.className = 'loading-step done';
          el.querySelector('.step-icon').innerHTML = icons.check;
        } else if (i === currentStep) {
          el.className = 'loading-step active';
          el.querySelector('.step-icon').innerHTML = '<span class="spinner"></span>';
        }
      });

      currentStep++;
      setTimeout(advanceStep, delay);
    };

    setTimeout(advanceStep, 300);
  }

  initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const PARTICLE_COUNT = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
