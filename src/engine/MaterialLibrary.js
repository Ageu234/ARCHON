// ═══════════════════════════════════════════════════════════════
// ARCHON — Material Library
// ═══════════════════════════════════════════════════════════════

export const materials = {
  carbon_fiber: {
    id: 'carbon_fiber',
    name: 'Fibra de Carbono',
    color: '#1a1a2e',
    density: 1.55,         // g/cm³
    tensileStrength: 3500,  // MPa
    youngsModulus: 230,     // GPa
    thermalResistance: 500, // °C
    costPerKg: 85,         // R$
    category: 'Compósito',
    finish: 'matte',
  },
  aluminum: {
    id: 'aluminum',
    name: 'Alumínio 6061',
    color: '#888899',
    density: 2.7,
    tensileStrength: 310,
    youngsModulus: 69,
    thermalResistance: 582,
    costPerKg: 25,
    category: 'Metal',
    finish: 'metallic',
  },
  steel: {
    id: 'steel',
    name: 'Aço AISI 1020',
    color: '#6b7280',
    density: 7.85,
    tensileStrength: 420,
    youngsModulus: 200,
    thermalResistance: 1425,
    costPerKg: 12,
    category: 'Metal',
    finish: 'metallic',
  },
  abs_plastic: {
    id: 'abs_plastic',
    name: 'ABS Plástico',
    color: '#374151',
    density: 1.04,
    tensileStrength: 44,
    youngsModulus: 2.3,
    thermalResistance: 100,
    costPerKg: 8,
    category: 'Polímero',
    finish: 'glossy',
  },
  nylon: {
    id: 'nylon',
    name: 'Nylon PA6',
    color: '#d1d5db',
    density: 1.14,
    tensileStrength: 82,
    youngsModulus: 2.9,
    thermalResistance: 220,
    costPerKg: 15,
    category: 'Polímero',
    finish: 'matte',
  },
  rubber: {
    id: 'rubber',
    name: 'Borracha Natural',
    color: '#1f2937',
    density: 0.92,
    tensileStrength: 25,
    youngsModulus: 0.05,
    thermalResistance: 80,
    costPerKg: 5,
    category: 'Elastômero',
    finish: 'matte',
  },
  titanium: {
    id: 'titanium',
    name: 'Titânio Ti-6Al-4V',
    color: '#9ca3af',
    density: 4.43,
    tensileStrength: 950,
    youngsModulus: 114,
    thermalResistance: 1660,
    costPerKg: 280,
    category: 'Metal',
    finish: 'metallic',
  },
  glass: {
    id: 'glass',
    name: 'Vidro Temperado',
    color: '#e5e7eb',
    density: 2.5,
    tensileStrength: 120,
    youngsModulus: 70,
    thermalResistance: 470,
    costPerKg: 6,
    category: 'Cerâmico',
    finish: 'glossy',
  },
  wood_plywood: {
    id: 'wood_plywood',
    name: 'Compensado de Madeira',
    color: '#92702a',
    density: 0.6,
    tensileStrength: 35,
    youngsModulus: 12,
    thermalResistance: 150,
    costPerKg: 4,
    category: 'Natural',
    finish: 'matte',
  },
};

export function getMaterialList() {
  return Object.values(materials);
}

export function getMaterial(id) {
  return materials[id] || materials.abs_plastic;
}
