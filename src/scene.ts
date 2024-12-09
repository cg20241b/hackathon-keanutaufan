import * as THREE from "three";
import { FontLoader, type Font } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import alphabetVertexShader from "./shaders/alphabet/vertex.glsl?raw";
import alphabetFragmentShader from "./shaders/alphabet/fragment.glsl?raw";
import digitVertexShader from "./shaders/digit/vertex.glsl?raw";
import digitFragmentShader from "./shaders/digit/fragment.glsl?raw";
import cubeVertexShader from "./shaders/cube/vertex.glsl?raw";
import cubeFragmentShader from "./shaders/cube/fragment.glsl?raw";

export class Scene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Mesh;
  private alphabetMesh: THREE.Mesh;
  private digitMesh: THREE.Mesh;
  private targetCameraPosition: THREE.Vector3;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();

    // Initialize properties
    this.cube = new THREE.Mesh();
    this.alphabetMesh = new THREE.Mesh();
    this.digitMesh = new THREE.Mesh();
    this.targetCameraPosition = new THREE.Vector3(0, 0, 5);
  }

  public initialize(): void {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.z = 5;

    // Create central cube (light source)
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMaterial = new THREE.ShaderMaterial({
      vertexShader: cubeVertexShader,
      fragmentShader: cubeFragmentShader,
      uniforms: {
        time: { value: 0 },
      },
    });
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.scene.add(this.cube);

    // Load font and create text meshes
    const fontLoader = new FontLoader();
    fontLoader.load("helvetiker-font.json", (font) => {
      this.createTextMeshes(font);
    });

    // Start animation loop
    this.animate();

    // Add event listeners
    this.setupEventListeners();
  }

  private createTextMeshes(font: Font): void {
    // Keanu -> threrefore u
    const alphabetGeometry = new TextGeometry("u", {
      font: font,
      size: 1,
      height: 0.2,
    });

    const alphabetMaterial = new THREE.ShaderMaterial({
      vertexShader: alphabetVertexShader,
      fragmentShader: alphabetFragmentShader,
      uniforms: {
        lightPosition: { value: this.cube.position },
        baseColor: { value: new THREE.Color(0x00ff00) }, // Fav color is 3a5a40 but too dark for such intensity. This is close enough
        ambientIntensity: { value: 0.242 }, // NRP = 042 + 200 = 242
      },
    });

    this.alphabetMesh = new THREE.Mesh(alphabetGeometry, alphabetMaterial);
    this.alphabetMesh.position.x = -2;
    this.scene.add(this.alphabetMesh);

    // 042 -> threrefore 2
    const digitGeometry = new TextGeometry("2", {
      font: font,
      size: 1,
      height: 0.2,
    });

    const digitMaterial = new THREE.ShaderMaterial({
      vertexShader: digitVertexShader,
      fragmentShader: digitFragmentShader,
      uniforms: {
        lightPosition: { value: this.cube.position },
        baseColor: { value: new THREE.Color(0xff00ff) }, // Should be c5a5bf, but then again not suitable with such intensity
        ambientIntensity: { value: 0.242 }, // Same calculation
        attenuationFactor: { value: 1.0 },
      },
    });

    this.digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);
    this.digitMesh.position.x = 2;
    this.scene.add(this.digitMesh);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    
    // Smooth camera movement
    this.camera.position.lerp(this.targetCameraPosition, 0.1);
    
    // Update cube's time uniform
    const cubeMaterial = this.cube.material as THREE.ShaderMaterial;
    cubeMaterial.uniforms.time.value = performance.now() * 0.001;
    
    this.renderer.render(this.scene, this.camera);
  }

  private setupEventListeners(): void {
    document.addEventListener("keydown", (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
          this.cube.position.y += 0.1;
          break;
        case "s":
          this.cube.position.y -= 0.1;
          break;
        case "a":
          this.targetCameraPosition.x -= 0.1;
          break;
        case "d":
          this.targetCameraPosition.x += 0.1;
          break;
      }
    });

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}
