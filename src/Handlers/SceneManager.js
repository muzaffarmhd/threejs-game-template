import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { InputHandler } from './InputHandler.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';

class LoadingScreen {
    constructor(canvas) {
      this.loadingElement = document.getElementById('loading');  // Assuming you have a loading div
      this.canvas = canvas;
    }
  
    show() {
      this.loadingElement.style.display = 'block';  // Show loading screen
      this.canvas.style.display = 'none';  // Hide canvas
    }
  
    hide() {
      this.loadingElement.style.display = 'none';  // Hide loading screen
      this.canvas.style.display = 'block';  // Show canvas
    }
}

class SceneManager{
    constructor(canvas){
        this.currentScene = null;
        this.loadingScreen = new LoadingScreen(canvas);
        this.loadingManager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
        this.inputHandler = new InputHandler();
        this.fadeOpacity = 0;  // To control the fade-in effect
        this.fadeDuration = 2000;  // Duration of the fade-in effect in milliseconds
        this.canvas = canvas;
    }
    setCurrentScene(scene){
        this.transitionTo(scene);
    }
    update(deltaTime){
        this.currentScene.update(deltaTime);
    }
    transitionTo(newScene) {
        this.fadeOutCurrentScene()
          .then(() => this.showLoadingScreen())
          .then(() => this.loadNewScene(newScene))
          .then(() => this.hideLoadingScreen())
          .then(() => this.fadeInNewScene());
    }
    fadeOutCurrentScene() {
        if (this.currentScene) {
            return new Promise((resolve) => {
            resolve();
            });
        } else {
            return new Promise((resolve) => resolve());
        }
    }
    fadeInNewScene() {
        this.fadeOpacity = 0;  // Start from fully transparent
        return new Promise((resolve) => {
            const startTime = performance.now();

            const fadeIn = (time) => {
                const elapsed = time - startTime;
                this.fadeOpacity = Math.min(elapsed / this.fadeDuration, 1);  // Incrementally increase opacity

                this.canvas.style.opacity = this.fadeOpacity;  // Set canvas opacity

                if (this.fadeOpacity < 1) {
                    requestAnimationFrame(fadeIn);  // Continue animating if not fully opaque
                } else {
                    resolve();  // Animation completed
                }
            };

            requestAnimationFrame(fadeIn);
        });
        // return new Promise(resolve => {
        //   resolve();
        // });
    }
    showLoadingScreen() {
        this.loadingScreen.show();  
        return new Promise(resolve => {
          setTimeout(resolve, 500);  
        });
      }
    
    loadNewScene(newScene) {
        return new Promise(resolve => {
          newScene.initialize();
          this.loadingManager.onLoad = () => resolve();  
          this.currentScene = newScene;
        });
    }
    
    hideLoadingScreen() {
        this.loadingScreen.hide();  
        return new Promise(resolve => {
            setTimeout(resolve, 500); 
        });
    }
}

export default SceneManager;
  