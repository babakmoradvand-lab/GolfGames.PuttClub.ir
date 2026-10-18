import * as THREE from './three.module.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';

const $ = id => document.getElementById(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#b8cdc5');
scene.fog = new THREE.Fog('#b8cdc5', 145, 330);
const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, 0.08, 520);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;touch-action:none;display:block';
document.body.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xe5f0e9, 0x4a5e4b, 1.75));
const sun = new THREE.DirectionalLight(0xffe7b5, 2.6);
sun.position.set(-38, 62, 26);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -80; sun.shadow.camera.right = 80;
sun.shadow.camera.top = 65; sun.shadow.camera.bottom = -150;
sun.shadow.bias = -0.00025;
scene.add(sun);

const material = (color, roughness = 0.85, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const matGround = material('#667f5c');
const matFairway = material('#628c59');
const matGreen = material('#89a96c', 0.98);
const matTee = material('#6e965f');
const matSand = material('#d2b987');
const matWater = new THREE.MeshStandardMaterial({ color: '#4b9c9a', roughness: 0.2, metalness: 0.12, transparent: true, opacity: 0.92 });
const matBark = material('#614b38');
const leafMaterials = ['#496b50', '#587a5a', '#65845e'].map(c => material(c));
const matWhite = material('#fffef4', 0.24);
const matGold = material('#d8bd7d', 0.35, 0.45);

function flatCircle(radius, mat, x, z, y = 0.015, segments = 48) {
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, segments), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}
function makeTree(x, z, scale = 1, tone = 0) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * scale, 0.23 * scale, 2.1 * scale, 7), matBark);
  trunk.position.set(x, 1.05 * scale, z); trunk.castShadow = true; trunk.receiveShadow = true; scene.add(trunk);
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35 * scale, 1), leafMaterials[tone % leafMaterials.length]);
  crown.position.set(x, 2.45 * scale, z); crown.castShadow = true; scene.add(crown);
  const crown2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.94 * scale, 1), leafMaterials[(tone + 1) % leafMaterials.length]);
  crown2.position.set(x + 0.48 * scale, 2.78 * scale, z - 0.18 * scale); crown2.castShadow = true; scene.add(crown2);
}

// A compact first hole: tee, gently bending fairway, bunkers, water hazard, green and flag.
const ground = new THREE.Mesh(new THREE.PlaneGeometry(280, 260), matGround);
ground.rotation.x = -Math.PI / 2; ground.position.set(0, -0.16, -43); ground.receiveShadow = true; scene.add(ground);
const fairwayShape = new THREE.Shape();
fairwayShape.moveTo(-11, 0);
fairwayShape.bezierCurveTo(-9, 27, -14, 61, -10, 93);
fairwayShape.bezierCurveTo(-8, 108, 6, 111, 13, 102);
fairwayShape.bezierCurveTo(18, 91, 9, 70, 13, 52);
fairwayShape.bezierCurveTo(17, 29, 13, 10, 11, 0);
fairwayShape.closePath();
const fairway = new THREE.Mesh(new THREE.ShapeGeometry(fairwayShape, 40), matFairway);
fairway.rotation.x = -Math.PI / 2; fairway.position.y = -0.045; fairway.receiveShadow = true; scene.add(fairway);
flatCircle(5.2, matTee, 0, 0.8, 0.012, 56);
const green = flatCircle(13.4, matGreen, 3.5, -118, 0.025, 72);
// Soft collar around the putting surface.
const collar = flatCircle(16.4, material('#739564'), 3.5, -118, 0.006, 72);
collar.renderOrder = -1;
// Sand traps, intentionally placed beside—not across—the first playable line.
for (const [x, z, rx, rz, rot] of [[-16, -57, 5.2, 7.2, -0.28], [19, -81, 5.8, 8.1, 0.3], [-11, -101, 4.3, 6.0, -0.2]]) {
  const trap = new THREE.Mesh(new THREE.CircleGeometry(1, 44), matSand);
  trap.scale.set(rx, rz, 1); trap.rotation.set(-Math.PI / 2, 0, rot); trap.position.set(x, 0.017, z); trap.receiveShadow = true; scene.add(trap);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(1, 0.055, 6, 42), material('#ae986b'));
  lip.scale.set(rx, rz, 1); lip.rotation.x = -Math.PI / 2; lip.position.set(x, 0.03, z); scene.add(lip);
}
// Water sits left of the fairway as a visible, avoidable hazard.
const pond = flatCircle(17, matWater, -31, -70, -0.01, 64);
const pondEdge = new THREE.Mesh(new THREE.TorusGeometry(17, 0.45, 7, 64), material('#83926f'));
pondEdge.rotation.x = Math.PI / 2; pondEdge.position.set(-31, 0.015, -70); scene.add(pondEdge);
// A few low hills frame the hole without obstructing the camera.
for (const [x, z, sx, sy, sz] of [[-76, -92, 28, 7, 36], [81, -62, 34, 8, 28], [62, -145, 38, 9, 18]]) {
  const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), material('#748467'));
  hill.position.set(x, sy * 0.55 - 1.2, z); hill.scale.set(sx, sy, sz); hill.receiveShadow = true; scene.add(hill);
}
// Reused, stylized trees on the margins of the resort hole.
for (let i = 0; i < 28; i++) {
  const side = i % 2 === 0 ? -1 : 1;
  const z = -8 - (i * 17 % 135);
  const x = side * (24 + (i * 11 % 18));
  if (z < -47 && z > -92 && x < -27) continue;
  makeTree(x, z, 0.72 + (i % 4) * 0.12, i % 3);
}
// Flagstick, cup and a subtle target ring.
const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.025, 32), material('#24312a'));
cup.position.set(3.5, 0.035, -118); scene.add(cup);
const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.25, 8), matWhite);
pin.position.set(3.5, 1.66, -118); pin.castShadow = true; scene.add(pin);
const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.62), matGold);
flag.position.set(4.02, 2.83, -118); flag.castShadow = true; scene.add(flag);
const targetRing = new THREE.Mesh(new THREE.RingGeometry(0.58, 0.67, 48), matGold);
targetRing.rotation.x = -Math.PI / 2; targetRing.position.set(3.5, 0.045, -118); scene.add(targetRing);
for (const x of [-2.1, 2.1]) {
  const marker = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), x < 0 ? matWhite : matGold);
  marker.position.set(x, 0.19, 1); marker.castShadow = true; scene.add(marker);
}

// Ball and high-quality rigged GLB golfer.
const ball = new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 20), matWhite);
ball.castShadow = true; ball.position.set(0, 0.12, 0.8); scene.add(ball);
const ballShadow = new THREE.Mesh(new THREE.CircleGeometry(0.26, 22), new THREE.MeshBasicMaterial({ color: '#19251c', transparent: true, opacity: 0.23, depthWrite: false }));
ballShadow.rotation.x = -Math.PI / 2; ballShadow.position.set(0, 0.018, 0.8); scene.add(ballShadow);
let golfer = null, mixer = null, swingClip = null, puttClip = null;
const fallbackGolfer = new THREE.Group(); scene.add(fallbackGolfer);
function capsule(radius, length, mat, x, y, z) { const m = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 5, 10), mat); m.position.set(x, y, z); m.castShadow = true; fallbackGolfer.add(m); return m; }
capsule(0.27, 0.55, material('#e9e3d7'), 0, 1.28, 0);
const fallbackHead = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), material('#bd8e69')); fallbackHead.position.set(0, 1.83, 0); fallbackGolfer.add(fallbackHead);
const fallbackHat = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.52), matGold); fallbackHat.position.set(0, 1.98, 0); fallbackGolfer.add(fallbackHat);
for (const side of [-1, 1]) {
  const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.58, 4, 9), material('#34423e')); leg.position.set(side * 0.13, 0.55, 0); leg.castShadow = true; fallbackGolfer.add(leg);
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.42, 4, 8), material('#d9d5c8')); arm.position.set(side * 0.31, 1.28, 0); arm.rotation.z = side * -0.18; arm.castShadow = true; fallbackGolfer.add(arm);
}
fallbackGolfer.position.set(0, 0, 3.0); fallbackGolfer.rotation.y = Math.PI;

const loader = new GLTFLoader();
$('loadText').textContent = 'در حال بارگذاری مدل سه‌بعدی و انیمیشن‌های گلف…';
loader.load('./assets/golfer.glb', gltf => {
  golfer = gltf.scene;
  golfer.scale.setScalar(1.0);
  golfer.position.set(0, 0, 3.0);
  golfer.rotation.y = Math.PI;
  golfer.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material) { o.material.side = THREE.FrontSide; } } });
  const bounds = new THREE.Box3().setFromObject(golfer);
  if (Number.isFinite(bounds.min.y)) golfer.position.y -= bounds.min.y;
  scene.add(golfer);
  fallbackGolfer.visible = false;
  mixer = new THREE.AnimationMixer(golfer);
  swingClip = gltf.animations.find(a => a.name.toLowerCase().includes('swing')) || gltf.animations[0];
  puttClip = gltf.animations.find(a => a.name.toLowerCase().includes('putt')) || swingClip;
  if (inGame) syncGolfer();
  $('loadText').textContent = 'زمین آماده است';
  setTimeout(() => $('progress').classList.add('hide'), 220);
}, xhr => {
  if (xhr.total) $('loadText').textContent = `مدل سه‌بعدی: ${Math.round(xhr.loaded / xhr.total * 100)}٪`;
}, err => {
  console.error('Golfer GLB load failed', err);
  $('loadText').textContent = 'بازیکن جایگزین فعال شد؛ زمین آماده است';
  setTimeout(() => $('progress').classList.add('hide'), 400);
  notify('مدل سه‌بعدی بارگذاری نشد؛ بازی با بازیکن جایگزین اجرا می‌شود.');
});

let strokes = 0, inGame = false, inFlight = false, settled = true, holed = false;
let velocity = new THREE.Vector3(), lastSafe = new THREE.Vector3(0, 0.12, 0.8);
let cameraYaw = 0, cameraPitch = 0.27, cameraMode = 0;
const clock = new THREE.Clock();
const aimInput = $('aim'), powerInput = $('power'), shotShapeInput = $('shotShape');
let shotCurve = 0; // -1 = hook left, 0 = straight, +1 = slice right for the default right-handed golfer.
const numberFa = n => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(Math.round(n));
let toastTimer;
function notify(text) { const el = $('toast'); el.textContent = text; el.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('on'), 2400); }
function distanceToCup() { return Math.hypot(ball.position.x - 3.5, ball.position.z + 118); }
function updateHUD() {
  $('strokeCount').textContent = numberFa(strokes);
  $('distanceBadge').textContent = holed ? 'توپ داخل حفره شد!' : `فاصله تا پرچم: ${numberFa(distanceToCup())} متر`;
  $('aimOut').textContent = `${numberFa(Number(aimInput.value))}°`;
  $('powerOut').textContent = `${numberFa(Number(powerInput.value))}٪`;
  const button = $('strike');
  if (holed) button.textContent = 'پایان سوراخ';
  else if (inFlight) button.textContent = 'توپ در حرکت…';
  else if (strokes > 0) button.textContent = 'ضربهٔ بعدی';
  else button.textContent = 'ضربه بزن';
  button.disabled = inFlight || !inGame;
  shotShapeInput.disabled = inFlight;
  button.style.opacity = button.disabled ? '.7' : '1';
}
function setGolferPose(name) {
  if (!mixer) return;
  const clip = name === 'putt' ? puttClip : swingClip;
  if (!clip) return;
  mixer.stopAllAction();
  const action = mixer.clipAction(clip);
  action.reset(); action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.fadeIn(0.09).play();
}
function syncGolfer() {
  const p = golfer || fallbackGolfer;
  p.position.set(ball.position.x, 0, ball.position.z + 2.2);
  p.rotation.y = Math.PI + THREE.MathUtils.degToRad(Number(aimInput.value));
}
function updateAimGuide() {
  if (!inGame) return;
  const a = THREE.MathUtils.degToRad(Number(aimInput.value));
  const f = new THREE.Vector3(Math.sin(a), 0, -Math.cos(a));
  guide.geometry.dispose();
  const pts = [new THREE.Vector3(ball.position.x, 0.08, ball.position.z), new THREE.Vector3(ball.position.x + f.x * 42, 0.08, ball.position.z + f.z * 42)];
  guide.geometry = new THREE.BufferGeometry().setFromPoints(pts);
  guide.computeLineDistances();
}
const guide = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: '#efe1b2', dashSize: 1.25, gapSize: 0.75, transparent: true, opacity: 0.75 }));
scene.add(guide);

function startRound() {
  inGame = true; strokes = 0; holed = false; inFlight = false; settled = true;
  shotShapeInput.value = 'straight'; shotCurve = 0;
  ball.position.set(0, 0.12, 0.8); lastSafe.copy(ball.position); velocity.set(0, 0, 0);
  fallbackGolfer.visible = !golfer;
  syncGolfer();
  $('shell').classList.add('hidden'); $('controls').hidden = false;
  $('courseTag').textContent = 'زمین شمارهٔ یک · سوراخ ۱ · پار ۳';
  cameraYaw = 0; cameraPitch = 0.27;
  updateHUD(); updateAimGuide();
  notify('جهت و قدرت را تنظیم کن؛ هدف، پرچمِ روی گرین است.');
}
$('guestStart').addEventListener('click', () => { $('loginPanel').hidden = true; $('mainPanel').hidden = false; $('mainPanel').classList.add('wide'); });
$('loginForm').addEventListener('submit', e => { e.preventDefault(); notify('ورود به حساب هنوز به سامانه متصل نیست؛ فعلاً مهمان وارد شو.'); });
$('startGame').addEventListener('click', startRound);
document.querySelectorAll('[data-info]').forEach(el => el.addEventListener('click', () => notify(el.dataset.info)));

function doStrike() {
  if (!inGame) { startRound(); return; }
  if (holed) { startRound(); return; }
  if (inFlight) return;
  if (strokes > 0 && settled) syncGolfer();
  const angleDeg = Number(aimInput.value);
  const power = Number(powerInput.value);
  const angle = THREE.MathUtils.degToRad(angleDeg);
  const speed = 18 + power * 0.28;
  const loft = distanceToCup() < 24 ? 0.09 : 0.43;
  // The aim guide remains the user's target line. Shot shape only adds airborne side-spin.
  shotCurve = shotShapeInput.value === 'hook' ? -1 : shotShapeInput.value === 'slice' ? 1 : 0;
  const dir = new THREE.Vector3(Math.sin(angle), 0, -Math.cos(angle));
  velocity.set(dir.x * speed * Math.cos(loft), speed * Math.sin(loft), dir.z * speed * Math.cos(loft));
  inFlight = true; settled = false; strokes += 1;
  setGolferPose(distanceToCup() < 24 ? 'putt' : 'swing');
  updateHUD();
}
$('strike').addEventListener('click', doStrike);
$('aim').addEventListener('input', () => { updateHUD(); updateAimGuide(); if (inGame && settled) syncGolfer(); });
$('power').addEventListener('input', updateHUD);
shotShapeInput.addEventListener('change', () => {
  shotCurve = shotShapeInput.value === 'hook' ? -1 : shotShapeInput.value === 'slice' ? 1 : 0;
  // Deliberately do not rebuild or rotate the aim guide when shot technique changes.
  notify('تکنیک ضربه تغییر کرد؛ خط هدف ثابت می‌ماند.');
});
$('camToggle').addEventListener('click', () => { cameraMode = (cameraMode + 1) % 3; notify(['دوربین پشت بازیکن','نمای بازتر از زمین','نمای توپ'][cameraMode]); });

let drag = null;
renderer.domElement.addEventListener('pointerdown', e => { if (!inGame || e.clientY > innerHeight - 190) return; drag = { id: e.pointerId, x: e.clientX, y: e.clientY }; renderer.domElement.setPointerCapture(e.pointerId); });
renderer.domElement.addEventListener('pointermove', e => {
  if (!drag || drag.id !== e.pointerId) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  drag.x = e.clientX; drag.y = e.clientY;
  cameraYaw = THREE.MathUtils.clamp(cameraYaw - dx * 0.0048, -1.2, 1.2);
  cameraPitch = THREE.MathUtils.clamp(cameraPitch + dy * 0.0025, 0.08, 0.62);
});
renderer.domElement.addEventListener('pointerup', e => { if (drag?.id === e.pointerId) drag = null; });
renderer.domElement.addEventListener('pointercancel', () => drag = null);

function updateCamera() {
  const focus = inGame ? ball.position : new THREE.Vector3(0, 0, 0);
  const forward = new THREE.Vector3(Math.sin(cameraYaw), 0, -Math.cos(cameraYaw));
  const distance = cameraMode === 1 ? 18 : cameraMode === 2 ? 5.6 : 9.2;
  const height = cameraMode === 1 ? 8.2 : cameraMode === 2 ? 2.9 : 4.2;
  const back = forward.clone().multiplyScalar(-distance);
  camera.position.set(focus.x + back.x, focus.y + height + Math.sin(cameraPitch) * 2, focus.z + back.z);
  camera.lookAt(focus.x + forward.x * (cameraMode === 1 ? 28 : 16), focus.y + 1.6, focus.z + forward.z * (cameraMode === 1 ? 28 : 16));
}
function finishShot() {
  inFlight = false; settled = true;
  const d = distanceToCup();
  if (d < 0.38) {
    holed = true; ball.position.set(3.5, 0.12, -118); velocity.set(0, 0, 0);
    notify(`توپ داخل حفره شد! تعداد ضربه: ${numberFa(strokes)}.`);
  } else if (ball.position.x < -14 && Math.hypot(ball.position.x + 31, ball.position.z + 70) < 17) {
    strokes += 1; ball.position.copy(lastSafe); velocity.set(0, 0, 0);
    notify('توپ وارد آب شد؛ یک ضربهٔ جریمه. از جای قبلی ادامه بده.');
  } else {
    lastSafe.copy(ball.position);
    if (strokes === 1) notify('ضربهٔ اول ثبت شد؛ مسیر توپ را دنبال کن.');
  }
  syncGolfer(); updateHUD(); updateAimGuide();
}
function tick(dt) {
  if (inFlight) {
    velocity.y -= 9.81 * dt;
    if (shotCurve !== 0 && ball.position.y > 0.16) {
      const horizontal = new THREE.Vector3(velocity.x, 0, velocity.z);
      const horizontalSpeed = horizontal.length();
      if (horizontalSpeed > 0.1) {
        horizontal.normalize();
        const lateral = new THREE.Vector3(-horizontal.z, 0, horizontal.x);
        const curveAcceleration = shotCurve * Math.min(2.2, horizontalSpeed * 0.06);
        velocity.addScaledVector(lateral, curveAcceleration * dt);
      }
    }
    ball.position.addScaledVector(velocity, dt);
    velocity.multiplyScalar(Math.max(0.985, 1 - dt * 0.012));
    if (ball.position.y <= 0.115) {
      ball.position.y = 0.115;
      if (velocity.y < -1.4) { velocity.y = -velocity.y * 0.36; velocity.x *= 0.77; velocity.z *= 0.77; }
      else { velocity.y = 0; velocity.x *= Math.max(0, 1 - dt * 1.45); velocity.z *= Math.max(0, 1 - dt * 1.45); }
      if (Math.hypot(velocity.x, velocity.z) < 0.34 && Math.abs(velocity.y) < 0.5) { velocity.set(0, 0, 0); finishShot(); }
    }
    // Capture the ball if it reaches the cup at low speed.
    if (distanceToCup() < 0.34 && ball.position.y < 0.35 && Math.hypot(velocity.x, velocity.z) < 7) { ball.position.set(3.5, 0.12, -118); velocity.set(0, 0, 0); finishShot(); }
    ballShadow.position.set(ball.position.x, 0.018, ball.position.z);
    ballShadow.scale.setScalar(Math.max(0.35, 1 - Math.max(0, ball.position.y - 0.12) * 0.045));
    if (Math.round(performance.now() / 180) % 2 === 0) { $('distanceBadge').textContent = `فاصله تا پرچم: ${numberFa(distanceToCup())} متر`; }
  }
  if (mixer) mixer.update(dt);
  updateCamera();
}
function loop() { requestAnimationFrame(loop); const dt = Math.min(clock.getDelta(), 0.04); tick(dt); renderer.render(scene, camera); }
loop();
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
