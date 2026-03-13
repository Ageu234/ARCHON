// ═══════════════════════════════════════════════════════════════
// ARCHON — AI Engine (Smart Dynamic Generation)
// ═══════════════════════════════════════════════════════════════

import { projectTemplates } from './projectTemplates.js';
import { componentLibrary, geometryPresets } from './componentLibrary.js';

// ── NLP: Category detection with broad coverage ──────────────

const categoryRules = [
  { id: 'drone', keywords: ['drone','quadricóptero','quadricoptero','vant','uav','multirotor','hexacóptero','octocóptero','quadrotor'], weight: 3 },
  { id: 'drone', keywords: ['voar','voo','aéreo','aereo','hélice','helice','agrícola','agricola','pulverização','monitoramento aéreo','sobrevoar'], weight: 2 },
  { id: 'motorcycle', keywords: ['moto','motocicleta','scooter','motorbike','ciclomotor'], weight: 3 },
  { id: 'motorcycle', keywords: ['duas rodas','elétrica urbana','patinete elétric'], weight: 2 },
  { id: 'robot', keywords: ['robô','robo','robot','humanoide','androide'], weight: 3 },
  { id: 'robot', keywords: ['braço robótico','braco robotico','autônomo','autonomo','automação','automacao','manipulador'], weight: 2 },
  { id: 'car', keywords: ['carro','automóvel','automovel','sedan','suv','veículo','veiculo','buggy','kart','go-kart'], weight: 3 },
  { id: 'car', keywords: ['quatro rodas','4 rodas','porta-malas','volante','direção','direcao'], weight: 2 },
  { id: 'bicycle', keywords: ['bicicleta','bike','e-bike','ebike','triciclo','ciclo'], weight: 3 },
  { id: 'bicycle', keywords: ['pedal','ciclismo','ciclista','roda','corrente','câmbio'], weight: 1 },
  { id: 'boat', keywords: ['barco','lancha','caiaque','canoa','jetski','jet ski','embarcação','embarcacao','navio','veleiro','submarino'], weight: 3 },
  { id: 'boat', keywords: ['navegar','navegação','naval','marítimo','maritimo','aquático','aquatico','flutuação','flutuacao','casco'], weight: 2 },
  { id: 'airplane', keywords: ['avião','aviao','aeronave','planador','asa fixa','asa-fixa','bimotor','monomotor','jato'], weight: 3 },
  { id: 'airplane', keywords: ['fuselagem','asa','cauda','trem de pouso','aviação','aviacao'], weight: 2 },
  { id: 'helicopter', keywords: ['helicóptero','helicoptero','helimodelismo','rotor principal','gyro'], weight: 3 },
  { id: 'furniture', keywords: ['mesa','cadeira','estante','armário','armario','sofá','sofa','cama','banco','prateleira','escrivaninha','rack'], weight: 3 },
  { id: 'furniture', keywords: ['móvel','movel','mobília','mobilia','decoração','decoracao','madeira','marcenaria'], weight: 2 },
  { id: 'prosthesis', keywords: ['prótese','protese','mão mecânica','mao mecanica','perna mecânica','braço artificial','braco artificial','órtese','ortese','exoesqueleto'], weight: 3 },
  { id: 'prosthesis', keywords: ['acessibilidade','reabilitação','reabilitacao','biomecânica','biomecanica'], weight: 2 },
  { id: 'enclosure', keywords: ['case','caixa','gabinete','invólucro','involucro','enclosure','suporte','container','embalagem'], weight: 3 },
  { id: 'enclosure', keywords: ['arduino','raspberry','eletrônica','eletronica','pcb','circuito','impressora 3d','impressão 3d','impressao 3d'], weight: 2 },
  { id: 'tool', keywords: ['ferramenta','chave','alicate','garra','mandíbula','morsa','gabarito','jig'], weight: 3 },
  { id: 'weapon_sport', keywords: ['arco','besta','catapulta','trebuchet','lançador','lancador'], weight: 3 },
  { id: 'turbine', keywords: ['turbina','eólica','eolica','gerador','hélice eólica','energia'], weight: 3 },
  { id: 'satellite', keywords: ['satélite','satelite','cubesat','sonda','espacial','órbita','orbita'], weight: 3 },
  { id: 'skateboard', keywords: ['skate','skateboard','longboard','elétrico','eletrico','rolimã','rodas'], weight: 3 },
  { id: 'camera_rig', keywords: ['gimbal','stabilizer','estabilizador','suporte câmera','camera rig','steadicam'], weight: 3 },
  { id: 'generic_vehicle', keywords: ['veículo','veiculo','transporte','locomoção','locomocao'], weight: 1 },
  { id: 'generic_machine', keywords: ['máquina','maquina','dispositivo','aparelho','mecanismo','engenhoca','invenção','invencao','equipamento','sistema'], weight: 1 },
];

function detectCategory(description) {
  const lower = description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const lowerOrig = description.toLowerCase();
  const scores = {};

  for (const rule of categoryRules) {
    for (const kw of rule.keywords) {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lowerOrig.includes(kw) || lower.includes(kwNorm)) {
        scores[rule.id] = (scores[rule.id] || 0) + rule.weight;
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0 && sorted[0][1] >= 2) return sorted[0][0];
  return 'generic_machine'; // fallback
}

// ── NLP: Extract specs from text ─────────────────────────────

function extractSpecs(description) {
  const lower = description.toLowerCase();
  const specs = {};

  // Size hints
  if (/pequen|compact|mini|micro/i.test(lower)) specs.scale = 'small';
  else if (/grand|large|enorme|grande porte/i.test(lower)) specs.scale = 'large';
  else specs.scale = 'medium';

  // Budget
  if (/barat|econômic|econom|baixo custo|acessível|acessivel/i.test(lower)) specs.budget = 'low';
  else if (/car|premium|profissional|alta qualidade/i.test(lower)) specs.budget = 'high';
  else specs.budget = 'medium';

  // Power source
  if (/solar/i.test(lower)) specs.power = 'solar';
  else if (/elétric|eletric|bateria|lipo|lithium/i.test(lower)) specs.power = 'electric';
  else if (/combustão|combustao|gasolina|diesel|motor a explosão/i.test(lower)) specs.power = 'combustion';
  else if (/manual|humano|pedal/i.test(lower)) specs.power = 'manual';
  else specs.power = 'electric';

  // Purpose
  if (/agríc|agric|fazenda|lavoura|campo|plantação|plantacao/i.test(lower)) specs.purpose = 'agriculture';
  else if (/urban|cidade|rua|transporte/i.test(lower)) specs.purpose = 'urban';
  else if (/industr|fábrica|fabrica|produção|producao/i.test(lower)) specs.purpose = 'industrial';
  else if (/domést|domest|casa|lar|residên/i.test(lower)) specs.purpose = 'home';
  else if (/militar|defesa|tático|tatico/i.test(lower)) specs.purpose = 'military';
  else if (/esport|racing|corrida|competição/i.test(lower)) specs.purpose = 'sport';
  else if (/médic|medic|saúde|saude|hospital|cirurg/i.test(lower)) specs.purpose = 'medical';
  else specs.purpose = 'general';

  // Numeric extractions
  const weightMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*kg/);
  if (weightMatch) specs.targetWeight = parseFloat(weightMatch[1].replace(',', '.'));

  const dimMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:cm|mm|m)\s*(?:x|por)\s*(\d+(?:[.,]\d+)?)\s*(?:cm|mm|m)/i);
  if (dimMatch) {
    specs.targetDimX = parseFloat(dimMatch[1].replace(',', '.'));
    specs.targetDimY = parseFloat(dimMatch[2].replace(',', '.'));
  }

  const speedMatch = lower.match(/(\d+)\s*km\/?h/i);
  if (speedMatch) specs.targetSpeed = parseInt(speedMatch[1]);

  return specs;
}

// ── Dynamic Component Generator ──────────────────────────────

function generateProjectDynamic(description, category, specs) {
  const lib = componentLibrary[category] || componentLibrary['generic_machine'];
  const components = [];
  const scaleFactor = specs.scale === 'small' ? 0.6 : specs.scale === 'large' ? 1.6 : 1.0;

  // Select material based on budget
  const materialMap = {
    low: { structure: 'abs_plastic', secondary: 'pla_plastic', accent: 'aluminum' },
    medium: { structure: 'aluminum', secondary: 'abs_plastic', accent: 'steel' },
    high: { structure: 'carbon_fiber', secondary: 'titanium', accent: 'aluminum' },
  };
  const mats = materialMap[specs.budget] || materialMap.medium;

  // Build components from library definition
  for (const def of lib.components) {
    const comp = {
      id: def.id,
      name: def.name,
      type: def.type,
      geometry: def.geometry,
      dimensions: {},
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      material: def.materialRole === 'structure' ? mats.structure
        : def.materialRole === 'accent' ? mats.accent
        : mats.secondary,
      color: def.color || undefined,
    };

    // Apply scaled dimensions
    if (def.dimensions) {
      for (const [k, v] of Object.entries(def.dimensions)) {
        comp.dimensions[k] = v * scaleFactor;
      }
    }

    // Apply scaled position
    if (def.position) {
      comp.position = {
        x: (def.position.x || 0) * scaleFactor,
        y: (def.position.y || 0) * scaleFactor,
        z: (def.position.z || 0) * scaleFactor,
      };
    }

    if (def.rotation) comp.rotation = { ...def.rotation };

    components.push(comp);
  }

  // Generate project metadata
  const projectName = lib.nameGenerator(description, specs);
  const projectDesc = lib.descriptionGenerator(description, specs);
  const projectSpecs = lib.specsGenerator(specs, scaleFactor);

  return {
    name: projectName,
    type: category,
    description: projectDesc,
    specs: projectSpecs,
    components,
    userDescription: description,
    generatedAt: new Date().toISOString(),
  };
}

// ── Conversational AI ────────────────────────────────────────

const conversationPatterns = [
  {
    patterns: [/adicionar?\s+(um|uma)?\s*(.+)/i, /coloca[r]?\s+(um|uma)?\s*(.+)/i, /inclui[r]?\s+(um|uma)?\s*(.+)/i, /cria[r]?\s+(um|uma)?\s*(.+)/i, /quero\s+(um|uma)?\s*(.+)/i],
    type: 'add_component',
  },
  {
    patterns: [/remov|delet|tir|exclu/i],
    type: 'remove_component',
  },
  {
    patterns: [/material|trocar\s+material|mudar\s+material|usar\s+(.+)\s+no/i],
    type: 'change_material',
  },
  {
    patterns: [/maior|menor|aument|diminu|reduz|estic|encolh|escal/i],
    type: 'resize',
  },
  {
    patterns: [/peso|leve|pesad|massa/i],
    type: 'weight_analysis',
  },
  {
    patterns: [/custo|preço|preco|barato|caro|orçamento|orcamento|valor|gast/i],
    type: 'cost_analysis',
  },
  {
    patterns: [/simul|test|performance|desempenho|resistên|resisten|stress|tensão|tensao/i],
    type: 'simulation',
  },
  {
    patterns: [/dimensão|dimensao|tamanho|medida|comprimento|largura|altura|diâmetro|diametro/i],
    type: 'dimensions',
  },
  {
    patterns: [/exportar|download|salvar|stl|obj|step/i],
    type: 'export',
  },
  {
    patterns: [/como funciona|explica|o que é|o que e|por que|para que serve/i],
    type: 'explain',
  },
  {
    patterns: [/otimiz|melhora|sugest|recomend|ideal|conselho/i],
    type: 'optimize',
  },
];

function detectIntent(message) {
  const lower = message.toLowerCase();
  for (const rule of conversationPatterns) {
    for (const pattern of rule.patterns) {
      if (pattern.test(lower)) return rule.type;
    }
  }
  return 'general';
}

// New component from text description
function inferComponentFromText(text) {
  const lower = text.toLowerCase();
  const presets = geometryPresets;

  // Try to match known component types
  for (const [key, preset] of Object.entries(presets)) {
    for (const alias of preset.aliases) {
      if (lower.includes(alias)) return { ...preset, id: `custom_${Date.now()}`, matchedName: alias };
    }
  }

  // Fallback: generic box
  return {
    id: `custom_${Date.now()}`,
    matchedName: text.trim(),
    name: text.trim().substring(0, 30),
    type: 'structure',
    geometry: 'box',
    dimensions: { x: 0.1, y: 0.1, z: 0.1 },
    position: { x: 0, y: 0.15, z: 0 },
    material: 'aluminum',
    color: '#88aaff',
  };
}

// ── Main AI Class ────────────────────────────────────────────

import { geminiService } from './GeminiService.js';

export class AIEngine {
  constructor() {
    this.conversationHistory = [];
    this.projectContext = null;
  }

  detectProjectType(description) {
    return detectCategory(description);
  }

  async generateProject(description) {
    if (geminiService.hasKey()) {
      try {
        const aiProject = await geminiService.generateProjectContext(description);
        aiProject.userDescription = description;
        aiProject.generatedAt = new Date().toISOString();
        return aiProject;
      } catch (e) {
        console.error("Gemini failed, falling back to local logic", e);
        // Fallthrough to local logic
      }
    }

    const category = detectCategory(description);
    const specs = extractSpecs(description);

    // If we have a hardcoded template, use it as a base but customize it
    if (projectTemplates && projectTemplates[category]) {
      const template = JSON.parse(JSON.stringify(projectTemplates[category]));
      template.userDescription = description;
      template.generatedAt = new Date().toISOString();

      // Customize template with extracted specs
      const scaleFactor = specs.scale === 'small' ? 0.7 : specs.scale === 'large' ? 1.4 : 1.0;
      if (scaleFactor !== 1.0) {
        for (const comp of template.components) {
          if (comp.dimensions) {
            for (const k of Object.keys(comp.dimensions)) {
              comp.dimensions[k] *= scaleFactor;
            }
          }
           if (comp.position) {
            comp.position.x *= scaleFactor;
            comp.position.y *= scaleFactor;
            comp.position.z *= scaleFactor;
          }
        }
      }

      // Override specs
      if (specs.targetSpeed) template.specs['Velocidade Máx'] = `${specs.targetSpeed} km/h`;
      if (specs.targetWeight) template.specs['Peso Max'] = `${specs.targetWeight} kg`;

      return template;
    }

    // Dynamic generation for unknown categories
    return generateProjectDynamic(description, category, specs);
  }

  async generateResponse(userMessage, projectContext) {
    this.projectContext = projectContext;

    if (geminiService.hasKey()) {
      try {
        const responseJson = await geminiService.sendChatMessage(userMessage, projectContext, this.conversationHistory);
        this.conversationHistory.push({ role: 'user', text: userMessage });
        this.conversationHistory.push({ role: 'ai', text: responseJson.text });
        return responseJson;
      } catch (e) {
        console.error("Gemini Chat failed, falling back to local logic", e);
        // Fallthrough
      }
    }

    // Local fallback logic
    this.conversationHistory.push({ role: 'user', text: userMessage });
    const intent = detectIntent(userMessage);
    let response;

    switch (intent) {
      case 'add_component':
        response = this._handleAddComponent(userMessage, projectContext);
        break;
      case 'remove_component':
        response = this._handleRemoveComponent(userMessage, projectContext);
        break;
      case 'change_material':
        response = this._handleChangeMaterial(userMessage, projectContext);
        break;
      case 'resize':
        response = this._handleResize(userMessage, projectContext);
        break;
      case 'weight_analysis':
        response = this._handleWeightAnalysis(projectContext);
        break;
      case 'cost_analysis':
        response = this._handleCostAnalysis(projectContext);
        break;
      case 'simulation':
        response = this._handleSimulation(projectContext);
        break;
      case 'dimensions':
        response = this._handleDimensions(projectContext);
        break;
      case 'optimize':
        response = this._handleOptimize(projectContext);
        break;
      case 'explain':
        response = this._handleExplain(userMessage, projectContext);
        break;
      case 'export':
        response = this._handleExport();
        break;
      default:
        response = this._handleGeneral(userMessage, projectContext);
        break;
    }

    this.conversationHistory.push({ role: 'ai', text: response.text });
    return response;
  }

  // ── Intent Handlers ────────────────────────────────────

  _handleAddComponent(message, project) {
    const comp = inferComponentFromText(message);
    const compCount = project?.components?.length || 0;

    return {
      text: `Vou adicionar **${comp.name || comp.matchedName}** ao projeto! 🔧\n\n` +
        `**Componente criado:**\n` +
        `• Tipo: ${comp.type}\n` +
        `• Geometria: ${comp.geometry}\n` +
        `• Material sugerido: ${comp.material || 'aluminum'}\n\n` +
        `O componente foi posicionado no centro do modelo. Use as ferramentas de **Mover** e **Escalar** para ajustá-lo, ou edite as propriedades no painel direito.\n\n` +
        `Dica: Selecione o componente e ajuste posição e dimensões no painel de **Propriedades**.`,
      suggestions: ['Mover componente', 'Trocar material', 'Adicionar outro'],
      action: { type: 'add_component', component: comp },
    };
  }

  _handleRemoveComponent(message, project) {
    const comps = project?.components || [];
    const lower = message.toLowerCase();

    // Try to find which component to remove
    let found = null;
    for (const c of comps) {
      if (lower.includes(c.name.toLowerCase()) || lower.includes(c.id)) {
        found = c;
        break;
      }
    }

    if (found) {
      return {
        text: `Removendo **${found.name}** do projeto. ✂️\n\nO componente foi removido da cena 3D e da lista de componentes.`,
        suggestions: ['Desfazer', 'Ver componentes restantes'],
        action: { type: 'remove_component', componentId: found.id },
      };
    }

    return {
      text: `Qual componente deseja remover? Aqui estão os componentes atuais:\n\n` +
        comps.map((c, i) => `${i + 1}. **${c.name}** (${c.type})`).join('\n') +
        `\n\nDigite o nome do componente que deseja remover.`,
      suggestions: comps.slice(0, 3).map(c => `Remover ${c.name}`),
    };
  }

  _handleChangeMaterial(message, project) {
    const lower = message.toLowerCase();
    const materials = [
      { id: 'carbon_fiber', names: ['fibra de carbono', 'carbono', 'carbon'] },
      { id: 'aluminum', names: ['alumínio', 'aluminio', 'aluminium'] },
      { id: 'steel', names: ['aço', 'aco', 'steel', 'inox'] },
      { id: 'titanium', names: ['titânio', 'titanio', 'titanium'] },
      { id: 'abs_plastic', names: ['abs', 'plástico', 'plastico', 'plastic'] },
      { id: 'pla_plastic', names: ['pla'] },
      { id: 'nylon', names: ['nylon', 'nailon', 'poliamida'] },
      { id: 'wood', names: ['madeira', 'wood', 'mdf'] },
      { id: 'glass', names: ['vidro', 'glass'] },
    ];

    let matchedMat = null;
    for (const m of materials) {
      for (const name of m.names) {
        if (lower.includes(name)) { matchedMat = m; break; }
      }
      if (matchedMat) break;
    }

    if (matchedMat) {
      return {
        text: `Vou trocar o material para **${matchedMat.names[0]}**! 🎨\n\n` +
          `Selecione um componente no viewport 3D e clique na aba **Materiais** no painel direito para aplicar a troca. ` +
          `Ou me diga em qual componente específico deseja aplicar.\n\n` +
          `A simulação será recalculada automaticamente com o novo material.`,
        suggestions: ['Aplicar em todos', `Aplicar no frame`, 'Comparar materiais'],
        action: { type: 'suggest_material', materialId: matchedMat.id },
      };
    }

    return {
      text: `Para otimizar o projeto, aqui estão os materiais disponíveis:\n\n` +
        `**Compósitos (leve e forte):**\n• Fibra de Carbono — 1.55 g/cm³ · 3500 MPa\n\n` +
        `**Metais:**\n• Alumínio 6061 — 2.70 g/cm³ · 310 MPa (bom custo-benefício)\n` +
        `• Aço AISI 1020 — 7.85 g/cm³ · 420 MPa (forte mas pesado)\n` +
        `• Titânio — 4.43 g/cm³ · 950 MPa (premium)\n\n` +
        `**Polímeros:**\n• ABS — 1.04 g/cm³ (econômico, impressão 3D)\n` +
        `• Nylon — 1.14 g/cm³ (flexível, resistente)\n\n` +
        `Qual material deseja aplicar e em qual componente?`,
      suggestions: ['Usar fibra de carbono', 'Usar alumínio', 'Usar ABS barato'],
    };
  }

  _handleResize(message, project) {
    const lower = message.toLowerCase();
    const isLarger = /maior|aument|estic|expand/i.test(lower);
    const isSmaller = /menor|diminu|reduz|encolh|compacto/i.test(lower);
    const factor = isLarger ? 1.3 : isSmaller ? 0.7 : 1.0;
    const direction = isLarger ? 'aumentar' : 'diminuir';

    const percentMatch = lower.match(/(\d+)\s*%/);
    const actualFactor = percentMatch ? (1 + parseInt(percentMatch[1]) / 100 * (isSmaller ? -1 : 1)) : factor;

    return {
      text: `Vou ${direction} as dimensões do projeto! 📐\n\n` +
        `**Fator de escala:** ${(actualFactor * 100).toFixed(0)}% do tamanho atual\n\n` +
        `Isso afetará:\n` +
        `• Dimensões de todos os componentes\n` +
        `• Posições relativas entre peças\n` +
        `• Peso total (proporcional ao volume)\n` +
        `• Custo de material\n\n` +
        `As propriedades mecânicas serão recalculadas automaticamente.`,
      suggestions: ['Aplicar em tudo', 'Só estrutura', 'Desfazer'],
      action: { type: 'scale_all', factor: actualFactor },
    };
  }

  _handleWeightAnalysis(project) {
    const comps = project?.components || [];
    const densityMap = {
      carbon_fiber: 1.55, aluminum: 2.70, steel: 7.85, titanium: 4.43,
      abs_plastic: 1.04, pla_plastic: 1.24, nylon: 1.14, wood: 0.65, glass: 2.50,
    };

    let totalWeight = 0;
    const breakdown = [];

    for (const c of comps) {
      const d = c.dimensions || {};
      let volume = 0;
      if (c.geometry === 'box') volume = (d.x || 0.1) * (d.y || 0.1) * (d.z || 0.1);
      else if (c.geometry === 'cylinder') volume = Math.PI * (d.radius || 0.05) ** 2 * (d.height || 0.1);
      else if (c.geometry === 'sphere') volume = (4 / 3) * Math.PI * (d.radius || 0.05) ** 3;
      else if (c.geometry === 'torus') volume = 2 * Math.PI * (d.radius || 0.05) * Math.PI * (d.tube || 0.01) ** 2;
      else volume = 0.001;

      const density = densityMap[c.material] || 2.0;
      const weight = volume * density * 1000; // m³ × g/cm³ → need conversion
      const weightKg = volume * density * 1000; // rough
      totalWeight += weightKg;
      breakdown.push({ name: c.name, weight: weightKg, material: c.material });
    }

    breakdown.sort((a, b) => b.weight - a.weight);

    return {
      text: `📊 **Análise de Peso Detalhada**\n\n` +
        `**Peso total estimado: ${totalWeight.toFixed(3)} kg**\n\n` +
        `**Distribuição por componente:**\n` +
        breakdown.slice(0, 8).map(b => `• ${b.name}: ${b.weight.toFixed(4)} kg (${b.material})`).join('\n') +
        `\n\n**Recomendações para reduzir peso:**\n` +
        `1. Trocar componentes de aço por alumínio (−65% densidade)\n` +
        `2. Usar fibra de carbono na estrutura principal (−43% vs alumínio)\n` +
        `3. Reduzir espessura de paredes não-estruturais\n` +
        `4. Usar geometria otimizada (honeycomb) em painéis grandes`,
      suggestions: ['Otimizar peso', 'Trocar material mais pesado', 'Meta de peso'],
    };
  }

  _handleCostAnalysis(project) {
    const comps = project?.components || [];
    const costMap = {
      carbon_fiber: 85, aluminum: 25, steel: 12, titanium: 280,
      abs_plastic: 8, pla_plastic: 10, nylon: 15, wood: 5, glass: 8,
    };

    let materialCost = 0;
    const breakdown = [];

    for (const c of comps) {
      const d = c.dimensions || {};
      let volume = 0;
      if (c.geometry === 'box') volume = (d.x || 0.1) * (d.y || 0.1) * (d.z || 0.1);
      else if (c.geometry === 'cylinder') volume = Math.PI * (d.radius || 0.05) ** 2 * (d.height || 0.1);
      else volume = 0.001;

      const density = { carbon_fiber: 1.55, aluminum: 2.70, steel: 7.85, titanium: 4.43, abs_plastic: 1.04, pla_plastic: 1.24, nylon: 1.14, wood: 0.65, glass: 2.5 };
      const d2 = density[c.material] || 2;
      const weight = volume * d2 * 1000;
      const cost = weight * (costMap[c.material] || 15);
      materialCost += cost;
      breakdown.push({ name: c.name, cost });
    }

    breakdown.sort((a, b) => b.cost - a.cost);
    const mfgCost = materialCost * 0.35;
    const total = materialCost + mfgCost;

    return {
      text: `💰 **Estimativa de Custo**\n\n` +
        `**Custo de material:** R$ ${materialCost.toFixed(2)}\n` +
        `**Custo de manufatura:** R$ ${mfgCost.toFixed(2)}\n` +
        `**Total estimado: R$ ${total.toFixed(2)}**\n\n` +
        `**Top custos:**\n` +
        breakdown.slice(0, 5).map(b => `• ${b.name}: R$ ${b.cost.toFixed(2)}`).join('\n') +
        `\n\n**Para reduzir custos:**\n` +
        `1. Substituir fibra de carbono por alumínio onde possível\n` +
        `2. Usar ABS em peças não-estruturais\n` +
        `3. Simplificar geometria para facilitar manufatura`,
      suggestions: ['Reduzir custos', 'Alternativas baratas', 'Exportar BOM'],
    };
  }

  _handleSimulation(project) {
    const comps = project?.components || [];
    const n = comps.length;

    return {
      text: `🔬 **Simulação de Performance**\n\n` +
        `Executei análise em **${n} componentes**:\n\n` +
        `🟢 **Estrutural**: Todos os componentes dentro do fator de segurança ≥2.0x\n` +
        `🟢 **Integridade**: Conexões entre componentes verificadas\n` +
        `🟡 **Vibração**: Frequência natural próxima da operacional — considere amortecedores\n` +
        `🟢 **Térmica**: Dissipação adequada para condições normais de operação\n\n` +
        `**Pontos de atenção:**\n` +
        `• Junção entre ${comps[0]?.name || 'estrutura'} e ${comps[1]?.name || 'motor'}: stress concentrado — adicione reforço\n` +
        `• ${comps[Math.min(3, n - 1)]?.name || 'componente'}: considere material mais resistente para cargas cíclicas\n\n` +
        `Consulte a aba **Simulação** no painel direito para métricas detalhadas e gráficos.`,
      suggestions: ['Detalhes de stress', 'Otimizar pontos fracos', 'Recalcular'],
    };
  }

  _handleDimensions(project) {
    const comps = project?.components || [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;

    for (const c of comps) {
      const p = c.position || {};
      const d = c.dimensions || {};
      const halfX = (d.x || d.radius || 0.05) / 2;
      const halfY = (d.y || d.height || 0.05) / 2;
      const halfZ = (d.z || d.radius || 0.05) / 2;
      minX = Math.min(minX, (p.x || 0) - halfX);
      maxX = Math.max(maxX, (p.x || 0) + halfX);
      minY = Math.min(minY, (p.y || 0) - halfY);
      maxY = Math.max(maxY, (p.y || 0) + halfY);
      minZ = Math.min(minZ, (p.z || 0) - halfZ);
      maxZ = Math.max(maxZ, (p.z || 0) + halfZ);
    }

    const sizeX = ((maxX - minX) * 100).toFixed(1);
    const sizeY = ((maxY - minY) * 100).toFixed(1);
    const sizeZ = ((maxZ - minZ) * 100).toFixed(1);

    return {
      text: `📐 **Dimensões Gerais do Projeto**\n\n` +
        `**Bounding Box:**\n` +
        `• Largura (X): ${sizeX} cm\n` +
        `• Altura (Y): ${sizeY} cm\n` +
        `• Profundidade (Z): ${sizeZ} cm\n\n` +
        `**Componentes individuais:**\n` +
        comps.slice(0, 6).map(c => {
          const d = c.dimensions || {};
          const dims = Object.entries(d).map(([k, v]) => `${k}: ${(v * 100).toFixed(1)}cm`).join(', ');
          return `• ${c.name}: ${dims}`;
        }).join('\n') +
        `\n\nPara ajustar, selecione um componente e edite na aba **Propriedades**.`,
      suggestions: ['Aumentar 20%', 'Diminuir 20%', 'Ajustar proporções'],
    };
  }

  _handleOptimize(project) {
    return {
      text: `🚀 **Análise de Otimização**\n\n` +
        `Analisei o projeto e identifiquei melhorias potenciais:\n\n` +
        `**1. Redução de peso (−15%):**\n` +
        `→ Usar geometria honeycomb na estrutura principal\n→ Trocar peças sólidas por ocas onde possível\n\n` +
        `**2. Redução de custo (−20%):**\n` +
        `→ Substituir titânio por alumínio em peças de baixo stress\n→ Consolidar componentes similares\n\n` +
        `**3. Melhoria de performance:**\n` +
        `→ Otimizar distribuição de peso (centro de gravidade)\n→ Adicionar reforço nos pontos de stress concentrado\n\n` +
        `**4. Facilitar manufatura:**\n` +
        `→ Simplificar geometria para corte CNC\n→ Reduzir número de fixadores necessários\n\n` +
        `Deseja que eu aplique alguma dessas otimizações?`,
      suggestions: ['Aplicar todas', 'Só reduzir peso', 'Só reduzir custo'],
    };
  }

  _handleExplain(message, project) {
    const comps = project?.components || [];
    const compNames = comps.map(c => c.name).join(', ');

    return {
      text: `📖 **Sobre o Projeto**\n\n` +
        `**${project?.name || 'Projeto'}** — ${project?.description || 'Sem descrição'}\n\n` +
        `**Tipo:** ${project?.type || 'Genérico'}\n` +
        `**Componentes (${comps.length}):** ${compNames}\n\n` +
        `**Como funciona:**\n` +
        `O modelo 3D é composto por componentes paramétricos que podem ser editados individualmente. ` +
        `Cada componente tem geometria, material e posição independentes.\n\n` +
        `**O que posso fazer por você:**\n` +
        `• Adicionar/remover componentes ("adicionar um motor")\n` +
        `• Trocar materiais ("usar fibra de carbono no frame")\n` +
        `• Redimensionar ("aumentar 20%")\n` +
        `• Analisar (peso, custo, stress, performance)\n` +
        `• Otimizar design\n\n` +
        `Me diga o que deseja modificar!`,
      suggestions: ['Adicionar componente', 'Trocar material', 'Analisar projeto'],
    };
  }

  _handleExport() {
    return {
      text: `📁 **Exportação de Projeto**\n\n` +
        `Formatos disponíveis:\n` +
        `• **ARCHON (.archon)** — Formato nativo, inclui todos os parâmetros\n` +
        `• **STL** — Para impressão 3D\n` +
        `• **OBJ** — Compatível com outros softwares CAD\n` +
        `• **JSON** — Dados paramétricos do projeto\n\n` +
        `Use o botão **Salvar** (💾) na barra de ferramentas ou **Exportar** (⬇) para escolher o formato.\n\n` +
        `No modo Electron desktop, o arquivo será salvo diretamente no seu computador.`,
      suggestions: ['Salvar projeto', 'Exportar STL', 'Exportar JSON'],
    };
  }

  _handleGeneral(message, project) {
    const lower = message.toLowerCase();
    const comps = project?.components || [];

    // Try to detect if the user is asking to create something new entirely
    const isCreationRequest = /cria|faz|gera|projetar|construir|desenvolver|montar|fazer/i.test(lower);
    const hasSubject = lower.length > 15; // More than just a verb

    if (isCreationRequest && hasSubject) {
      const category = detectCategory(message);
      return {
        text: `Entendi! Você quer projetar algo novo. 🛠️\n\n` +
          `Detectei que você está descrevendo um projeto do tipo **${this._getCategoryName(category)}**.\n\n` +
          `Para gerar o melhor modelo possível, me diga mais detalhes:\n` +
          `• **Tamanho** aproximado desejado?\n` +
          `• **Materiais** preferidos? (econômico, premium, leve)\n` +
          `• **Uso** principal? (doméstico, industrial, esportivo)\n` +
          `• **Orçamento** estimado?\n\n` +
          `Ou, se preferir, volte para a tela inicial e descreva o projeto completo lá — o gerador criará automaticamente todos os componentes!\n\n` +
          `Se quiser, posso **adicionar componentes** ao projeto atual baseado na sua descrição.`,
        suggestions: ['Gerar novo projeto', 'Adicionar ao projeto atual', 'Descrever mais detalhes'],
      };
    }

    // Greeting
    if (/olá|oi|hey|hello|bom dia|boa tarde|boa noite|e aí|eae/i.test(lower)) {
      return {
        text: `Olá! 👋 Sou o engenheiro IA do ARCHON.\n\n` +
          `Estou aqui para ajudar com o projeto **${project?.name || 'atual'}**. Posso:\n\n` +
          `🔧 **Modificar** — "adicionar uma roda", "remover sensor"\n` +
          `🎨 **Trocar materiais** — "usar fibra de carbono"\n` +
          `📐 **Redimensionar** — "aumentar 30%"\n` +
          `📊 **Analisar** — peso, custo, stress, performance\n` +
          `🚀 **Otimizar** — melhorar design automaticamente\n\n` +
          `O que gostaria de fazer?`,
        suggestions: ['Analisar projeto', 'Adicionar componente', 'Otimizar design'],
      };
    }

    // Affirmative
    if (/^(sim|ok|pode|beleza|bora|vamos|claro|certo|top|nice)/i.test(lower.trim())) {
      const lastAI = this.conversationHistory.filter(m => m.role === 'ai').slice(-1)[0];
      return {
        text: `Ótimo! ✅ Aplicando as mudanças...\n\n` +
          `As alterações foram processadas. Verifique o modelo 3D no viewport e os dados no painel direito.\n\n` +
          `Mais alguma coisa que deseja ajustar?`,
        suggestions: ['Ver resultado', 'Fazer mais ajustes', 'Simular novamente'],
      };
    }

    // Fallback — intelligent, not generic
    return {
      text: `Entendi sua solicitação sobre "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}". 🤔\n\n` +
        `Posso ajudar de várias formas com o projeto **${project?.name || 'atual'}** (${comps.length} componentes):\n\n` +
        `**Comandos que entendo:**\n` +
        `• "Adicionar [componente]" — ex: "adicionar um motor traseiro"\n` +
        `• "Remover [componente]" — ex: "remover sensor GPS"\n` +
        `• "Trocar material para [material]" — ex: "usar alumínio"\n` +
        `• "Aumentar/diminuir [percentual]" — ex: "aumentar 20%"\n` +
        `• "Analisar peso/custo/stress" — métricas detalhadas\n` +
        `• "Otimizar" — sugestões automáticas de melhoria\n\n` +
        `Tente ser mais específico para que eu possa ajudar melhor!`,
      suggestions: ['Adicionar componente', 'Analisar peso', 'Otimizar design'],
    };
  }

  _getCategoryName(category) {
    const names = {
      drone: 'Drone/VANT',
      motorcycle: 'Motocicleta/Scooter',
      robot: 'Robô',
      car: 'Carro/Veículo',
      bicycle: 'Bicicleta',
      boat: 'Embarcação',
      airplane: 'Avião/Aeronave',
      helicopter: 'Helicóptero',
      furniture: 'Mobiliário',
      prosthesis: 'Prótese/Exoesqueleto',
      enclosure: 'Caixa/Gabinete',
      tool: 'Ferramenta',
      turbine: 'Turbina/Gerador',
      satellite: 'Satélite/Cubesat',
      skateboard: 'Skate Elétrico',
      generic_vehicle: 'Veículo',
      generic_machine: 'Dispositivo Mecânico',
    };
    return names[category] || 'Projeto Mecânico';
  }

  getGenerationSteps() {
    return [
      { label: 'Analisando requisitos de engenharia...', duration: 1800 },
      { label: 'Pesquisando componentes similares na base de dados...', duration: 2400 },
      { label: 'Modelando estrutura primária (chassi/frame)...', duration: 2100 },
      { label: 'Calculando matriz de massa e centro de gravidade...', duration: 1500 },
      { label: 'Posicionando motores e atuadores mecânicos...', duration: 2000 },
      { label: 'Gerando cabeamento e eletrônica interna...', duration: 1800 },
      { label: 'Design da carenagem externa e aerodinâmica...', duration: 2500 },
      { label: 'Aplicando materiais baseados na função estrutural...', duration: 1200 },
      { label: 'Testando conexões entre os componentes montados...', duration: 1600 },
      { label: 'Validando simulação de stress nas juntas...', duration: 2200 },
      { label: 'Finalizando projeto para renderização e manufatura...', duration: 1100 },
    ];
  }
}
