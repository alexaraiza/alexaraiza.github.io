const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 10, 100000);

const renderer = new THREE.WebGLRenderer({
  canvas: backgroundCanvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
if (window.innerWidth >= 736) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);
}
document.body.appendChild(renderer.domElement);
backgroundCanvas.style.opacity = 0;

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (window.innerWidth < 736) {
    renderer.setPixelRatio(1);
  }
  else {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2);
  }
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  setCameraPosition();
});

window.addEventListener("scroll", setCameraPosition);


const ambientLight = new THREE.AmbientLight(0xbfbfbf);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);

const textureLoader = new THREE.TextureLoader();

const earthGeometry = new THREE.SphereGeometry(300, 64, 64);
const earthTexture = textureLoader.load("./img/earth.png");
const earthOpacityTexture = textureLoader.load("./img/earth_opacity.png");
const earthMaterial = new THREE.MeshPhongMaterial({
  alphaMap: earthOpacityTexture,
  map: earthTexture,
  reflectivity: 0,
  shininess: 0,
  side: THREE.DoubleSide,
  transparent: true
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.rotation.y = - Math.PI / 2;

const starPoints = [];
for (let i = 0; i < 100000; ++i) {
  starPoints.push({
    position: new THREE.Vector3(
      120000 * Math.random() - 60000,
      - 20 * document.body.clientHeight * Math.random() + 30000,
      - 90000 * Math.random() - 1000
    ),
    size: getStarSize()
  });
}
starPoints.sort((a, b) => a.position.z > b.position.z);

const starPositions = [];
for (let starPoint of starPoints) {
  starPositions.push(starPoint.position.x, starPoint.position.y, starPoint.position.z);
}

const starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
starsGeometry.setAttribute(
  "size", new THREE.Float32BufferAttribute(starPoints.map(point => point.size), 1));
const starsMaterial = new THREE.ShaderMaterial({
  uniforms: {
    pointMultiplier: {
      value: window.innerHeight / (2 * Math.tan(30 * Math.PI / 180))
    }
  },
  vertexShader:
    `
    uniform float pointMultiplier;
    attribute float size;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * pointMultiplier / gl_Position.w;
    }`,
  fragmentShader:
    `
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5, 0.5);
      float distSquared = coord.x * coord.x + coord.y * coord.y;
      float opacity = 0.0;
      if (distSquared < 0.2) {
        opacity = 1.0;
      }
      else if (distSquared < 0.25) {
        opacity = 1.0 - (distSquared - 0.2) / 0.05;
      }
      gl_FragColor = vec4(0.75, 0.75, 0.75, opacity);
    }`,
  transparent: true
});
const stars = new THREE.Points(starsGeometry, starsMaterial);

const group = new THREE.Group();
group.add(earth);


setCameraPosition();
scene.add(ambientLight, directionalLight, stars, group);


fetch("https://ipapi.co/latlong/")
  .then(response => response.text())
    .then(data => {
      const [latitude, longitude] = data.split(',').map(number => parseFloat(number) * Math.PI / 180);
      const markerPosition = getMarkerCoordinates(latitude, longitude);
      const markerLight = new THREE.PointLight(0xff7f7f, 0.8, 100, 2);
      markerLight.position.set(markerPosition.x, markerPosition.y, markerPosition.z);
      group.add(markerLight);
      group.rotation.y = - longitude - Math.PI / 6;
    })
  .finally(() => {
    animate();
    backgroundCanvas.style.opacity = "";
  });


function animate() {
  requestAnimationFrame(animate);
  group.rotation.y += 0.001;
  renderer.render(scene, camera);
}


function setCameraPosition() {
  if (window.innerWidth < 736) {
    camera.position.x = 0;
  }
  else {
    camera.position.x = Math.max(- window.innerWidth / 4, -400);
  }
  camera.position.y = Math.max(400 - window.innerWidth / 4, 0) - window.pageYOffset;
  camera.position.z = Math.max(3200 - window.innerWidth, 1800);
  directionalLight.position.set(camera.position.x, camera.position.y, camera.position.z);
}

function getStarSize() {
  while (true) {
    const size = 2 * Math.random();
    // Dagum distribution (Type I) (a = 2, b = 1, p = 1)
    const probability = (2 * size) / Math.pow(size * size + 1, 2);
    if (0.7 * Math.random() < probability) return 50 * size;
  }
}

function getMarkerCoordinates(latitude, longitude, distanceFromSurface = 1) {
  const EARTH_RADIUS = earth.geometry.parameters.radius;
  return {
    x: (EARTH_RADIUS + distanceFromSurface) * Math.sin(longitude) * Math.cos(latitude),
    y: (EARTH_RADIUS + distanceFromSurface) * Math.sin(latitude),
    z: (EARTH_RADIUS + distanceFromSurface) * Math.cos(longitude) * Math.cos(latitude)
  };
}