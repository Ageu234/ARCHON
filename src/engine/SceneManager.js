// ═══════════════════════════════════════════════════════════════
// ARCHON — Three.js Scene Manager
// ═══════════════════════════════════════════════════════════════

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getMaterial } from './MaterialLibrary.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.meshes = new Map(); // id -> mesh
    this.selectedMesh = null;
    this.viewMode = 'solid'; // solid, wireframe, xray
    this.onSelect = null;

    this.init();
    this.animate();
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0a0a12');
    this.scene.fog = new THREE.FogExp2('#0a0a12', 0.8);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.01,
      100
    );
    this.camera.position.set(0.6, 0.4, 0.6);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 5;
    this.controls.target.set(0, 0.1, 0);

    // Lights
    this.setupLights();

    // Grid & Helpers
    this.setupGrid();

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.container.addEventListener('click', (e) => this.onClick(e));

    // Resize
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.container);
  }

  setupLights() {
    // Ambient
    const ambient = new THREE.AmbientLight(0x404060, 0.6);
    this.scene.add(ambient);

    // Main directional
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -3;
    dirLight.shadow.camera.right = 3;
    dirLight.shadow.camera.top = 3;
    dirLight.shadow.camera.bottom = -3;
    this.scene.add(dirLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    fillLight.position.set(-3, 4, -3);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.2);
    rimLight.position.set(0, 2, -5);
    this.scene.add(rimLight);

    // Hemisphere
    const hemi = new THREE.HemisphereLight(0x6688cc, 0x223344, 0.4);
    this.scene.add(hemi);
  }

  setupGrid() {
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(10, 10);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a12,
      metalness: 0.3,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.userData.isGround = true;
    this.scene.add(ground);

    // Grid
    const grid = new THREE.GridHelper(4, 40, 0x1a1a2e, 0x111122);
    grid.position.y = 0.001;
    this.scene.add(grid);

    // Axes
    const axesHelper = new THREE.AxesHelper(0.3);
    axesHelper.position.set(-1.8, 0.002, -1.8);
    this.scene.add(axesHelper);
  }

  loadProject(components) {
    // Clear existing meshes
    this.clearModel();

    // Create meshes for each component
    for (const comp of components) {
      this.addComponent(comp);
    }

    // Auto-fit camera
    this.fitCamera();
  }

  addComponent(comp) {
    let geometry;
    const dims = comp.dimensions || {};

    switch (comp.geometry) {
      case 'box':
        geometry = new THREE.BoxGeometry(
          dims.x || 0.1,
          dims.y || 0.1,
          dims.z || 0.1
        );
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(
          dims.radius || 0.05,
          dims.radius || 0.05,
          dims.height || 0.1,
          24
        );
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(dims.radius || 0.05, 24, 24);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(
          dims.radius || 0.05,
          dims.tube || 0.01,
          12,
          48
        );
        break;
      default:
        geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    }

    // Create material based on type
    const matDef = getMaterial(comp.material);
    let material;

    const rawColor = comp.color || matDef.color;
    let colorHex = rawColor;
    let alpha = 1;

    // Handle 8-digit hex colors (#RRGGBBAA) - Three.js only supports 6-digit
    if (rawColor.length > 7) {
      colorHex = rawColor.slice(0, 7);
      alpha = parseInt(rawColor.slice(7), 16) / 255;
    }

    if (matDef.finish === 'metallic') {
      material = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: 0.8,
        roughness: 0.2,
      });
    } else if (matDef.finish === 'glossy') {
      material = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        metalness: 0.1,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: 0.1,
        roughness: 0.7,
      });
    }

    // Apply transparency if alpha was extracted
    if (alpha < 1) {
      material.transparent = true;
      material.opacity = alpha;
    }

    const mesh = new THREE.Mesh(geometry, material);

    // Position
    if (comp.position) {
      mesh.position.set(comp.position.x || 0, comp.position.y || 0, comp.position.z || 0);
    }

    // Rotation
    if (comp.rotation) {
      mesh.rotation.set(comp.rotation.x || 0, comp.rotation.y || 0, comp.rotation.z || 0);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { componentId: comp.id, componentName: comp.name };

    this.meshes.set(comp.id, mesh);
    this.scene.add(mesh);
  }

  clearModel() {
    for (const [id, mesh] of this.meshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
    this.meshes.clear();
    this.selectedMesh = null;
  }

  selectComponent(id) {
    // Deselect previous
    if (this.selectedMesh) {
      this.selectedMesh.material.emissive?.setHex(0x000000);
    }

    const mesh = this.meshes.get(id);
    if (mesh) {
      mesh.material.emissive?.setHex(0x003344);
      this.selectedMesh = mesh;
      if (this.onSelect) {
        this.onSelect(id);
      }
    }
  }

  onClick(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshArray = Array.from(this.meshes.values());
    const intersects = this.raycaster.intersectObjects(meshArray);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.selectComponent(hit.userData.componentId);
    } else {
      // Deselect
      if (this.selectedMesh) {
        this.selectedMesh.material.emissive?.setHex(0x000000);
        this.selectedMesh = null;
        if (this.onSelect) this.onSelect(null);
      }
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    for (const [, mesh] of this.meshes) {
      switch (mode) {
        case 'wireframe':
          mesh.material.wireframe = true;
          mesh.material.transparent = false;
          mesh.material.opacity = 1;
          break;
        case 'xray':
          mesh.material.wireframe = false;
          mesh.material.transparent = true;
          mesh.material.opacity = 0.3;
          break;
        default: // solid
          mesh.material.wireframe = false;
          mesh.material.transparent = false;
          mesh.material.opacity = 1;
          break;
      }
    }
  }

  updateComponentDimensions(id, newDims) {
    const mesh = this.meshes.get(id);
    if (!mesh) return;

    mesh.geometry.dispose();

    const comp = { geometry: 'box', dimensions: newDims };
    // Detect geometry type from existing mesh
    if (mesh.geometry.type === 'CylinderGeometry') {
      mesh.geometry = new THREE.CylinderGeometry(
        newDims.radius || 0.05,
        newDims.radius || 0.05,
        newDims.height || 0.1,
        24
      );
    } else if (mesh.geometry.type === 'SphereGeometry') {
      mesh.geometry = new THREE.SphereGeometry(newDims.radius || 0.05, 24, 24);
    } else if (mesh.geometry.type === 'TorusGeometry') {
      mesh.geometry = new THREE.TorusGeometry(
        newDims.radius || 0.05,
        newDims.tube || 0.01,
        12,
        48
      );
    } else {
      mesh.geometry = new THREE.BoxGeometry(
        newDims.x || 0.1,
        newDims.y || 0.1,
        newDims.z || 0.1
      );
    }
  }

  updateComponentMaterial(id, materialId) {
    const mesh = this.meshes.get(id);
    if (!mesh) return;

    const matDef = getMaterial(materialId);
    mesh.material.color.set(matDef.color);

    if (matDef.finish === 'metallic') {
      mesh.material.metalness = 0.8;
      mesh.material.roughness = 0.2;
    } else if (matDef.finish === 'glossy') {
      mesh.material.metalness = 0.1;
      mesh.material.roughness = 0.1;
    } else {
      mesh.material.metalness = 0.1;
      mesh.material.roughness = 0.7;
    }
  }

  fitCamera() {
    const box = new THREE.Box3();
    for (const [, mesh] of this.meshes) {
      box.expandByObject(mesh);
    }

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2;

    this.camera.position.set(
      center.x + distance * 0.7,
      center.y + distance * 0.5,
      center.z + distance * 0.7
    );
    this.controls.target.copy(center);
    this.controls.update();
  }

  getStats() {
    let triangles = 0;
    let vertices = 0;
    for (const [, mesh] of this.meshes) {
      const geo = mesh.geometry;
      if (geo.index) {
        triangles += geo.index.count / 3;
      } else if (geo.attributes.position) {
        triangles += geo.attributes.position.count / 3;
      }
      if (geo.attributes.position) {
        vertices += geo.attributes.position.count;
      }
    }
    return { triangles: Math.round(triangles), vertices, meshCount: this.meshes.size };
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    this.animFrameId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    this.renderer.dispose();
  }
}
