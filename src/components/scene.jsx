import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { generateCoordinates } from '../helpers/pointHelper';

const PLANE_SIZE = 30;

export default class Scene extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    const scene = new THREE.Scene();

    const hemisphereLight = new THREE.HemisphereLight(0xffffFF, 0x080820, 1);
    scene.add(hemisphereLight);

    const light2 = new THREE.DirectionalLight(0xFDB883, 0.6);
    light2.position.set(10, 10, 10);
    light2.castShadow = true;
    scene.add(light2);

    const lightHelper = new THREE.DirectionalLightHelper(light2);
    scene.add(lightHelper);

    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000,
    );
    camera.lookAt(2, 0, -2);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('Snow004_1K_Color.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = PLANE_SIZE / 4;
    texture.repeat.set(repeats, repeats);

    const bumpMapTexture = loader.load('Snow004_1K_Displacement.jpg');
    bumpMapTexture.wrapS = THREE.MirroredRepeatWrapping;
    bumpMapTexture.wrapT = THREE.MirroredRepeatWrapping;
    // bumpMapTexture.magFilter = THREE.NearestFilter;
    const bumpMapTextureRepeats = PLANE_SIZE / 4;
    bumpMapTexture.repeat.set(bumpMapTextureRepeats, bumpMapTextureRepeats);

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: bumpMapTexture,
      bumpScale: 0.05,
      color: 0xdddddd,
    });

    const planeGeo = new THREE.PlaneBufferGeometry(PLANE_SIZE, PLANE_SIZE);
    const mesh = new THREE.Mesh(planeGeo, material);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI / -2;
    scene.add(mesh);

    const controls = new OrbitControls(camera, this.mount);
    controls.enableRotate = true;
    controls.enableDamping = true;
    camera.position.z = 10;
    camera.position.y = 10;
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    const initPyramids = () => {
      const pyramidMaterial = new THREE.MeshPhongMaterial({
        color: 0x55c57a,
      });
      const pyramidTopMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
      });
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < 100; index++) {
        const pyramidHeight = 2.5;
        const pyramidPosition = generateCoordinates(-PLANE_SIZE / 2, PLANE_SIZE / 2);
        const pyramidGeo = new THREE.ConeBufferGeometry(0.4, pyramidHeight, 7, 1);
        const pyramid = new THREE.Mesh(pyramidGeo, pyramidMaterial);
        pyramid.castShadow = true;
        pyramid.receiveShadow = true;
        // move it
        pyramid.position.x = pyramidPosition.x;
        pyramid.position.z = pyramidPosition.z;
        pyramid.position.y = pyramidHeight / 2;
        scene.add(pyramid);

        const pyramidConeGeo = new THREE.ConeBufferGeometry(0.05, pyramidHeight / 4, 7, 1);
        const pyramidCone = new THREE.Mesh(pyramidConeGeo, pyramidTopMaterial);
        // move it
        pyramidCone.position.x = pyramidPosition.x;
        pyramidCone.position.z = pyramidPosition.z;
        pyramidCone.position.y = pyramidHeight;

        scene.add(pyramidCone);
      }
    };

    initPyramids();

    animate();
  }

  render() {
    return (
      // eslint-disable-next-line no-return-assign
      <div ref={(ref) => (this.mount = ref)} />
    );
  }
}
