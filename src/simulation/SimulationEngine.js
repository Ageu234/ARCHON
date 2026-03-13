// ═══════════════════════════════════════════════════════════════
// ARCHON — Simulation Engine
// ═══════════════════════════════════════════════════════════════

import { getMaterial } from '../engine/MaterialLibrary.js';

export class SimulationEngine {
  calculateWeight(components) {
    let totalWeight = 0;
    const breakdown = [];

    for (const comp of components) {
      const mat = getMaterial(comp.material);
      const volume = this.calculateVolume(comp);
      const weight = volume * mat.density * 1000; // kg

      breakdown.push({
        id: comp.id,
        name: comp.name,
        weight: weight,
        material: mat.name,
      });

      totalWeight += weight;
    }

    return { total: totalWeight, breakdown };
  }

  calculateVolume(comp) {
    const dims = comp.dimensions || {};
    switch (comp.geometry) {
      case 'box':
        return (dims.x || 0.1) * (dims.y || 0.1) * (dims.z || 0.1);
      case 'cylinder':
        return Math.PI * Math.pow(dims.radius || 0.05, 2) * (dims.height || 0.1);
      case 'sphere':
        return (4 / 3) * Math.PI * Math.pow(dims.radius || 0.05, 3);
      case 'torus':
        return 2 * Math.PI * Math.PI * (dims.radius || 0.05) * Math.pow(dims.tube || 0.01, 2);
      default:
        return 0.001;
    }
  }

  calculateCost(components) {
    let totalCost = 0;
    const breakdown = [];

    for (const comp of components) {
      const mat = getMaterial(comp.material);
      const volume = this.calculateVolume(comp);
      const weight = volume * mat.density * 1000;
      const cost = weight * mat.costPerKg;

      breakdown.push({
        id: comp.id,
        name: comp.name,
        cost,
        material: mat.name,
      });

      totalCost += cost;
    }

    // Add manufacturing overhead (30%)
    const manufacturing = totalCost * 0.3;

    return {
      materialCost: totalCost,
      manufacturingCost: manufacturing,
      total: totalCost + manufacturing,
      breakdown,
    };
  }

  calculateStress(components) {
    const results = [];

    for (const comp of components) {
      const mat = getMaterial(comp.material);
      const stressRatio = Math.random() * 0.6 + 0.1; // Simulated
      const safetyFactor = 1 / stressRatio;

      results.push({
        id: comp.id,
        name: comp.name,
        maxStress: (mat.tensileStrength * stressRatio).toFixed(1),
        allowableStress: mat.tensileStrength,
        safetyFactor: safetyFactor.toFixed(1),
        status: safetyFactor > 2 ? 'good' : safetyFactor > 1.2 ? 'medium' : 'poor',
      });
    }

    return results;
  }

  calculatePerformance(project) {
    const type = project.type;
    const weight = this.calculateWeight(project.components || []);

    switch (type) {
      case 'drone':
        return {
          flightTime: `${(25 * (1 - weight.total / 5)).toFixed(0)} min`,
          maxSpeed: `${(60 + Math.random() * 20).toFixed(0)} km/h`,
          payload: `${Math.max(0, (0.5 - weight.total * 0.1)).toFixed(2)} kg`,
          range: `${(2 + Math.random()).toFixed(1)} km`,
          thrust: `${(weight.total * 2 * 9.81).toFixed(1)} N`,
        };
      case 'motorcycle':
        return {
          topSpeed: `${(80 + Math.random() * 20).toFixed(0)} km/h`,
          range: `${(120 - weight.total * 0.5).toFixed(0)} km`,
          acceleration: `${(3 + Math.random() * 2).toFixed(1)} s (0-50km/h)`,
          efficiency: `${(85 + Math.random() * 10).toFixed(1)} Wh/km`,
          torque: `${(40 + Math.random() * 20).toFixed(0)} Nm`,
        };
      case 'robot':
        return {
          battery: `${(4 - weight.total * 0.2).toFixed(1)} horas`,
          speed: `${(0.5 + Math.random() * 0.5).toFixed(1)} m/s`,
          payload: `${(2 - weight.total * 0.1).toFixed(1)} kg`,
          accuracy: `${(95 + Math.random() * 4).toFixed(1)}%`,
          noise: `${(35 + Math.random() * 10).toFixed(0)} dB`,
        };
      default:
        return {};
    }
  }

  runFullAnalysis(project) {
    const components = project.components || [];
    return {
      weight: this.calculateWeight(components),
      cost: this.calculateCost(components),
      stress: this.calculateStress(components),
      performance: this.calculatePerformance(project),
      timestamp: new Date().toISOString(),
      overallScore: (70 + Math.random() * 25).toFixed(0),
    };
  }
}
