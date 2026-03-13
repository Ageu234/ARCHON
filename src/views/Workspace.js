// ═══════════════════════════════════════════════════════════════
// ARCHON — Workspace View (Main CAD Editor)
// ═══════════════════════════════════════════════════════════════

import { icons } from '../icons.js';
import { appState } from '../main.js';
import { SceneManager } from '../engine/SceneManager.js';
import { AIEngine } from '../ai/AIEngine.js';
import { SimulationEngine } from '../simulation/SimulationEngine.js';
import { getMaterialList, getMaterial } from '../engine/MaterialLibrary.js';
import { auth, signOut } from '../services/firebase.js';

export class Workspace {
  constructor(container, router) {
    this.container = container;
    this.router = router;
    this.ai = new AIEngine();
    this.sim = new SimulationEngine();
    this.sceneManager = null;
    this.selectedComponentId = null;
    this.activeTab = 'components';
    this.viewMode = 'solid';
    this.activeTool = 'move';
    this.chatMessages = [];

    this.render();
    this.initScene();
    this.initAIMessages();
  }

  render() {
    this.container.innerHTML = `
      <!-- Title Bar -->
      <div class="title-bar">
        <div class="title-bar-left">
          <div class="title-bar-logo">
            <span class="gradient-text" style="display:flex;width:18px;height:18px">${icons.archon}</span>
            <span class="gradient-text">ARCHON</span>
          </div>
          <div class="title-bar-project" id="project-name">${appState.projectName}</div>
        </div>
        <div class="title-bar-controls">
          <button class="title-bar-btn" id="btn-workspace-logout" style="width: auto; padding: 0 16px; font-weight: 500;">
             ${icons.logout || '🚪'} Sair
          </button>
          <div class="separator-v"></div>
          <button class="title-bar-btn" id="btn-minimize">${icons.minimize}</button>
          <button class="title-bar-btn" id="btn-maximize">${icons.maximize}</button>
          <button class="title-bar-btn close" id="btn-close">${icons.close}</button>
        </div>
      </div>

      <div class="workspace">
        <!-- Toolbar -->
        <div class="toolbar">
          <button class="toolbar-btn" id="btn-home" title="Voltar">${icons.home}</button>
          <div class="separator-v"></div>

          <div class="toolbar-group">
            <button class="toolbar-btn" id="btn-undo" title="Desfazer">${icons.undo}</button>
            <button class="toolbar-btn" id="btn-redo" title="Refazer">${icons.redo}</button>
          </div>
          <div class="separator-v"></div>

          <span class="toolbar-label">Ferramentas</span>
          <div class="toolbar-group">
            <button class="toolbar-btn active" id="btn-tool-move" data-tool="move" title="Mover">${icons.move}</button>
            <button class="toolbar-btn" id="btn-tool-rotate" data-tool="rotate" title="Rotacionar">${icons.rotate}</button>
            <button class="toolbar-btn" id="btn-tool-scale" data-tool="scale" title="Escalar">${icons.scale}</button>
          </div>
          <div class="separator-v"></div>

          <span class="toolbar-label">Visualização</span>
          <div class="toolbar-group">
            <button class="toolbar-btn active" id="btn-view-solid" data-view="solid" title="Sólido">${icons.cube}</button>
            <button class="toolbar-btn" id="btn-view-wireframe" data-view="wireframe" title="Wireframe">${icons.wireframe}</button>
            <button class="toolbar-btn" id="btn-view-xray" data-view="xray" title="Raio-X">${icons.eye}</button>
          </div>
          <div class="separator-v"></div>

          <div style="flex:1"></div>

          <div class="toolbar-group">
            <button class="toolbar-btn" id="btn-save" title="Salvar">${icons.save}</button>
            <button class="toolbar-btn" id="btn-export" title="Exportar">${icons.download}</button>
          </div>
        </div>

        <!-- Body -->
        <div class="workspace-body">
          <!-- Left Sidebar — AI Panel -->
          <div class="sidebar-left" id="ai-panel">
            <div class="ai-panel-header">
              <div class="ai-panel-header-icon">${icons.bot}</div>
              <div class="ai-panel-header-text">
                <h3>Engenheiro IA</h3>
                <span>ARCHON AI Assistant</span>
              </div>
            </div>

            <div class="ai-messages" id="ai-messages"></div>

            <div class="ai-suggestions" id="ai-suggestions"></div>

            <div class="ai-input-area">
              <div class="ai-input-wrapper">
                <textarea class="ai-input" id="ai-input" placeholder="Pergunte algo sobre o projeto..." rows="1"></textarea>
                <button class="ai-send-btn" id="ai-send">${icons.send}</button>
              </div>
            </div>
          </div>

          <!-- Viewport -->
          <div class="viewport-container" id="viewport-container">
            <div class="viewport-overlay">
              <div class="viewport-info" id="viewport-info">
                <span id="viewport-stats">Carregando...</span>
              </div>
            </div>

            <div class="viewport-nav">
              <button class="viewport-nav-btn" id="btn-zoom-in" title="Zoom In">${icons.zoomIn}</button>
              <button class="viewport-nav-btn" id="btn-zoom-out" title="Zoom Out">${icons.zoomOut}</button>
              <button class="viewport-nav-btn" id="btn-fit" title="Ajustar">${icons.maximize2}</button>
            </div>
          </div>

          <!-- Right Sidebar — Properties -->
          <div class="sidebar-right" id="props-panel">
            <!-- Tabs -->
            <div class="tabs" id="props-tabs">
              <button class="tab active" data-tab="components">${icons.layers} Comp.</button>
              <button class="tab" data-tab="properties">${icons.sliders} Props</button>
              <button class="tab" data-tab="materials">${icons.palette} Mat.</button>
              <button class="tab" data-tab="simulation">${icons.activity} Sim.</button>
            </div>

            <div style="flex:1;overflow-y:auto" id="props-content"></div>
          </div>
        </div>

        <!-- Status Bar -->
        <div class="status-bar">
          <div class="status-item">
            <div class="status-dot"></div>
            <span>ARCHON v1.0</span>
          </div>
          <div class="status-separator"></div>
          <div class="status-item">
            <span id="status-components">0 componentes</span>
          </div>
          <div class="status-separator"></div>
          <div class="status-item">
            <span id="status-triangles">0 triângulos</span>
          </div>
          <div class="status-separator"></div>
          <div class="status-item">
            <span id="status-mode">Modo: Sólido</span>
          </div>
          <div style="flex:1"></div>
          <div class="status-item">
            <span class="mono" id="status-zoom">Zoom: 100%</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  initScene() {
    const viewportContainer = document.getElementById('viewport-container');
    if (!viewportContainer) return;

    this.sceneManager = new SceneManager(viewportContainer);

    // Load project
    if (appState.currentProject && appState.components.length > 0) {
      this.sceneManager.loadProject(appState.components);
    }

    // Selection callback
    this.sceneManager.onSelect = (id) => {
      this.selectedComponentId = id;
      this.updatePropertiesPanel();
      this.updateComponentsList();
    };

    // Update stats
    this.updateStats();
    this.statsInterval = setInterval(() => this.updateStats(), 2000);
  }

  initAIMessages() {
    // Initial AI message
    const project = appState.currentProject;
    if (project) {
      this.addAIMessage(
        `Projeto **${project.name}** gerado com sucesso! 🎉\n\n${project.description}\n\n**Especificações:**\n${Object.entries(project.specs || {}).map(([k, v]) => `• ${k}: ${v}`).join('\n')}\n\nO modelo 3D está pronto para edição. Selecione componentes no viewport ou pergunte-me qualquer coisa sobre o projeto.`,
        ['Analisar materiais', 'Estimar custos', 'Simular performance']
      );
    }

    this.renderTab('components');
  }

  bindEvents() {
    // Window controls
    if (window.electronAPI) {
      document.getElementById('btn-minimize')?.addEventListener('click', () => window.electronAPI.minimize());
      document.getElementById('btn-maximize')?.addEventListener('click', () => window.electronAPI.maximize());
      document.getElementById('btn-close')?.addEventListener('click', () => window.electronAPI.close());
    } else {
      const controls = document.querySelector('.title-bar-controls');
      if (controls) controls.style.display = 'none';
    }

    // Home button
    document.getElementById('btn-home')?.addEventListener('click', () => {
      this.router.navigate('/');
    });

    // Logout button
    document.getElementById('btn-workspace-logout')?.addEventListener('click', async () => {
      try {
        await signOut(auth);
        this.router.navigate('/');
      } catch (err) {
        console.error('Logout error:', err);
      }
    });

    // Tool buttons
    document.querySelectorAll('[data-tool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-tool]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTool = btn.dataset.tool;
      });
    });

    // View mode buttons
    document.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-view]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.viewMode = btn.dataset.view;
        this.sceneManager?.setViewMode(this.viewMode);
        
        const modeNames = { solid: 'Sólido', wireframe: 'Wireframe', xray: 'Raio-X' };
        const statusMode = document.getElementById('status-mode');
        if (statusMode) statusMode.textContent = `Modo: ${modeNames[this.viewMode]}`;
      });
    });

    // Tabs
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.dataset.tab;
        this.renderTab(this.activeTab);
      });
    });

    // AI input
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');

    aiSend?.addEventListener('click', () => this.sendAIMessage());
    aiInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendAIMessage();
      }
    });

    // Zoom buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      if (this.sceneManager) {
        this.sceneManager.camera.position.multiplyScalar(0.8);
        this.sceneManager.controls.update();
      }
    });

    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      if (this.sceneManager) {
        this.sceneManager.camera.position.multiplyScalar(1.2);
        this.sceneManager.controls.update();
      }
    });

    document.getElementById('btn-fit')?.addEventListener('click', () => {
      this.sceneManager?.fitCamera();
    });

    // Save
    document.getElementById('btn-save')?.addEventListener('click', () => {
      if (window.electronAPI) {
        window.electronAPI.saveProject({
          ...appState,
          savedAt: new Date().toISOString(),
        });
      }
    });
  }

  // ── AI Chat ──────────────────────────────────────────

  async sendAIMessage() {
    const input = document.getElementById('ai-input');
    const text = input?.value.trim();
    if (!text) return;
    input.value = '';

    this.addUserMessage(text);
    
    // Disable input while waiting
    if (input) input.disabled = true;

    try {
      const response = await this.ai.generateResponse(text, appState.currentProject);
      this.addAIMessage(response.text, response.suggestions);

      // Execute AI actions (add/remove/scale components)
      if (response.action) {
        this.executeAIAction(response.action);
      }
    } catch (e) {
      this.addAIMessage("Desculpe, tive um problema de conexão com meus servidores cognitivos 🧠. Pode tentar novamente?");
    } finally {
      if (input) {
        input.disabled = false;
        input.focus();
      }
    }
  }

  executeAIAction(action) {
    switch (action.type) {
      case 'add_component': {
        const comp = action.component;
        if (!comp) break;
        // Ensure unique ID
        comp.id = comp.id || `comp_${Date.now()}`;
        comp.name = comp.name || comp.matchedName || 'Novo Componente';
        comp.dimensions = comp.dimensions || { x: 0.1, y: 0.1, z: 0.1 };
        comp.position = comp.position || { x: 0, y: 0.15, z: 0 };
        comp.rotation = comp.rotation || { x: 0, y: 0, z: 0 };
        comp.material = comp.material || 'aluminum';
        appState.components.push(comp);
        this.sceneManager?.addComponent(comp);
        this.sceneManager?.fitCamera();
        this.renderTab(this.activeTab);
        this.updateStats();
        break;
      }
      case 'remove_component': {
        const id = action.componentId;
        if (!id) break;
        const idx = appState.components.findIndex(c => c.id === id);
        if (idx >= 0) {
          appState.components.splice(idx, 1);
          const mesh = this.sceneManager?.meshes.get(id);
          if (mesh) {
            this.sceneManager.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.sceneManager.meshes.delete(id);
          }
          this.selectedComponentId = null;
          this.renderTab(this.activeTab);
          this.updateStats();
        }
        break;
      }
      case 'scale_all': {
        const factor = action.factor || 1.0;
        for (const comp of appState.components) {
          if (comp.dimensions) {
            for (const k of Object.keys(comp.dimensions)) {
              comp.dimensions[k] *= factor;
            }
          }
          if (comp.position) {
            comp.position.x *= factor;
            comp.position.y *= factor;
            comp.position.z *= factor;
          }
        }
        // Reload the full model
        this.sceneManager?.loadProject(appState.components);
        this.renderTab(this.activeTab);
        this.updateStats();
        break;
      }
    }
  }

  addUserMessage(text) {
    this.chatMessages.push({ role: 'user', text });
    const container = document.getElementById('ai-messages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'ai-message';
    div.innerHTML = `
      <div class="ai-message-avatar user">${icons.user}</div>
      <div class="ai-message-content">${this.escapeHtml(text)}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  addAIMessage(text, suggestions = []) {
    this.chatMessages.push({ role: 'ai', text, suggestions });
    const container = document.getElementById('ai-messages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'ai-message';
    div.innerHTML = `
      <div class="ai-message-avatar ai">${icons.sparkles}</div>
      <div class="ai-message-content">${this.formatMarkdown(text)}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    // Update suggestions
    if (suggestions.length > 0) {
      const sugContainer = document.getElementById('ai-suggestions');
      if (sugContainer) {
        sugContainer.innerHTML = suggestions.map(s => 
          `<button class="ai-suggestion">${s}</button>`
        ).join('');

        sugContainer.querySelectorAll('.ai-suggestion').forEach((btn) => {
          btn.addEventListener('click', () => {
            const input = document.getElementById('ai-input');
            if (input) {
              input.value = btn.textContent;
              this.sendAIMessage();
            }
          });
        });
      }
    }
  }

  // ── Tab Panels ───────────────────────────────────────

  renderTab(tab) {
    const container = document.getElementById('props-content');
    if (!container) return;

    switch (tab) {
      case 'components':
        this.renderComponentsTab(container);
        break;
      case 'properties':
        this.renderPropertiesTab(container);
        break;
      case 'materials':
        this.renderMaterialsTab(container);
        break;
      case 'simulation':
        this.renderSimulationTab(container);
        break;
    }
  }

  renderComponentsTab(container) {
    const components = appState.components || [];
    container.innerHTML = `
      <div class="props-section">
        <div class="props-section-title">
          <span>Componentes (${components.length})</span>
        </div>
        <div class="tree-view">
          ${components.map(c => `
            <div class="tree-item ${c.id === this.selectedComponentId ? 'selected' : ''}" 
                 data-id="${c.id}" id="tree-${c.id}">
              <span class="tree-icon">${this.getComponentIcon(c.type)}</span>
              <span class="truncate">${c.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.tree-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        this.selectedComponentId = id;
        this.sceneManager?.selectComponent(id);
        this.updateComponentsList();
        if (this.activeTab === 'properties') this.renderTab('properties');
      });
    });
  }

  updateComponentsList() {
    document.querySelectorAll('.tree-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.id === this.selectedComponentId);
    });
  }

  renderPropertiesTab(container) {
    if (!this.selectedComponentId) {
      container.innerHTML = `
        <div class="props-section" style="text-align:center;padding:var(--space-8);color:var(--text-muted)">
          <div style="font-size:32px;margin-bottom:var(--space-4)">📦</div>
          <p>Selecione um componente no viewport ou na lista para ver suas propriedades</p>
        </div>
      `;
      return;
    }

    const comp = appState.components.find(c => c.id === this.selectedComponentId);
    if (!comp) return;

    const dims = comp.dimensions || {};
    const pos = comp.position || {};
    const rot = comp.rotation || {};
    const mat = getMaterial(comp.material);

    container.innerHTML = `
      <div class="props-section">
        <div class="props-section-title">
          <span>${icons.box} ${comp.name}</span>
          <span class="badge badge-primary">${comp.type}</span>
        </div>
      </div>

      <div class="props-section">
        <div class="props-section-title"><span>Posição</span></div>
        <div class="props-grid">
          <div class="props-field">
            <label>X</label>
            <input class="prop-input" type="number" step="0.01" value="${(pos.x || 0).toFixed(3)}" data-prop="position.x" />
          </div>
          <div class="props-field">
            <label>Y</label>
            <input class="prop-input" type="number" step="0.01" value="${(pos.y || 0).toFixed(3)}" data-prop="position.y" />
          </div>
          <div class="props-field">
            <label>Z</label>
            <input class="prop-input" type="number" step="0.01" value="${(pos.z || 0).toFixed(3)}" data-prop="position.z" />
          </div>
        </div>
      </div>

      <div class="props-section">
        <div class="props-section-title"><span>Dimensões</span></div>
        <div class="props-grid">
          ${comp.geometry === 'box' ? `
            <div class="props-field"><label>W</label><input class="prop-input" type="number" step="0.01" value="${(dims.x || 0.1).toFixed(3)}" data-dim="x" /></div>
            <div class="props-field"><label>H</label><input class="prop-input" type="number" step="0.01" value="${(dims.y || 0.1).toFixed(3)}" data-dim="y" /></div>
            <div class="props-field"><label>D</label><input class="prop-input" type="number" step="0.01" value="${(dims.z || 0.1).toFixed(3)}" data-dim="z" /></div>
          ` : comp.geometry === 'cylinder' ? `
            <div class="props-field"><label>R</label><input class="prop-input" type="number" step="0.005" value="${(dims.radius || 0.05).toFixed(3)}" data-dim="radius" /></div>
            <div class="props-field"><label>H</label><input class="prop-input" type="number" step="0.01" value="${(dims.height || 0.1).toFixed(3)}" data-dim="height" /></div>
          ` : comp.geometry === 'sphere' ? `
            <div class="props-field"><label>R</label><input class="prop-input" type="number" step="0.005" value="${(dims.radius || 0.05).toFixed(3)}" data-dim="radius" /></div>
          ` : comp.geometry === 'torus' ? `
            <div class="props-field"><label>R</label><input class="prop-input" type="number" step="0.005" value="${(dims.radius || 0.05).toFixed(3)}" data-dim="radius" /></div>
            <div class="props-field"><label>T</label><input class="prop-input" type="number" step="0.002" value="${(dims.tube || 0.01).toFixed(3)}" data-dim="tube" /></div>
          ` : ''}
        </div>
      </div>

      <div class="props-section">
        <div class="props-section-title"><span>Material</span></div>
        <div class="material-card selected">
          <div class="material-swatch" style="background:${mat.color}"></div>
          <div class="material-info">
            <div class="material-name">${mat.name}</div>
            <div class="material-props">${mat.density} g/cm³ · R$${mat.costPerKg}/kg</div>
          </div>
        </div>
      </div>
    `;

    // Bind dimension inputs
    container.querySelectorAll('[data-dim]').forEach(input => {
      input.addEventListener('change', () => {
        const dim = input.dataset.dim;
        const val = parseFloat(input.value);
        if (isNaN(val) || val <= 0) return;

        comp.dimensions[dim] = val;
        this.sceneManager?.updateComponentDimensions(comp.id, comp.dimensions);
      });
    });

    // Bind position inputs
    container.querySelectorAll('[data-prop]').forEach(input => {
      input.addEventListener('change', () => {
        const prop = input.dataset.prop;
        const val = parseFloat(input.value);
        if (isNaN(val)) return;

        const [obj, key] = prop.split('.');
        if (comp[obj]) comp[obj][key] = val;

        const mesh = this.sceneManager?.meshes.get(comp.id);
        if (mesh && obj === 'position') {
          mesh.position[key] = val;
        }
      });
    });
  }

  renderMaterialsTab(container) {
    const materials = getMaterialList();
    const selectedComp = appState.components.find(c => c.id === this.selectedComponentId);

    container.innerHTML = `
      <div class="props-section">
        <div class="props-section-title">
          <span>Biblioteca de Materiais</span>
        </div>
        ${selectedComp ? `<p style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-2)">Aplicar material em: <strong style="color:var(--accent-primary)">${selectedComp.name}</strong></p>` : '<p style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-2)">Selecione um componente para aplicar material</p>'}
        <div style="display:flex;flex-direction:column;gap:var(--space-2)">
          ${materials.map(m => `
            <div class="material-card ${selectedComp?.material === m.id ? 'selected' : ''}" data-material="${m.id}">
              <div class="material-swatch" style="background:${m.color}"></div>
              <div class="material-info">
                <div class="material-name">${m.name}</div>
                <div class="material-props">${m.density} g/cm³ · ${m.tensileStrength} MPa · R$${m.costPerKg}/kg</div>
              </div>
              <span class="badge badge-${m.category === 'Metal' ? 'primary' : m.category === 'Compósito' ? 'warning' : 'success'}">${m.category}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.material-card').forEach(card => {
      card.addEventListener('click', () => {
        if (!this.selectedComponentId) return;

        const matId = card.dataset.material;
        const comp = appState.components.find(c => c.id === this.selectedComponentId);
        if (comp) {
          comp.material = matId;
          this.sceneManager?.updateComponentMaterial(comp.id, matId);
          this.renderTab('materials');
        }
      });
    });
  }

  renderSimulationTab(container) {
    if (!appState.currentProject) {
      container.innerHTML = '<div class="props-section" style="text-align:center;padding:var(--space-8);color:var(--text-muted)"><p>Nenhum projeto carregado</p></div>';
      return;
    }

    const analysis = this.sim.runFullAnalysis(appState.currentProject);

    container.innerHTML = `
      <div class="props-section">
        <div class="props-section-title"><span>${icons.activity} Análise Geral</span></div>
        <div style="text-align:center;margin:var(--space-3) 0">
          <div style="font-size:var(--text-3xl);font-weight:800" class="gradient-text">${analysis.overallScore}%</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Score de Viabilidade</div>
        </div>
      </div>

      <div class="props-section">
        <div class="props-section-title"><span>${icons.weight} Peso</span></div>
        <div class="sim-metric">
          <span class="sim-metric-label">Peso Total</span>
          <span class="sim-metric-value">${analysis.weight.total.toFixed(3)} kg</span>
        </div>
        ${analysis.weight.breakdown.slice(0, 5).map(w => `
          <div class="sim-metric">
            <span class="sim-metric-label" style="font-size:var(--text-xs)">${w.name}</span>
            <span class="sim-metric-value" style="font-size:var(--text-xs)">${w.weight.toFixed(4)} kg</span>
          </div>
        `).join('')}
      </div>

      <div class="props-section">
        <div class="props-section-title"><span>${icons.dollar} Custo Estimado</span></div>
        <div class="sim-metric">
          <span class="sim-metric-label">Material</span>
          <span class="sim-metric-value">R$ ${analysis.cost.materialCost.toFixed(2)}</span>
        </div>
        <div class="sim-metric">
          <span class="sim-metric-label">Manufatura</span>
          <span class="sim-metric-value">R$ ${analysis.cost.manufacturingCost.toFixed(2)}</span>
        </div>
        <div class="sim-metric" style="border-top:2px solid var(--accent-primary);">
          <span class="sim-metric-label" style="font-weight:700;color:var(--text-primary)">Total</span>
          <span class="sim-metric-value" style="color:var(--accent-primary)">R$ ${analysis.cost.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="props-section">
        <div class="props-section-title"><span>${icons.shield} Stress (Fator de Segurança)</span></div>
        ${analysis.stress.slice(0, 6).map(s => `
          <div style="margin-bottom:var(--space-2)">
            <div class="sim-metric" style="border:none;padding-bottom:0">
              <span class="sim-metric-label" style="font-size:var(--text-xs)">${s.name}</span>
              <span class="sim-metric-value badge badge-${s.status === 'good' ? 'success' : s.status === 'medium' ? 'warning' : 'danger'}">${s.safetyFactor}x</span>
            </div>
            <div class="sim-bar">
              <div class="sim-bar-fill ${s.status}" style="width:${Math.min(100, s.safetyFactor / 4 * 100)}%"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="props-section">
        <div class="props-section-title"><span>${icons.gauge} Performance</span></div>
        ${Object.entries(analysis.performance).map(([k, v]) => `
          <div class="sim-metric">
            <span class="sim-metric-label" style="text-transform:capitalize">${k.replace(/([A-Z])/g, ' $1')}</span>
            <span class="sim-metric-value">${v}</span>
          </div>
        `).join('')}
      </div>

      <div style="padding:var(--space-3)">
        <button class="btn btn-gradient" style="width:100%" id="btn-rerun-sim">
          ${icons.activity} Recalcular Simulação
        </button>
      </div>
    `;

    document.getElementById('btn-rerun-sim')?.addEventListener('click', () => {
      this.renderTab('simulation');
    });
  }

  // ── Helpers ──────────────────────────────────────────

  updateStats() {
    if (!this.sceneManager) return;
    const stats = this.sceneManager.getStats();
    const statsEl = document.getElementById('viewport-stats');
    if (statsEl) {
      statsEl.textContent = `${stats.meshCount} objetos · ${stats.triangles} triângulos · ${stats.vertices} vértices`;
    }

    const compEl = document.getElementById('status-components');
    if (compEl) compEl.textContent = `${stats.meshCount} componentes`;

    const triEl = document.getElementById('status-triangles');
    if (triEl) triEl.textContent = `${stats.triangles} triângulos`;
  }

  getComponentIcon(type) {
    const map = {
      body: '🏗️',
      structure: '🔩',
      motor: '⚡',
      propeller: '🌀',
      electronics: '🔋',
      sensor: '📡',
      wheel: '⚙️',
      actuator: '🦾',
      control: '🎮',
      comfort: '💺',
    };
    return map[type] || '📦';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
  }

  destroy() {
    if (this.statsInterval) clearInterval(this.statsInterval);
    if (this.sceneManager) this.sceneManager.destroy();
  }
}
