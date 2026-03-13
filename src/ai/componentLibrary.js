// ═══════════════════════════════════════════════════════════════
// ARCHON — Component Library (Dynamic Generation Templates)
// ═══════════════════════════════════════════════════════════════

// Geometry presets for component inference from text
export const geometryPresets = {
  motor: {
    aliases: ['motor', 'engine', 'propulsor', 'propulsão', 'propulsao'],
    name: 'Motor',
    type: 'motor',
    geometry: 'cylinder',
    dimensions: { radius: 0.025, height: 0.04 },
    position: { x: 0, y: 0.1, z: 0 },
    material: 'aluminum',
    color: '#666666',
  },
  wheel: {
    aliases: ['roda', 'pneu', 'tire', 'wheel'],
    name: 'Roda',
    type: 'wheel',
    geometry: 'torus',
    dimensions: { radius: 0.15, tube: 0.04 },
    position: { x: 0, y: 0.15, z: 0 },
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    material: 'nylon',
    color: '#222222',
  },
  propeller: {
    aliases: ['hélice', 'helice', 'propeller', 'pá', 'pa'],
    name: 'Hélice',
    type: 'propeller',
    geometry: 'torus',
    dimensions: { radius: 0.065, tube: 0.003 },
    position: { x: 0, y: 0.2, z: 0 },
    material: 'abs_plastic',
    color: '#00d4ff',
  },
  battery: {
    aliases: ['bateria', 'battery', 'lipo', 'célula', 'celula', 'acumulador'],
    name: 'Bateria',
    type: 'electronics',
    geometry: 'box',
    dimensions: { x: 0.08, y: 0.03, z: 0.04 },
    position: { x: 0, y: 0.05, z: 0 },
    material: 'abs_plastic',
    color: '#ffaa00',
  },
  sensor: {
    aliases: ['sensor', 'câmera', 'camera', 'lidar', 'radar', 'gps', 'giroscópio', 'giroscopio', 'acelerômetro', 'acelerometro'],
    name: 'Sensor',
    type: 'sensor',
    geometry: 'sphere',
    dimensions: { radius: 0.015 },
    position: { x: 0, y: 0.15, z: 0.1 },
    material: 'abs_plastic',
    color: '#00ff88',
  },
  frame: {
    aliases: ['frame', 'chassi', 'chassis', 'quadro', 'estrutura', 'corpo'],
    name: 'Estrutura Principal',
    type: 'structure',
    geometry: 'box',
    dimensions: { x: 0.3, y: 0.05, z: 0.2 },
    position: { x: 0, y: 0.1, z: 0 },
    material: 'aluminum',
    color: '#ccccdd',
  },
  seat: {
    aliases: ['assento', 'banco', 'selim', 'cadeira', 'poltrona', 'seat'],
    name: 'Assento',
    type: 'comfort',
    geometry: 'box',
    dimensions: { x: 0.15, y: 0.05, z: 0.15 },
    position: { x: 0, y: 0.25, z: -0.05 },
    material: 'nylon',
    color: '#333344',
  },
  arm: {
    aliases: ['braço', 'braco', 'arm', 'garra', 'manipulador', 'pinça', 'pinca'],
    name: 'Braço Mecânico',
    type: 'actuator',
    geometry: 'cylinder',
    dimensions: { radius: 0.015, height: 0.12 },
    position: { x: 0.05, y: 0.15, z: 0 },
    material: 'aluminum',
    color: '#aaaacc',
  },
  panel: {
    aliases: ['painel', 'placa', 'tela', 'display', 'lcd', 'screen', 'solar'],
    name: 'Painel',
    type: 'electronics',
    geometry: 'box',
    dimensions: { x: 0.15, y: 0.005, z: 0.1 },
    position: { x: 0, y: 0.2, z: 0 },
    material: 'glass',
    color: '#3366aa',
  },
  base: {
    aliases: ['base', 'apoio', 'suporte', 'pedestal', 'fundação', 'fundacao'],
    name: 'Base',
    type: 'structure',
    geometry: 'box',
    dimensions: { x: 0.2, y: 0.03, z: 0.2 },
    position: { x: 0, y: 0.015, z: 0 },
    material: 'steel',
    color: '#555566',
  },
  controller: {
    aliases: ['controlador', 'placa', 'arduino', 'raspberry', 'microcontrolador', 'esc', 'cpu'],
    name: 'Controlador',
    type: 'electronics',
    geometry: 'box',
    dimensions: { x: 0.06, y: 0.015, z: 0.04 },
    position: { x: 0, y: 0.08, z: 0 },
    material: 'abs_plastic',
    color: '#006633',
  },
  pipe: {
    aliases: ['tubo', 'cano', 'eixo', 'barra', 'cilindro', 'coluna', 'pilar'],
    name: 'Tubo/Eixo',
    type: 'structure',
    geometry: 'cylinder',
    dimensions: { radius: 0.01, height: 0.2 },
    position: { x: 0, y: 0.1, z: 0 },
    material: 'steel',
    color: '#888899',
  },
  wing: {
    aliases: ['asa', 'aerofólio', 'aerofolio', 'aileron', 'flap'],
    name: 'Asa',
    type: 'body',
    geometry: 'box',
    dimensions: { x: 0.5, y: 0.01, z: 0.12 },
    position: { x: 0, y: 0.15, z: 0 },
    material: 'carbon_fiber',
    color: '#ddddee',
  },
  hull: {
    aliases: ['casco', 'fuselagem', 'carroçaria', 'carrocaria', 'carenagem', 'cobertura'],
    name: 'Casco/Fuselagem',
    type: 'body',
    geometry: 'box',
    dimensions: { x: 0.15, y: 0.12, z: 0.4 },
    position: { x: 0, y: 0.08, z: 0 },
    material: 'carbon_fiber',
    color: '#ffffff',
  },
  leg: {
    aliases: ['perna', 'pé', 'pe', 'apoio', 'trem de pouso'],
    name: 'Perna/Apoio',
    type: 'structure',
    geometry: 'cylinder',
    dimensions: { radius: 0.008, height: 0.1 },
    position: { x: 0.05, y: 0.05, z: 0 },
    material: 'aluminum',
    color: '#aaaaaa',
  },
  light: {
    aliases: ['led', 'luz', 'farol', 'lanterna', 'iluminação'],
    name: 'LED/Luz',
    type: 'electronics',
    geometry: 'sphere',
    dimensions: { radius: 0.008 },
    position: { x: 0, y: 0.12, z: 0.1 },
    material: 'glass',
    color: '#ffffff',
  },
};

// ── Build helpers ────────────────────────────────────────────

function c(id, name, type, geometry, dims, pos, matRole, color, rotation) {
  return { id, name, type, geometry, dimensions: dims, position: pos, materialRole: matRole, color, rotation };
}

// ── Component Library per Category ───────────────────────────

export const componentLibrary = {

  // ═══ CAR ═══════════════════════════════════════════════
  car: {
    nameGenerator: (desc, specs) => {
      if (/buggy/i.test(desc)) return 'Buggy Elétrico';
      if (/kart|go-kart/i.test(desc)) return 'Go-Kart';
      if (/suv/i.test(desc)) return 'SUV Compacto';
      return 'Carro EV Compacto';
    },
    descriptionGenerator: (desc, specs) => `Veículo ${specs.power === 'electric' ? 'elétrico' : 'a combustão'} projetado para uso ${specs.purpose === 'urban' ? 'urbano' : 'geral'}. Baseado na descrição: "${desc.substring(0, 80)}"`,
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Veículo 4 rodas',
      'Tração': specs.power === 'electric' ? 'Elétrica' : 'Combustão',
      'Comprimento': `${(180 * scale).toFixed(0)} cm`,
      'Largura': `${(80 * scale).toFixed(0)} cm`,
      'Peso Estimado': `${(specs.budget === 'low' ? 120 : 85) * scale} kg`,
    }),
    components: [
      c('chassis', 'Chassi', 'structure', 'box', { x: 0.35, y: 0.04, z: 0.7 }, { x: 0, y: 0.08, z: 0 }, 'structure', '#aaaacc'),
      c('body', 'Carroçaria', 'body', 'box', { x: 0.3, y: 0.12, z: 0.5 }, { x: 0, y: 0.18, z: -0.02 }, 'structure', '#2255ee'),
      c('hood', 'Capô', 'body', 'box', { x: 0.28, y: 0.03, z: 0.2 }, { x: 0, y: 0.2, z: 0.25 }, 'accent', '#2255ee'),
      c('wheel_fl', 'Roda Diant. Esq.', 'wheel', 'torus', { radius: 0.06, tube: 0.025 }, { x: -0.18, y: 0.06, z: 0.22 }, 'secondary', '#111111', { x: Math.PI/2, y: 0, z: 0 }),
      c('wheel_fr', 'Roda Diant. Dir.', 'wheel', 'torus', { radius: 0.06, tube: 0.025 }, { x: 0.18, y: 0.06, z: 0.22 }, 'secondary', '#111111', { x: Math.PI/2, y: 0, z: 0 }),
      c('wheel_rl', 'Roda Tras. Esq.', 'wheel', 'torus', { radius: 0.06, tube: 0.025 }, { x: -0.18, y: 0.06, z: -0.22 }, 'secondary', '#111111', { x: Math.PI/2, y: 0, z: 0 }),
      c('wheel_rr', 'Roda Tras. Dir.', 'wheel', 'torus', { radius: 0.06, tube: 0.025 }, { x: 0.18, y: 0.06, z: -0.22 }, 'secondary', '#111111', { x: Math.PI/2, y: 0, z: 0 }),
      c('seat_l', 'Banco Motorista', 'comfort', 'box', { x: 0.1, y: 0.12, z: 0.1 }, { x: -0.08, y: 0.18, z: -0.05 }, 'secondary', '#222233'),
      c('seat_r', 'Banco Passageiro', 'comfort', 'box', { x: 0.1, y: 0.12, z: 0.1 }, { x: 0.08, y: 0.18, z: -0.05 }, 'secondary', '#222233'),
      c('motor_ev', 'Motor Elétrico', 'motor', 'cylinder', { radius: 0.04, height: 0.08 }, { x: 0, y: 0.06, z: 0.28 }, 'accent', '#ff6600'),
      c('battery_pack', 'Pack de Baterias', 'electronics', 'box', { x: 0.25, y: 0.05, z: 0.35 }, { x: 0, y: 0.03, z: 0 }, 'secondary', '#ffcc00'),
      c('windshield', 'Pára-brisa', 'body', 'box', { x: 0.28, y: 0.12, z: 0.005 }, { x: 0, y: 0.26, z: 0.1 }, 'secondary', '#aaccff'),
      c('headlight_l', 'Farol Esq.', 'electronics', 'sphere', { radius: 0.015 }, { x: -0.12, y: 0.15, z: 0.35 }, 'accent', '#ffffcc'),
      c('headlight_r', 'Farol Dir.', 'electronics', 'sphere', { radius: 0.015 }, { x: 0.12, y: 0.15, z: 0.35 }, 'accent', '#ffffcc'),
    ],
  },

  // ═══ BICYCLE ═══════════════════════════════════════════
  bicycle: {
    nameGenerator: (desc, specs) => {
      if (/elétric|eletric|e-bike/i.test(desc)) return 'E-Bike Urbana';
      if (/mountain|montanha|off-road/i.test(desc)) return 'Mountain Bike';
      return 'Bicicleta Simples';
    },
    descriptionGenerator: (desc, specs) => `Bicicleta ${specs.power === 'electric' ? 'elétrica assistida' : 'mecânica'} para uso ${specs.purpose === 'sport' ? 'esportivo' : 'urbano'}.`,
    specsGenerator: (specs, scale) => ({
      'Tipo': specs.power === 'electric' ? 'E-Bike' : 'Bicicleta',
      'Aro': `${Math.round(26 * scale)}"`,
      'Peso': `${(specs.power === 'electric' ? 18 : 10) * scale} kg`,
    }),
    components: [
      c('frame_bike', 'Quadro', 'structure', 'box', { x: 0.03, y: 0.04, z: 0.35 }, { x: 0, y: 0.18, z: 0 }, 'structure', '#cc3333'),
      c('top_tube', 'Tubo Superior', 'structure', 'cylinder', { radius: 0.012, height: 0.25 }, { x: 0, y: 0.28, z: 0.02 }, 'structure', '#cc3333', { x: 0, y: 0, z: Math.PI/2 }),
      c('seat_tube', 'Tubo Selim', 'structure', 'cylinder', { radius: 0.012, height: 0.18 }, { x: 0, y: 0.22, z: -0.08 }, 'structure', '#cc3333'),
      c('fork', 'Garfo', 'structure', 'cylinder', { radius: 0.01, height: 0.2 }, { x: 0, y: 0.2, z: 0.2 }, 'accent', '#888899'),
      c('wheel_front', 'Roda Dianteira', 'wheel', 'torus', { radius: 0.13, tube: 0.015 }, { x: 0, y: 0.13, z: 0.25 }, 'secondary', '#222222', { x: Math.PI/2, y: 0, z: 0 }),
      c('wheel_rear', 'Roda Traseira', 'wheel', 'torus', { radius: 0.13, tube: 0.015 }, { x: 0, y: 0.13, z: -0.2 }, 'secondary', '#222222', { x: Math.PI/2, y: 0, z: 0 }),
      c('handlebar', 'Guidão', 'control', 'cylinder', { radius: 0.01, height: 0.2 }, { x: 0, y: 0.34, z: 0.2 }, 'accent', '#888899', { x: 0, y: Math.PI/2, z: 0 }),
      c('saddle', 'Selim', 'comfort', 'box', { x: 0.08, y: 0.03, z: 0.12 }, { x: 0, y: 0.33, z: -0.08 }, 'secondary', '#222222'),
      c('pedal_l', 'Pedal Esq.', 'control', 'box', { x: 0.04, y: 0.005, z: 0.03 }, { x: -0.06, y: 0.1, z: -0.03 }, 'accent', '#555555'),
      c('pedal_r', 'Pedal Dir.', 'control', 'box', { x: 0.04, y: 0.005, z: 0.03 }, { x: 0.06, y: 0.1, z: -0.03 }, 'accent', '#555555'),
      c('chain_ring', 'Coroa/Corrente', 'structure', 'torus', { radius: 0.035, tube: 0.004 }, { x: 0, y: 0.1, z: -0.03 }, 'accent', '#777777'),
    ],
  },

  // ═══ BOAT ══════════════════════════════════════════════
  boat: {
    nameGenerator: (desc, specs) => {
      if (/lancha/i.test(desc)) return 'Lancha Esportiva';
      if (/caiaque/i.test(desc)) return 'Caiaque';
      if (/veleiro/i.test(desc)) return 'Veleiro';
      if (/submarino/i.test(desc)) return 'Mini Submarino';
      return 'Barco Elétrico';
    },
    descriptionGenerator: (desc, specs) => `Embarcação ${specs.power === 'electric' ? 'elétrica' : specs.power === 'manual' ? 'a remo/vela' : 'motorizada'} para uso ${specs.purpose === 'sport' ? 'esportivo' : 'geral'}.`,
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Embarcação',
      'Comprimento': `${(200 * scale).toFixed(0)} cm`,
      'Boca': `${(80 * scale).toFixed(0)} cm`,
      'Propulsão': specs.power === 'electric' ? 'Motor Elétrico' : 'Combustão',
    }),
    components: [
      c('hull', 'Casco', 'body', 'box', { x: 0.25, y: 0.08, z: 0.6 }, { x: 0, y: 0.04, z: 0 }, 'structure', '#ffffff'),
      c('deck', 'Convés', 'body', 'box', { x: 0.23, y: 0.01, z: 0.55 }, { x: 0, y: 0.08, z: 0 }, 'structure', '#ddccaa'),
      c('cabin', 'Cabine', 'body', 'box', { x: 0.18, y: 0.1, z: 0.15 }, { x: 0, y: 0.13, z: -0.05 }, 'accent', '#ffffff'),
      c('windshield_b', 'Vidro Cabine', 'body', 'box', { x: 0.17, y: 0.08, z: 0.005 }, { x: 0, y: 0.14, z: 0.025 }, 'secondary', '#aaccff'),
      c('motor_boat', 'Motor de Popa', 'motor', 'cylinder', { radius: 0.03, height: 0.08 }, { x: 0, y: 0.02, z: -0.32 }, 'accent', '#444444'),
      c('propeller_boat', 'Hélice Prop.', 'propeller', 'torus', { radius: 0.04, tube: 0.004 }, { x: 0, y: -0.01, z: -0.35 }, 'accent', '#cccccc'),
      c('rudder', 'Leme', 'control', 'box', { x: 0.005, y: 0.06, z: 0.04 }, { x: 0, y: -0.01, z: -0.3 }, 'accent', '#888899'),
      c('seat_cap', 'Banco Capitão', 'comfort', 'box', { x: 0.1, y: 0.08, z: 0.1 }, { x: 0, y: 0.12, z: -0.1 }, 'secondary', '#333344'),
      c('bow', 'Proa', 'body', 'box', { x: 0.12, y: 0.06, z: 0.08 }, { x: 0, y: 0.06, z: 0.32 }, 'structure', '#ffffff'),
      c('nav_light', 'Luz Navegação', 'electronics', 'sphere', { radius: 0.008 }, { x: 0, y: 0.2, z: 0.35 }, 'accent', '#ff0000'),
    ],
  },

  // ═══ AIRPLANE ══════════════════════════════════════════
  airplane: {
    nameGenerator: () => 'Avião Leve',
    descriptionGenerator: (desc, specs) => `Aeronave de asa fixa ${specs.power === 'electric' ? 'elétrica' : 'a combustão'} para ${specs.purpose === 'agriculture' ? 'uso agrícola' : 'voo recreativo'}.`,
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Aeronave Asa Fixa',
      'Envergadura': `${(250 * scale).toFixed(0)} cm`,
      'Propulsão': specs.power === 'electric' ? 'Motor Elétrico' : 'Motor a Combustão',
    }),
    components: [
      c('fuselage', 'Fuselagem', 'body', 'cylinder', { radius: 0.06, height: 0.5 }, { x: 0, y: 0.15, z: 0 }, 'structure', '#ffffff', { x: Math.PI/2, y: 0, z: 0 }),
      c('wing_l', 'Asa Esquerda', 'body', 'box', { x: 0.4, y: 0.008, z: 0.1 }, { x: -0.22, y: 0.15, z: 0.02 }, 'structure', '#eeeeee'),
      c('wing_r', 'Asa Direita', 'body', 'box', { x: 0.4, y: 0.008, z: 0.1 }, { x: 0.22, y: 0.15, z: 0.02 }, 'structure', '#eeeeee'),
      c('tail_v', 'Leme Vertical', 'body', 'box', { x: 0.005, y: 0.08, z: 0.06 }, { x: 0, y: 0.2, z: -0.25 }, 'accent', '#ff3333'),
      c('tail_h', 'Leme Horizontal', 'body', 'box', { x: 0.15, y: 0.005, z: 0.05 }, { x: 0, y: 0.17, z: -0.25 }, 'structure', '#eeeeee'),
      c('nose', 'Nariz/Motor', 'motor', 'cylinder', { radius: 0.05, height: 0.06 }, { x: 0, y: 0.15, z: 0.28 }, 'accent', '#666666', { x: Math.PI/2, y: 0, z: 0 }),
      c('prop_airplane', 'Hélice', 'propeller', 'box', { x: 0.2, y: 0.01, z: 0.005 }, { x: 0, y: 0.15, z: 0.31 }, 'secondary', '#cccccc'),
      c('cockpit', 'Cockpit', 'body', 'box', { x: 0.08, y: 0.04, z: 0.1 }, { x: 0, y: 0.2, z: 0.08 }, 'secondary', '#88bbff'),
      c('landing_l', 'Trem Pouso Esq', 'structure', 'cylinder', { radius: 0.005, height: 0.08 }, { x: -0.06, y: 0.07, z: 0.05 }, 'accent', '#888888'),
      c('landing_r', 'Trem Pouso Dir', 'structure', 'cylinder', { radius: 0.005, height: 0.08 }, { x: 0.06, y: 0.07, z: 0.05 }, 'accent', '#888888'),
      c('wheel_lf', 'Roda Esq.', 'wheel', 'torus', { radius: 0.02, tube: 0.005 }, { x: -0.06, y: 0.02, z: 0.05 }, 'secondary', '#222222', { x: Math.PI/2, y: 0, z: 0 }),
      c('wheel_rf', 'Roda Dir.', 'wheel', 'torus', { radius: 0.02, tube: 0.005 }, { x: 0.06, y: 0.02, z: 0.05 }, 'secondary', '#222222', { x: Math.PI/2, y: 0, z: 0 }),
    ],
  },

  // ═══ FURNITURE ═════════════════════════════════════════
  furniture: {
    nameGenerator: (desc) => {
      if (/mesa/i.test(desc)) return 'Mesa de Escritório';
      if (/cadeira/i.test(desc)) return 'Cadeira Ergonômica';
      if (/estante|prateleira/i.test(desc)) return 'Estante Modular';
      return 'Móvel Customizado';
    },
    descriptionGenerator: (desc) => `Móvel projetado sob medida baseado na descrição: "${desc.substring(0, 60)}"`,
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Mobiliário',
      'Material': specs.budget === 'high' ? 'Madeira Nobre' : 'MDF/Compensado',
    }),
    components: [
      c('table_top', 'Tampo', 'structure', 'box', { x: 0.6, y: 0.025, z: 0.3 }, { x: 0, y: 0.37, z: 0 }, 'structure', '#8B6914'),
      c('leg1', 'Perna 1', 'structure', 'cylinder', { radius: 0.015, height: 0.35 }, { x: -0.27, y: 0.175, z: -0.12 }, 'accent', '#6B4914'),
      c('leg2', 'Perna 2', 'structure', 'cylinder', { radius: 0.015, height: 0.35 }, { x: 0.27, y: 0.175, z: -0.12 }, 'accent', '#6B4914'),
      c('leg3', 'Perna 3', 'structure', 'cylinder', { radius: 0.015, height: 0.35 }, { x: -0.27, y: 0.175, z: 0.12 }, 'accent', '#6B4914'),
      c('leg4', 'Perna 4', 'structure', 'cylinder', { radius: 0.015, height: 0.35 }, { x: 0.27, y: 0.175, z: 0.12 }, 'accent', '#6B4914'),
      c('drawer', 'Gaveta', 'structure', 'box', { x: 0.25, y: 0.06, z: 0.25 }, { x: 0, y: 0.32, z: 0.02 }, 'secondary', '#7B5914'),
      c('support', 'Travessa', 'structure', 'box', { x: 0.5, y: 0.02, z: 0.02 }, { x: 0, y: 0.15, z: 0 }, 'accent', '#6B4914'),
    ],
  },

  // ═══ ENCLOSURE (Arduino/Raspberry case) ═══════════════
  enclosure: {
    nameGenerator: (desc) => {
      if (/arduino/i.test(desc)) return 'Case Arduino';
      if (/raspberry/i.test(desc)) return 'Case Raspberry Pi';
      return 'Gabinete Eletrônico';
    },
    descriptionGenerator: (desc) => `Gabinete protetor para eletrônicos: "${desc.substring(0, 60)}"`,
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Invólucro/Case',
      'Fabricação': 'Impressão 3D',
      'Material': 'ABS/PLA',
    }),
    components: [
      c('case_bottom', 'Base do Case', 'structure', 'box', { x: 0.1, y: 0.005, z: 0.07 }, { x: 0, y: 0.0025, z: 0 }, 'structure', '#333344'),
      c('case_walls', 'Paredes', 'structure', 'box', { x: 0.1, y: 0.035, z: 0.07 }, { x: 0, y: 0.02, z: 0 }, 'structure', '#444455'),
      c('case_lid', 'Tampa', 'structure', 'box', { x: 0.1, y: 0.004, z: 0.07 }, { x: 0, y: 0.04, z: 0 }, 'accent', '#555566'),
      c('pcb', 'Placa PCB', 'electronics', 'box', { x: 0.085, y: 0.002, z: 0.055 }, { x: 0, y: 0.008, z: 0 }, 'secondary', '#006622'),
      c('usb_port', 'Porta USB', 'electronics', 'box', { x: 0.012, y: 0.006, z: 0.01 }, { x: -0.05, y: 0.014, z: 0 }, 'accent', '#aaaaaa'),
      c('led_status', 'LED Status', 'electronics', 'sphere', { radius: 0.003 }, { x: 0.03, y: 0.015, z: 0.02 }, 'accent', '#00ff00'),
      c('standoff1', 'Espaçador 1', 'structure', 'cylinder', { radius: 0.003, height: 0.005 }, { x: -0.038, y: 0.005, z: -0.022 }, 'accent', '#cccccc'),
      c('standoff2', 'Espaçador 2', 'structure', 'cylinder', { radius: 0.003, height: 0.005 }, { x: 0.038, y: 0.005, z: -0.022 }, 'accent', '#cccccc'),
      c('standoff3', 'Espaçador 3', 'structure', 'cylinder', { radius: 0.003, height: 0.005 }, { x: -0.038, y: 0.005, z: 0.022 }, 'accent', '#cccccc'),
      c('standoff4', 'Espaçador 4', 'structure', 'cylinder', { radius: 0.003, height: 0.005 }, { x: 0.038, y: 0.005, z: 0.022 }, 'accent', '#cccccc'),
    ],
  },

  // ═══ PROSTHESIS ════════════════════════════════════════
  prosthesis: {
    nameGenerator: (desc) => {
      if (/mão|mao/i.test(desc)) return 'Prótese de Mão';
      if (/perna/i.test(desc)) return 'Prótese de Perna';
      if (/exoesqueleto/i.test(desc)) return 'Exoesqueleto';
      return 'Prótese Mecânica';
    },
    descriptionGenerator: (desc) => `Dispositivo de assistência biomecânica: "${desc.substring(0, 60)}"`,
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Dispositivo Biomecânico',
      'Atuadores': 'Servos Micro',
      'Controle': 'Sensores Mioelétricos',
    }),
    components: [
      c('palm', 'Palma', 'structure', 'box', { x: 0.06, y: 0.015, z: 0.08 }, { x: 0, y: 0.15, z: 0 }, 'structure', '#eeddcc'),
      c('thumb', 'Polegar', 'actuator', 'cylinder', { radius: 0.007, height: 0.04 }, { x: -0.035, y: 0.155, z: 0.03 }, 'structure', '#eeddcc'),
      c('finger_1', 'Indicador', 'actuator', 'cylinder', { radius: 0.006, height: 0.05 }, { x: -0.02, y: 0.155, z: 0.055 }, 'structure', '#eeddcc'),
      c('finger_2', 'Médio', 'actuator', 'cylinder', { radius: 0.006, height: 0.055 }, { x: -0.005, y: 0.155, z: 0.06 }, 'structure', '#eeddcc'),
      c('finger_3', 'Anelar', 'actuator', 'cylinder', { radius: 0.006, height: 0.048 }, { x: 0.01, y: 0.155, z: 0.055 }, 'structure', '#eeddcc'),
      c('finger_4', 'Mínimo', 'actuator', 'cylinder', { radius: 0.005, height: 0.042 }, { x: 0.025, y: 0.155, z: 0.05 }, 'structure', '#eeddcc'),
      c('wrist', 'Pulso', 'structure', 'cylinder', { radius: 0.025, height: 0.03 }, { x: 0, y: 0.15, z: -0.04 }, 'accent', '#aabbcc'),
      c('servo_1', 'Servo 1', 'motor', 'box', { x: 0.01, y: 0.01, z: 0.02 }, { x: -0.015, y: 0.145, z: -0.01 }, 'accent', '#333333'),
      c('servo_2', 'Servo 2', 'motor', 'box', { x: 0.01, y: 0.01, z: 0.02 }, { x: 0.015, y: 0.145, z: -0.01 }, 'accent', '#333333'),
      c('controller_p', 'Microcontrolador', 'electronics', 'box', { x: 0.03, y: 0.005, z: 0.02 }, { x: 0, y: 0.14, z: -0.02 }, 'secondary', '#005522'),
    ],
  },

  // ═══ TURBINE ═══════════════════════════════════════════
  turbine: {
    nameGenerator: () => 'Turbina Eólica',
    descriptionGenerator: () => 'Turbina eólica de eixo horizontal para geração de energia renovável.',
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Turbina Eólica',
      'Diâmetro Rotor': `${(150 * scale).toFixed(0)} cm`,
      'Geração': `~${(500 * scale).toFixed(0)} W`,
    }),
    components: [
      c('tower', 'Torre', 'structure', 'cylinder', { radius: 0.02, height: 0.5 }, { x: 0, y: 0.25, z: 0 }, 'structure', '#cccccc'),
      c('nacelle', 'Nacele', 'body', 'box', { x: 0.06, y: 0.04, z: 0.1 }, { x: 0, y: 0.52, z: 0 }, 'structure', '#dddddd'),
      c('hub', 'Cubo', 'structure', 'sphere', { radius: 0.02 }, { x: 0, y: 0.52, z: 0.06 }, 'accent', '#aaaaaa'),
      c('blade_1', 'Pá 1', 'propeller', 'box', { x: 0.02, y: 0.005, z: 0.3 }, { x: 0, y: 0.52, z: 0.21 }, 'secondary', '#eeeeee'),
      c('blade_2', 'Pá 2', 'propeller', 'box', { x: 0.02, y: 0.005, z: 0.3 }, { x: -0.15, y: 0.52, z: -0.08 }, 'secondary', '#eeeeee'),
      c('blade_3', 'Pá 3', 'propeller', 'box', { x: 0.02, y: 0.005, z: 0.3 }, { x: 0.15, y: 0.52, z: -0.08 }, 'secondary', '#eeeeee'),
      c('generator', 'Gerador', 'motor', 'cylinder', { radius: 0.025, height: 0.06 }, { x: 0, y: 0.52, z: -0.03 }, 'accent', '#ff8800'),
      c('base_t', 'Base', 'structure', 'box', { x: 0.12, y: 0.03, z: 0.12 }, { x: 0, y: 0.015, z: 0 }, 'structure', '#999999'),
    ],
  },

  // ═══ SKATEBOARD ════════════════════════════════════════
  skateboard: {
    nameGenerator: () => 'Skate Elétrico',
    descriptionGenerator: () => 'Skate elétrico com motor hub e bateria integrada ao deck.',
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Skate Elétrico',
      'Velocidade': `${(30 * scale).toFixed(0)} km/h`,
      'Autonomia': `${(15 * scale).toFixed(0)} km`,
    }),
    components: [
      c('deck', 'Deck', 'structure', 'box', { x: 0.08, y: 0.012, z: 0.4 }, { x: 0, y: 0.07, z: 0 }, 'structure', '#884422'),
      c('truck_f', 'Truck Dianteiro', 'structure', 'box', { x: 0.07, y: 0.015, z: 0.01 }, { x: 0, y: 0.05, z: 0.14 }, 'accent', '#888888'),
      c('truck_r', 'Truck Traseiro', 'structure', 'box', { x: 0.07, y: 0.015, z: 0.01 }, { x: 0, y: 0.05, z: -0.14 }, 'accent', '#888888'),
      c('wh_fl', 'Roda FL', 'wheel', 'torus', { radius: 0.025, tube: 0.01 }, { x: -0.04, y: 0.025, z: 0.14 }, 'secondary', '#ff6600', { x: Math.PI/2, y: 0, z: 0 }),
      c('wh_fr', 'Roda FR', 'wheel', 'torus', { radius: 0.025, tube: 0.01 }, { x: 0.04, y: 0.025, z: 0.14 }, 'secondary', '#ff6600', { x: Math.PI/2, y: 0, z: 0 }),
      c('wh_rl', 'Roda RL', 'wheel', 'torus', { radius: 0.025, tube: 0.01 }, { x: -0.04, y: 0.025, z: -0.14 }, 'secondary', '#ff6600', { x: Math.PI/2, y: 0, z: 0 }),
      c('wh_rr', 'Roda RR', 'wheel', 'torus', { radius: 0.025, tube: 0.01 }, { x: 0.04, y: 0.025, z: -0.14 }, 'secondary', '#ff6600', { x: Math.PI/2, y: 0, z: 0 }),
      c('battery_sk', 'Bateria', 'electronics', 'box', { x: 0.06, y: 0.015, z: 0.12 }, { x: 0, y: 0.058, z: 0 }, 'secondary', '#222233'),
      c('esc_sk', 'ESC', 'electronics', 'box', { x: 0.04, y: 0.01, z: 0.03 }, { x: 0, y: 0.058, z: -0.1 }, 'secondary', '#003322'),
      c('hub_motor', 'Motor Hub', 'motor', 'cylinder', { radius: 0.022, height: 0.02 }, { x: -0.04, y: 0.025, z: -0.14 }, 'accent', '#444444'),
    ],
  },

  // ═══ GENERIC MACHINE (fallback) ════════════════════════
  generic_machine: {
    nameGenerator: (desc) => {
      const words = desc.split(/\s+/).filter(w => w.length > 3).slice(0, 3);
      return words.length > 0 ? words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Projeto Customizado';
    },
    descriptionGenerator: (desc) => `Projeto gerado a partir da descrição do usuário: "${desc.substring(0, 100)}"`,
    specsGenerator: (specs, scale) => ({
      'Tipo': 'Dispositivo Mecânico',
      'Escala': specs.scale === 'small' ? 'Compacto' : specs.scale === 'large' ? 'Grande' : 'Médio',
      'Orçamento': specs.budget === 'low' ? 'Econômico' : specs.budget === 'high' ? 'Premium' : 'Moderado',
      'Energia': specs.power === 'electric' ? 'Elétrica' : specs.power === 'solar' ? 'Solar' : specs.power === 'manual' ? 'Manual' : 'Mista',
    }),
    components: [
      c('base_main', 'Base Principal', 'structure', 'box', { x: 0.2, y: 0.03, z: 0.15 }, { x: 0, y: 0.015, z: 0 }, 'structure', '#aabbcc'),
      c('body_main', 'Corpo Central', 'body', 'box', { x: 0.15, y: 0.1, z: 0.12 }, { x: 0, y: 0.08, z: 0 }, 'structure', '#8899bb'),
      c('top_cover', 'Tampa Superior', 'body', 'box', { x: 0.16, y: 0.005, z: 0.13 }, { x: 0, y: 0.135, z: 0 }, 'accent', '#99aabb'),
      c('motor_main', 'Motor Principal', 'motor', 'cylinder', { radius: 0.025, height: 0.05 }, { x: 0.05, y: 0.06, z: 0 }, 'accent', '#666666'),
      c('controller_m', 'Controlador', 'electronics', 'box', { x: 0.05, y: 0.01, z: 0.04 }, { x: -0.04, y: 0.06, z: 0 }, 'secondary', '#006633'),
      c('sensor_main', 'Sensor Principal', 'sensor', 'sphere', { radius: 0.012 }, { x: 0, y: 0.14, z: 0.06 }, 'secondary', '#22cc66'),
      c('actuator_1', 'Atuador 1', 'actuator', 'cylinder', { radius: 0.01, height: 0.08 }, { x: 0.08, y: 0.1, z: 0 }, 'accent', '#aaaacc'),
      c('power_supply', 'Fonte de Energia', 'electronics', 'box', { x: 0.06, y: 0.03, z: 0.04 }, { x: -0.04, y: 0.04, z: -0.04 }, 'secondary', '#ffbb00'),
      c('connector_1', 'Conector/Interface', 'electronics', 'box', { x: 0.01, y: 0.01, z: 0.015 }, { x: -0.1, y: 0.06, z: 0 }, 'accent', '#999999'),
      c('indicator', 'Indicador LED', 'electronics', 'sphere', { radius: 0.005 }, { x: 0.05, y: 0.135, z: 0.05 }, 'accent', '#00ff44'),
    ],
  },
};
