const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const guideModal = document.getElementById("guideModal");

const startBtn = document.getElementById("startBtn");
const guideBtn = document.getElementById("guideBtn");
const closeGuideBtn = document.getElementById("closeGuideBtn");
const deviceModal = document.getElementById("deviceModal");
const mobileModeBtn = document.getElementById("mobileModeBtn");
const pcModeBtn = document.getElementById("pcModeBtn");
const controlModeBadge = document.getElementById("controlModeBadge");
const touchControls = document.getElementById("touchControls");
const touchButtons = Array.from(document.querySelectorAll("[data-touch-control]"));

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const effectKameStorageKey = "effectKameOffset";

function loadFrames(path, count) {
  const frames = [];
  for (let i = 0; i < count; i++) {
    const img = new Image();
    img.src = `${path}${i}.png`;
    frames.push(img);
  }
  return frames;
}

function loadFramePaths(paths) {
  return paths.map((path) => {
    const img = new Image();
    img.src = path;
    return img;
  });
}

function buildSequence(pathPrefix, start, end) {
  const paths = [];
  for (let i = start; i <= end; i++) {
    paths.push(`${pathPrefix}${i}.png`);
  }
  return loadFramePaths(paths);
}

const idleFrames = loadFrames("assets/player/idle/1_0-", 4);
const backFrames = loadFrames("assets/back/1_22-", 4);
const crouchFrames = loadFrames("assets/crouch/1_10-", 2);
const crouchPrepFrames = loadFramePaths([
  "assets/crouch/1_10-0.png"
]);
const crouchHoldFrames = loadFramePaths([
  "assets/crouch/1_10-1.png"
]);
const powerPrepFrames = loadFramePaths([
  "assets/power/1_200-20.png",
  "assets/power/1_200-21.png"
]);
const powerFrames = loadFramePaths([
  "assets/power/1_200-22.png",
  "assets/power/1_200-23.png"
]);
const powerReleaseFrames = loadFramePaths([
  "assets/power/1_200-24.png"
]);
const kamePrepFrames = loadFramePaths([
  "assets/kamehameha/1_200-257.png",
  "assets/kamehameha/1_200-258.png",
  "assets/kamehameha/1_200-259.png"
]);
const kameLoopFrames = loadFramePaths([
  "assets/kamehameha/1_200-260.png",
  "assets/kamehameha/1_200-261.png"
]);
const kameChargeFrames = loadFramePaths([
  "assets/kamehameha/1_200-262.png",
  "assets/kamehameha/1_200-263.png"
]);
const kameFireFrames = loadFramePaths([
  "assets/kamehameha/1_200-264.png",
  "assets/kamehameha/1_200-265.png",
  "assets/kamehameha/1_200-266.png",
  "assets/kamehameha/1_200-267.png"
]);
const kameEndFrames = loadFramePaths([
  "assets/kamehameha/1_200-268.png",
  "assets/kamehameha/1_200-269.png"
]);
const effectKameChargeFrames = buildSequence("assets/effectkame/1_1420-", 0, 12);
const effectKameLoopFrames = buildSequence("assets/effectkame/1_1420-", 13, 25);
const jumpPrepFrames = loadFrames("assets/jump/1_10-", 2);
const jumpFrames = loadFramePaths([
  "assets/jump/1_40-0.png",
  "assets/jump/1_40-2.png"
]);
const hoverFrames = loadFramePaths([
  "assets/jump/1_40-2.png"
]);
const stageImage = new Image();
stageImage.src = "assets/stages/1_0-14.png";
const auraFrames = buildSequence("assets/effectaura1/1_1500-", 0, 3);
const aura2StartFrames = loadFramePaths([
  "assets/effectaura2/1_7002-0.png",
  "assets/effectaura2/1_7002-1.png",
  "assets/effectaura2/1_7002-2.png"
]);
const aura2LoopFrames = loadFramePaths([
  "assets/effectaura2/1_7002-4.png",
  "assets/effectaura2/1_7002-5.png",
  "assets/effectaura2/1_7002-6.png"
]);
const aura2EndFrames = loadFramePaths([
  "assets/effectaura2/1_7002-7.png",
  "assets/effectaura2/1_7002-8.png"
]);
const aura3Frames = buildSequence("assets/effectaura3/1_30202-", 0, 7);
const aura4Frames = buildSequence("assets/effectaura4/1_7003-", 0, 15);
const effectDustFrames = buildSequence("assets/effectbui/1_42-", 12, 31);
const effectDust2Frames = loadFramePaths([
  "assets/effectbui2/1_7001-7.png",
  "assets/effectbui2/1_7001-8.png",
  "assets/effectbui2/1_7001-9.png",
  "assets/effectbui2/1_7001-10.png",
  "assets/effectbui2/1_7001-11.png",
  "assets/effectbui2/1_7001-12.png"
]);
const walkFrames = loadFrames("assets/run/1_20-", 8);
const runFrames = loadFrames("assets/run/1_100-", 8);
const sprintFrames = loadFrames("assets/run/1_110-", 2);
const groundHeight = 140;
const groundY = gameCanvas.height - groundHeight;
const jumpPrepDuration = 6;
const powerPrepDuration = 8;

const player = {
  x: 240,
  y: groundY - 172,
  vx: 0,
  vy: 0,
  walkSpeed: 3,
  runSpeed: 8,
  sprintSpeed: 11,
  direction: 1,
  width: 170,
  height: 180,
  action: "idle",
  previousAction: "idle",
  frameIndex: 0,
  frameTimer: 0,
  frameDelay: 8,
  isRunning: false,
  runBurstPlayed: false,
  isJumping: false,
  canDoubleJump: true,
  canHover: false,
  isHovering: false,
  wantsHover: false,
  jumpPower: 0,
  jumpPrepTimer: 0,
  crouchPrepTimer: 0,
  powerPrepTimer: 0,
  powerReleaseTimer: 0,
  kamehamehaTimer: 0,
  kamePhase: "idle",
  kameLoopCycles: 0,
  kameAnchorX: 0,
  kameAnchorY: 0
};

const dustParticles = [];
const burstEffects = [];
const softDustEffects = [];
const auraEffect = {
  frameIndex: 0,
  frameTimer: 0,
  frameDelay: 5,
  alpha: 0,
  targetAlpha: 0,
  scale: 0.82,
  targetScale: 0.82
};
const aura2Effect = {
  frameIndex: 0,
  frameTimer: 0,
  frameDelay: 7,
  alpha: 0,
  targetAlpha: 0,
  scale: 0.9,
  targetScale: 0.9,
  phase: "idle",
  previousPhase: "idle"
};
const aura3Effect = {
  frameIndex: 0,
  frameTimer: 0,
  frameDelay: 4,
  alpha: 0,
  targetAlpha: 0,
  scale: 1,
  targetScale: 1
};
const aura4Effect = {
  active: false,
  frameIndex: 0,
  frameTimer: 0,
  frameDelay: 3,
  alpha: 0,
  scale: 1,
  driftX: 0,
  driftY: 0
};
const effectKame = {
  active: false,
  frameIndex: 0,
  frameTimer: 0,
  frameDelay: 4,
  phase: "idle",
  alpha: 0,
  anchorX: 0,
  anchorY: 0
};
const effectKameOffset = loadSavedEffectKameOffset();
const effectKameEditor = {
  dragging: false
};
const cameraShake = {
  x: 0,
  y: 0,
  strength: 0,
  targetStrength: 0
};

const keys = {
  a: false,
  d: false,
  enter: false,
  s: false,
  w: false,
  h: false
};

let gameStarted = false;
let selectedControlMode = null;
let lastDPressTime = 0;
let lastWPressTime = 0;
const doubleTapDelay = 250;
const gravity = 0.9;

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function applyControlMode(mode) {
  selectedControlMode = mode;
  document.body.classList.toggle("force-touch-controls", mode === "mobile");

  if (controlModeBadge) {
    controlModeBadge.textContent = mode === "mobile" ? "Mode: Mobile" : "Mode: PC";
    controlModeBadge.classList.remove("hidden");
  }

  if (touchControls) {
    const shouldShowTouch = mode === "mobile";
    touchControls.classList.toggle("hidden", !shouldShowTouch);
    touchControls.setAttribute("aria-hidden", shouldShowTouch ? "false" : "true");
  }
}

function startGameWithMode(mode) {
  applyControlMode(mode);
  gameStarted = true;
  menuScreen.classList.add("hidden");
  if (deviceModal) {
    deviceModal.classList.add("hidden");
  }
  gameScreen.classList.remove("hidden");
  gameLoop();
}

function triggerJump() {
  const now = Date.now();
  const isDoubleTapW = now - lastWPressTime <= doubleTapDelay;
  lastWPressTime = now;
  keys.w = true;

  if (!player.isJumping && player.jumpPrepTimer === 0) {
    player.jumpPower = isDoubleTapW ? -15 : -11.5;
    player.jumpPrepTimer = jumpPrepDuration;
    player.canDoubleJump = !isDoubleTapW;
    player.canHover = isDoubleTapW;
    player.wantsHover = isDoubleTapW;
    player.isHovering = false;
    player.action = "jumpPrep";
    player.frameIndex = 0;
    player.frameTimer = 0;
  } else if (player.canDoubleJump) {
    player.vy = -14;
    player.canDoubleJump = false;
    player.canHover = false;
    player.isHovering = false;
    player.wantsHover = false;
    player.action = "jump";
    player.frameIndex = 0;
    player.frameTimer = 0;
  }
}

function pressControl(control) {
  if (control === "a") {
    keys.a = true;
    return;
  }

  if (control === "d") {
    const now = Date.now();
    player.isRunning = now - lastDPressTime <= doubleTapDelay;
    lastDPressTime = now;
    keys.d = true;
    return;
  }

  if (control === "s") {
    keys.s = true;
    return;
  }

  if (control === "w") {
    triggerJump();
    return;
  }

  if (control === "enter") {
    keys.enter = true;
    if (!player.isJumping && player.powerPrepTimer === 0 && player.action !== "power") {
      player.action = "powerPrep";
      player.powerPrepTimer = powerPrepDuration;
      player.frameIndex = 0;
      player.frameTimer = 0;
    }
  }
}

function releaseControl(control) {
  if (control === "a") {
    keys.a = false;
    return;
  }

  if (control === "d") {
    keys.d = false;
    player.isRunning = false;
    return;
  }

  if (control === "s") {
    keys.s = false;
    return;
  }

  if (control === "w") {
    keys.w = false;
    player.wantsHover = false;
    return;
  }

  if (control === "enter") {
    keys.enter = false;
  }
}

function loadSavedEffectKameOffset() {
  try {
    const saved = localStorage.getItem(effectKameStorageKey);
    if (!saved) return { x: 92, y: 92 };
    const parsed = JSON.parse(saved);
    if (typeof parsed.x === "number" && typeof parsed.y === "number") {
      return { x: parsed.x, y: parsed.y };
    }
  } catch (error) {
    console.warn("Could not load effectKame offset:", error);
  }
  return { x: 92, y: 92 };
}

function saveEffectKameOffset() {
  try {
    localStorage.setItem(effectKameStorageKey, JSON.stringify(effectKameOffset));
  } catch (error) {
    console.warn("Could not save effectKame offset:", error);
  }
}

function getCanvasPointerPosition(event) {
  const rect = gameCanvas.getBoundingClientRect();
  const scaleX = gameCanvas.width / rect.width;
  const scaleY = gameCanvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function updateEffectKameOffsetFromPointer(event) {
  if (player.action !== "kamehameha") return;
  const pointer = getCanvasPointerPosition(event);
  effectKameOffset.x = Math.round(pointer.x - player.kameAnchorX);
  effectKameOffset.y = Math.round(pointer.y - player.kameAnchorY);
}

function spawnDustEffect(x, y, direction) {
  burstEffects.push({
    x,
    y,
    direction,
    frameIndex: 0,
    frameTimer: 0,
    frameDelay: 4,
    life: 30,
    maxLife: 30,
    drift: 0
  });
}

function spawnSoftDustEffect(x, y, direction = 1, scale = 1, alpha = 0.68) {
  softDustEffects.push({
    x,
    y,
    direction,
    scale,
    alpha,
    frameIndex: 0,
    frameTimer: 0,
    frameDelay: 5,
    drift: 0
  });
}

function spawnDust(x, y, amount, direction = 0, tint = "rgba(210, 230, 210, 0.6)") {
  for (let i = 0; i < amount; i++) {
    dustParticles.push({
      x,
      y,
      vx: direction * (Math.random() * 1.4 + 0.6) + (Math.random() - 0.5) * 1.6,
      vy: -(Math.random() * 1.8 + 0.4),
      radius: Math.random() * 6 + 4,
      life: 18 + Math.floor(Math.random() * 8),
      maxLife: 18 + Math.floor(Math.random() * 8),
      tint
    });
  }
}

function spawnBurstDust(x, y, direction) {
  for (let i = 0; i < 10; i++) {
    dustParticles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 4,
      vx: -direction * (Math.random() * 3.4 + 1.8),
      vy: -(Math.random() * 2.8 + 0.8),
      radius: Math.random() * 8 + 6,
      life: 22 + Math.floor(Math.random() * 10),
      maxLife: 22 + Math.floor(Math.random() * 10),
      tint: "rgba(220, 235, 220, 0.82)"
    });
  }
}

function updateDust() {
  for (let i = dustParticles.length - 1; i >= 0; i--) {
    const particle = dustParticles[i];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.96;
    particle.vy += 0.08;
    particle.life--;

    if (particle.life <= 0) {
      dustParticles.splice(i, 1);
    }
  }
}

function updateBurstEffects() {
  for (let i = burstEffects.length - 1; i >= 0; i--) {
    const effect = burstEffects[i];
    effect.drift += 0.08;
    effect.x += -effect.direction * (0.45 + effect.drift * 0.15);
    effect.y -= 0.02;
    effect.frameTimer++;
    effect.life--;

    if (effect.frameTimer >= effect.frameDelay) {
      effect.frameTimer = 0;
      effect.frameIndex++;
    }

    if (effect.life <= 0 || effect.frameIndex >= effectDustFrames.length) {
      burstEffects.splice(i, 1);
    }
  }
}

function updateSoftDustEffects() {
  for (let i = softDustEffects.length - 1; i >= 0; i--) {
    const effect = softDustEffects[i];
    effect.frameTimer++;
    effect.drift += 0.12;
    effect.x += -effect.direction * 0.16;
    effect.y -= 0.02;
    effect.alpha *= 0.95;
    effect.scale += 0.008;

    if (effect.frameTimer >= effect.frameDelay) {
      effect.frameTimer = 0;
      effect.frameIndex++;
    }

    if (effect.frameIndex >= effectDust2Frames.length || effect.alpha < 0.04) {
      softDustEffects.splice(i, 1);
    }
  }
}

function drawDust() {
  for (const particle of dustParticles) {
    const alpha = particle.life / particle.maxLife;
    ctx.fillStyle = particle.tint.replace(/[\d.]+\)$/, `${(alpha * 0.7).toFixed(2)})`);
    ctx.beginPath();
    ctx.ellipse(
      Math.round(particle.x),
      Math.round(particle.y),
      Math.round(particle.radius),
      Math.round(particle.radius * 0.6),
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function drawBurstEffects() {
  for (const effect of burstEffects) {
    const img = effectDustFrames[effect.frameIndex];
    if (!img || !img.complete) continue;

    const drawWidth = 92;
    const aspectRatio = img.naturalWidth / img.naturalHeight || 1;
    const drawHeight = Math.round(drawWidth / aspectRatio);
    const drawX = Math.round(effect.x);
    const drawY = Math.round(effect.y - drawHeight);

    ctx.save();
    if (effect.direction === -1) {
      const centerX = drawX + drawWidth / 2;
      ctx.translate(centerX, 0);
      ctx.scale(-1, 1);
      ctx.translate(-centerX, 0);
    }

    const alpha = Math.max(0, effect.life / effect.maxLife);
    ctx.globalAlpha = alpha * 0.85;
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }
}

function drawSoftDustEffects() {
  for (const effect of softDustEffects) {
    const img = effectDust2Frames[effect.frameIndex];
    if (!img || !img.complete) continue;

    const drawWidth = Math.round(92 * effect.scale);
    const aspectRatio = img.naturalWidth / img.naturalHeight || 1;
    const drawHeight = Math.round(drawWidth / aspectRatio);
    const drawX = Math.round(effect.x - drawWidth / 2);
    const drawY = Math.round(effect.y - drawHeight);

    ctx.save();
    if (effect.direction === -1) {
      const centerX = drawX + drawWidth / 2;
      ctx.translate(centerX, 0);
      ctx.scale(-1, 1);
      ctx.translate(-centerX, 0);
    }

    ctx.globalAlpha = effect.alpha;
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }
}

function updateAuraEffect() {
  const shouldShowAura =
    player.action === "powerPrep" ||
    player.action === "power" ||
    player.action === "powerRelease";
  const enteredPowerRelease =
    player.action === "powerRelease" && player.previousAction !== "powerRelease";

  aura2Effect.previousPhase = aura2Effect.phase;

  if (player.action === "powerPrep") {
    auraEffect.targetAlpha = 0.66;
    auraEffect.targetScale = 0.96;
    aura2Effect.targetAlpha = 0.42;
    aura2Effect.targetScale = 0.94;
    aura3Effect.targetAlpha = 0.34;
    aura3Effect.targetScale = 0.96;
    aura2Effect.phase = "start";
  } else if (player.action === "power") {
    auraEffect.targetAlpha = 0.9;
    auraEffect.targetScale = 1;
    aura2Effect.targetAlpha = 0.7;
    aura2Effect.targetScale = 1;
    aura3Effect.targetAlpha = 0.6;
    aura3Effect.targetScale = 1;
    aura2Effect.phase = "loop";
  } else if (player.action === "powerRelease") {
    auraEffect.targetAlpha = 0;
    auraEffect.targetScale = 1.12;
    aura2Effect.targetAlpha = 0;
    aura2Effect.targetScale = 1.08;
    aura3Effect.targetAlpha = 0;
    aura3Effect.targetScale = 1.08;
    aura2Effect.phase = "end";
  } else {
    auraEffect.targetAlpha = 0;
    auraEffect.targetScale = 0.82;
    aura2Effect.targetAlpha = 0;
    aura2Effect.targetScale = 0.9;
    aura3Effect.targetAlpha = 0;
    aura3Effect.targetScale = 1;
    aura2Effect.phase = "idle";
  }

  auraEffect.alpha += (auraEffect.targetAlpha - auraEffect.alpha) * 0.14;
  auraEffect.scale += (auraEffect.targetScale - auraEffect.scale) * 0.16;
  aura2Effect.alpha += (aura2Effect.targetAlpha - aura2Effect.alpha) * 0.16;
  aura2Effect.scale += (aura2Effect.targetScale - aura2Effect.scale) * 0.18;
  aura3Effect.alpha += (aura3Effect.targetAlpha - aura3Effect.alpha) * 0.16;
  aura3Effect.scale += (aura3Effect.targetScale - aura3Effect.scale) * 0.16;

  if (auraEffect.alpha < 0.02) {
    auraEffect.alpha = 0;
  }
  if (aura2Effect.alpha < 0.02) {
    aura2Effect.alpha = 0;
  }
  if (aura3Effect.alpha < 0.02) {
    aura3Effect.alpha = 0;
  }

  if (aura2Effect.phase !== aura2Effect.previousPhase) {
    aura2Effect.frameIndex = 0;
    aura2Effect.frameTimer = 0;
  }

  if (enteredPowerRelease) {
    aura4Effect.active = true;
    aura4Effect.frameIndex = 0;
    aura4Effect.frameTimer = 0;
    aura4Effect.alpha = 0.96;
    aura4Effect.scale = 1.08;
    aura4Effect.driftX = -player.direction * 6;
    aura4Effect.driftY = 2;
  }

  if (shouldShowAura) {
    auraEffect.frameTimer++;
    if (auraEffect.frameTimer >= auraEffect.frameDelay) {
      auraEffect.frameTimer = 0;
      auraEffect.frameIndex = (auraEffect.frameIndex + 1) % auraFrames.length;
    }

    const aura2Frames =
      aura2Effect.phase === "start"
        ? aura2StartFrames
        : aura2Effect.phase === "loop"
          ? aura2LoopFrames
          : aura2Effect.phase === "end"
            ? aura2EndFrames
            : [];

    if (aura2Frames.length > 0) {
      aura2Effect.frameTimer++;
      if (aura2Effect.frameTimer >= aura2Effect.frameDelay) {
        aura2Effect.frameTimer = 0;

        if (aura2Effect.phase === "loop") {
          aura2Effect.frameIndex = (aura2Effect.frameIndex + 1) % aura2Frames.length;
        } else if (aura2Effect.frameIndex < aura2Frames.length - 1) {
          aura2Effect.frameIndex++;
        }
      }
    }

    aura3Effect.frameTimer++;
    if (aura3Effect.frameTimer >= aura3Effect.frameDelay) {
      aura3Effect.frameTimer = 0;
      aura3Effect.frameIndex = (aura3Effect.frameIndex + 1) % aura3Frames.length;
    }
  } else {
    auraEffect.frameIndex = 0;
    auraEffect.frameTimer = 0;
    aura2Effect.frameIndex = 0;
    aura2Effect.frameTimer = 0;
    aura3Effect.frameIndex = 0;
    aura3Effect.frameTimer = 0;
  }

  if (aura4Effect.active) {
    aura4Effect.frameTimer++;
    if (aura4Effect.frameTimer >= aura4Effect.frameDelay) {
      aura4Effect.frameTimer = 0;
      aura4Effect.frameIndex++;
    }

    aura4Effect.scale += 0.035;
    aura4Effect.alpha *= 0.94;
    aura4Effect.driftX += -player.direction * 0.3;
    aura4Effect.driftY += 0.08;

    if (aura4Effect.frameIndex >= aura4Frames.length || aura4Effect.alpha < 0.03) {
      aura4Effect.active = false;
      aura4Effect.frameIndex = 0;
      aura4Effect.frameTimer = 0;
      aura4Effect.alpha = 0;
      aura4Effect.scale = 1;
      aura4Effect.driftX = 0;
      aura4Effect.driftY = 0;
    }
  }
}

function updateEffectKame() {
  const shouldShowKameEffect = player.action === "kamehameha";

  if (shouldShowKameEffect) {
    const isLoopPhase = player.kamePhase === "charge" || player.kamePhase === "fire";
    const targetPhase = isLoopPhase ? "loop" : "charge";

    if (!effectKame.active) {
      effectKame.active = true;
      effectKame.phase = "charge";
      effectKame.frameIndex = 0;
      effectKame.frameTimer = 0;
      effectKame.alpha = 0.92;
    } else if (effectKame.phase !== targetPhase) {
      effectKame.phase = targetPhase;
      effectKame.frameIndex = 0;
      effectKame.frameTimer = 0;
    }

    effectKame.anchorX = player.kameAnchorX + effectKameOffset.x;
    effectKame.anchorY = player.kameAnchorY + effectKameOffset.y;
    effectKame.alpha += (0.96 - effectKame.alpha) * 0.18;

    const activeFrames =
      effectKame.phase === "charge" ? effectKameChargeFrames : effectKameLoopFrames;

    effectKame.frameTimer++;
    if (effectKame.frameTimer >= effectKame.frameDelay) {
      effectKame.frameTimer = 0;

      if (effectKame.phase === "charge") {
        if (effectKame.frameIndex < activeFrames.length - 1) {
          effectKame.frameIndex++;
        } else {
          effectKame.phase = "loop";
          effectKame.frameIndex = 0;
        }
      } else {
        effectKame.frameIndex = (effectKame.frameIndex + 1) % activeFrames.length;
      }
    }
  } else if (effectKame.active) {
    effectKame.alpha *= 0.82;
    if (effectKame.alpha < 0.04) {
      effectKame.active = false;
      effectKame.phase = "idle";
      effectKame.frameIndex = 0;
      effectKame.frameTimer = 0;
      effectKame.alpha = 0;
    }
  }
}

function updateCameraShake() {
  if (player.action === "powerPrep") {
    cameraShake.targetStrength = 1.4;
  } else if (player.action === "power") {
    cameraShake.targetStrength = 2.6;
  } else if (player.action === "powerRelease") {
    cameraShake.targetStrength = 1.2;
  } else {
    cameraShake.targetStrength = 0;
  }

  cameraShake.strength += (cameraShake.targetStrength - cameraShake.strength) * 0.2;

  if (cameraShake.strength < 0.05) {
    cameraShake.strength = 0;
    cameraShake.x = 0;
    cameraShake.y = 0;
    return;
  }

  cameraShake.x = (Math.random() - 0.5) * cameraShake.strength * 2;
  cameraShake.y = (Math.random() - 0.5) * cameraShake.strength;
}

function drawAuraLayer(frames, effectState, options) {
  if (effectState.alpha <= 0) return;

  const img = frames[effectState.frameIndex];
  if (!img || !img.complete) return;

  const auraBoxWidth = Math.round(options.baseWidth * effectState.scale);
  const auraBoxHeight = Math.round(options.baseHeight * effectState.scale);
  const aspectRatio = img.naturalWidth / img.naturalHeight || 1;
  let drawWidth = auraBoxWidth;
  let drawHeight = Math.round(drawWidth / aspectRatio);

  if (drawHeight > auraBoxHeight) {
    drawHeight = auraBoxHeight;
    drawWidth = Math.round(drawHeight * aspectRatio);
  }

  const auraCenterX = player.x + player.width / 2 + options.offsetX;
  const auraBottomY = groundY + options.offsetY;
  const drawX = Math.round(auraCenterX - drawWidth / 2);
  const drawY = Math.round(auraBottomY - drawHeight);

  ctx.save();
  ctx.globalAlpha = effectState.alpha;
  ctx.globalCompositeOperation = options.composite;
  ctx.filter = options.filter;
  if (player.direction === -1) {
    const centerX = drawX + drawWidth / 2;
    ctx.translate(centerX, 0);
    ctx.scale(-1, 1);
    ctx.translate(-centerX, 0);
  }

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function drawAuraEffect() {
  drawAuraLayer(aura3Frames, aura3Effect, {
    baseWidth: 236,
    baseHeight: 84,
    offsetX: 0,
    offsetY: 18,
    composite: "screen",
    filter: "brightness(1.08) contrast(1.1)"
  });

  const aura2Frames =
    aura2Effect.phase === "start"
      ? aura2StartFrames
      : aura2Effect.phase === "loop"
        ? aura2LoopFrames
        : aura2Effect.phase === "end"
          ? aura2EndFrames
          : [];

  if (aura2Frames.length > 0) {
    const aura2FrameState = {
      ...aura2Effect,
      frameIndex: Math.min(aura2Effect.frameIndex, aura2Frames.length - 1)
    };

    drawAuraLayer(aura2Frames, aura2FrameState, {
      baseWidth: 312,
      baseHeight: 168,
      offsetX: 0,
      offsetY: 30,
      composite: "lighter",
      filter: "brightness(1.12) contrast(1.12)"
    });
  }

  drawAuraLayer(auraFrames, auraEffect, {
    baseWidth: 258,
    baseHeight: 280,
    offsetX: 1,
    offsetY: 18,
    composite: "screen",
    filter: "sepia(1) saturate(12) hue-rotate(2deg) brightness(1.48) contrast(1.14)"
  });

  if (aura4Effect.active) {
    const aura4FrameState = {
      ...aura4Effect,
      frameIndex: Math.min(aura4Effect.frameIndex, aura4Frames.length - 1)
    };

    drawAuraLayer(aura4Frames, aura4FrameState, {
      baseWidth: 470,
      baseHeight: 138,
      offsetX: aura4Effect.driftX,
      offsetY: 34 + aura4Effect.driftY,
      composite: "source-over",
      filter: "sepia(0.22) saturate(0.9) brightness(2.1) contrast(1.55)"
    });
  }
}

function drawEffectKame() {
  if (!effectKame.active || effectKame.alpha <= 0) return;

  const frames =
    effectKame.phase === "charge" ? effectKameChargeFrames : effectKameLoopFrames;
  const img = frames[Math.min(effectKame.frameIndex, frames.length - 1)];
  if (!img || !img.complete) return;

  const sourceAnchorWidth = 219;
  const sourceAnchorHeight = 207;
  const drawBoxWidth = 92;
  const drawBoxHeight = 92;
  const scale = Math.min(drawBoxWidth / sourceAnchorWidth, drawBoxHeight / sourceAnchorHeight);
  const drawWidth = Math.round(img.naturalWidth * scale);
  const drawHeight = Math.round(img.naturalHeight * scale);
  const drawX = Math.round(effectKame.anchorX - drawWidth / 2);
  const drawY = Math.round(effectKame.anchorY - drawHeight / 2);

  ctx.save();
  ctx.globalAlpha = effectKame.alpha;
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "brightness(1.55) contrast(1.28)";
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();

  if (player.action === "kamehameha") {
    ctx.save();
    ctx.strokeStyle = effectKameEditor.dragging ? "rgba(255, 220, 120, 0.95)" : "rgba(180, 230, 255, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(Math.round(effectKame.anchorX), Math.round(effectKame.anchorY), 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(Math.round(effectKame.anchorX) - 12, Math.round(effectKame.anchorY));
    ctx.lineTo(Math.round(effectKame.anchorX) + 12, Math.round(effectKame.anchorY));
    ctx.moveTo(Math.round(effectKame.anchorX), Math.round(effectKame.anchorY) - 12);
    ctx.lineTo(Math.round(effectKame.anchorX), Math.round(effectKame.anchorY) + 12);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "14px sans-serif";
    ctx.fillText(`Shift+drag save: ${effectKameOffset.x}, ${effectKameOffset.y}`, Math.round(effectKame.anchorX) - 70, Math.round(effectKame.anchorY) - 18);
    ctx.restore();
  }
}

function getActionConfig() {
  if (player.action === "powerRelease") {
    return { frames: powerReleaseFrames, frameDelay: 999, width: 176, height: 184, yOffset: 6 };
  }

  if (player.action === "powerPrep") {
    return { frames: powerPrepFrames, frameDelay: 10, width: 170, height: 180, yOffset: 8 };
  }

  if (player.action === "power") {
    return { frames: powerFrames, frameDelay: 9, width: 176, height: 184, yOffset: 6 };
  }

  if (player.action === "kamehameha") {
    const frames =
      player.kamePhase === "prep"
        ? kamePrepFrames
        : player.kamePhase === "loop"
          ? kameLoopFrames
          : player.kamePhase === "charge"
            ? kameChargeFrames
            : player.kamePhase === "fire"
              ? kameFireFrames
              : kameEndFrames;

    const frameDelay =
      player.kamePhase === "loop"
        ? 9
        : player.kamePhase === "fire"
          ? 6
          : 8;

    const xOffset =
      player.kamePhase === "prep"
        ? -2
        : player.kamePhase === "loop"
          ? 0
          : player.kamePhase === "charge"
            ? 4
            : player.kamePhase === "fire"
              ? 10
              : 6;

    const yOffset =
      player.kamePhase === "prep"
        ? 8
        : player.kamePhase === "loop"
          ? 9
          : player.kamePhase === "charge"
            ? 8
            : player.kamePhase === "fire"
              ? 7
              : 8;

    return {
      frames,
      frameDelay,
      width: Math.round(player.width * 1.03),
      height: Math.round(player.height * 0.98),
      xOffset,
      yOffset,
      anchorX: player.kameAnchorX,
      anchorY: player.kameAnchorY,
      sourceAnchorWidth: 53,
      sourceAnchorHeight: 55
    };
  }

  if (player.action === "crouchPrep") {
    return { frames: crouchPrepFrames, frameDelay: 14, width: 132, height: 140, yOffset: 42 };
  }

  if (player.action === "crouch") {
    return { frames: crouchHoldFrames, frameDelay: 999, width: 136, height: 124, yOffset: 58 };
  }

  if (player.action === "hover") {
    return { frames: hoverFrames, frameDelay: 999, width: 170, height: 180, yOffset: 8 };
  }

  if (player.action === "jump") {
    return { frames: jumpFrames, frameDelay: 8, width: 170, height: 180, yOffset: 8 };
  }

  if (player.action === "jumpPrep") {
    return { frames: jumpPrepFrames, frameDelay: 10, width: 150, height: 170, yOffset: 18 };
  }

  if (player.action === "back") {
    return { frames: backFrames, frameDelay: 12, width: 170, height: 180, yOffset: 8 };
  }

  if (player.action === "run") {
    return { frames: runFrames, frameDelay: 8, width: 178, height: 180, yOffset: 8 };
  }

  if (player.action === "walk") {
    return { frames: walkFrames, frameDelay: 12, width: 170, height: 180, yOffset: 8 };
  }

  return { frames: idleFrames, frameDelay: 14, width: 170, height: 180, yOffset: 8 };
}

function drawBackground() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  if (stageImage.complete) {
    ctx.drawImage(stageImage, 0, 0, gameCanvas.width, gameCanvas.height);
    return;
  }

  const sky = ctx.createLinearGradient(0, 0, 0, gameCanvas.height);
  sky.addColorStop(0, "#7ec8ff");
  sky.addColorStop(1, "#cfeeff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  ctx.fillStyle = "#9ac7d8";
  ctx.beginPath();
  ctx.moveTo(0, 520);
  ctx.lineTo(180, 380);
  ctx.lineTo(360, 520);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(260, 520);
  ctx.lineTo(470, 340);
  ctx.lineTo(700, 520);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(620, 520);
  ctx.lineTo(860, 360);
  ctx.lineTo(1080, 520);
  ctx.fill();

  ctx.fillStyle = "#67c56b";
  ctx.fillRect(0, groundY, gameCanvas.width, groundHeight);

  ctx.fillStyle = "#4ba858";
  ctx.fillRect(0, groundY, gameCanvas.width, 10);

  drawCloud(140, 100, 70);
  drawCloud(430, 70, 90);
  drawCloud(760, 120, 75);
  drawCloud(1080, 90, 85);
}

function drawCloud(x, y, size) {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(x, y, size * 0.28, 0, Math.PI * 2);
  ctx.arc(x + size * 0.24, y - 12, size * 0.22, 0, Math.PI * 2);
  ctx.arc(x + size * 0.48, y, size * 0.3, 0, Math.PI * 2);
  ctx.arc(x + size * 0.2, y + 10, size * 0.24, 0, Math.PI * 2);
  ctx.fill();
}

function updatePlayer() {
  player.previousAction = player.action;
  const wasJumping = player.isJumping;
  const wasOnGround = !player.isJumping && player.jumpPrepTimer === 0;

  if (player.jumpPrepTimer > 0) {
    player.jumpPrepTimer--;

    if (player.jumpPrepTimer === 0) {
      player.vy = player.jumpPower;
      player.isJumping = true;
      player.isHovering = player.canHover && player.wantsHover && keys.w;
      player.action = player.isHovering ? "hover" : "jump";
    }
  }

  if (player.crouchPrepTimer > 0) {
    player.crouchPrepTimer--;
    player.vx *= 0.6;

    if (player.crouchPrepTimer === 0 && keys.s && !player.isJumping) {
      player.action = "crouch";
    }
  }

  if (player.powerPrepTimer > 0) {
    player.powerPrepTimer--;
    player.vx *= 0.75;

    if (player.powerPrepTimer === 0 && keys.enter && !player.isJumping) {
      player.action = "power";
    }
  }

  if (player.powerReleaseTimer > 0) {
    player.powerReleaseTimer--;
    player.vx *= 0.8;

    if (player.powerReleaseTimer === 0) {
      player.action = Math.abs(player.vx) > 0.5 ? "walk" : "idle";
    }
  }

  if (player.kamehamehaTimer > 0) {
    player.kamehamehaTimer--;
    player.vx *= 0.6;

    if (player.kamehamehaTimer === 0 && player.action === "kamehameha") {
      player.action = "idle";
      player.kamePhase = "idle";
      player.kameLoopCycles = 0;
      player.kameAnchorX = 0;
      player.kameAnchorY = 0;
    }
  }

  if (player.kamehamehaTimer > 0) {
    player.vx *= 0.88;
    player.action = "kamehameha";
  } else if (player.powerReleaseTimer > 0) {
    player.vx *= 0.9;
  } else if (player.powerPrepTimer > 0) {
    player.vx *= 0.9;
  } else if (player.crouchPrepTimer > 0) {
    player.vx *= 0.9;
  } else if (player.jumpPrepTimer > 0) {
    player.vx *= 0.9;
  } else if (player.isJumping) {
    if (player.canHover && player.wantsHover && keys.w) {
      player.isHovering = true;
      player.vy = 0;
      player.action = "hover";
    } else {
      player.isHovering = false;
    }

    if (keys.a) {
      player.vx = -player.walkSpeed;
    } else if (keys.d) {
      player.vx = player.isRunning ? player.runSpeed : player.walkSpeed;
    } else {
      player.vx *= 0.9;
    }
  } else if (keys.enter) {
    player.isRunning = false;
    player.vx *= 0.7;
    if (player.action !== "power") {
      player.action = "powerPrep";
      if (player.powerPrepTimer === 0) {
        player.powerPrepTimer = powerPrepDuration;
      }
    }
  } else if (keys.s) {
    player.isRunning = false;
    player.vx *= 0.7;
    if (player.action !== "crouch") {
      player.action = "crouchPrep";
      player.crouchPrepTimer = 6;
    }
  } else if (keys.a) {
    player.isRunning = false;
    player.vx = -player.walkSpeed;
    player.direction = 1;
    player.action = "back";
  } else if (keys.d) {
    player.direction = 1;

    if (player.isRunning) {
      player.vx = player.runSpeed;
      player.action = "run";
    } else {
      player.vx = player.walkSpeed;
      player.action = "walk";
    }
  } else {
    player.isRunning = false;
    player.vx *= 0.8;
    player.action = Math.abs(player.vx) > 0.5 ? "walk" : "idle";
  }

  player.x += player.vx;
  player.y += player.vy;
  player.vy += player.isHovering ? 0 : gravity;

  const groundPlayerY = groundY - 172;
  if (player.y >= groundPlayerY) {
    player.y = groundPlayerY;
    player.vy = 0;

    if (player.jumpPrepTimer === 0) {
      if (wasJumping) {
        spawnDust(player.x + 72, groundY - 8, 8, player.direction === 1 ? -0.6 : 0.6, "rgba(205, 220, 205, 0.65)");
        spawnSoftDustEffect(player.x + 84, groundY + 6, player.direction, 1.05, 0.74);
      }
      player.isJumping = false;
      player.canDoubleJump = true;
      player.canHover = false;
      player.isHovering = false;
      player.wantsHover = false;
      player.jumpPower = 0;
    }
  }

  if (!keys.s && (player.action === "crouch" || player.action === "crouchPrep")) {
    player.crouchPrepTimer = 0;
    player.action = Math.abs(player.vx) > 0.5 ? "walk" : "idle";
  }

  if (!keys.enter && player.action === "power") {
    player.powerPrepTimer = 0;
    player.powerReleaseTimer = 8;
    player.action = "powerRelease";
    player.frameIndex = 0;
    player.frameTimer = 0;
  }

  if (!keys.enter && player.action === "powerPrep") {
    player.powerPrepTimer = 0;
    player.action = Math.abs(player.vx) > 0.5 ? "walk" : "idle";
  }

  if (player.x < 0) player.x = 0;
  const maxX = gameCanvas.width - getActionConfig().width;
  if (player.x > maxX) {
    player.x = maxX;
  }

  if (player.isJumping && player.jumpPrepTimer === 0 && !player.isHovering) {
    player.action = "jump";
  }

  if (player.action === "run" && !player.isJumping && !player.runBurstPlayed) {
    spawnDustEffect(player.x - 42, groundY + 10, player.direction);
    spawnDust(player.x + 62, groundY - 8, 4, player.direction === 1 ? -0.45 : 0.45, "rgba(220, 235, 220, 0.7)");
    player.runBurstPlayed = true;
  }

  if (player.action !== "run") {
    player.runBurstPlayed = false;
  }

  if (wasOnGround && !player.isJumping && player.action === "walk" && Math.abs(player.vx) > 1.2 && player.frameTimer === 0) {
    spawnDust(player.x + 58, groundY - 6, 2, player.direction === 1 ? -0.3 : 0.3);
    spawnSoftDustEffect(player.x + 72, groundY + 2, player.direction, 0.86, 0.5);
  }

  if (wasOnGround && !player.isJumping && player.action === "run" && Math.abs(player.vx) > 3 && player.frameTimer === 0) {
    spawnDust(player.x + 64, groundY - 6, 3, player.direction === 1 ? -0.55 : 0.55, "rgba(215, 230, 215, 0.7)");
    spawnSoftDustEffect(player.x + 78, groundY + 4, player.direction, 0.98, 0.56);
  }

  player.frameDelay = getActionConfig().frameDelay;

  if (player.action !== player.previousAction) {
    player.frameIndex = 0;
    player.frameTimer = 0;
  }

  if (player.action === "kamehameha") {
    const currentFrames =
      player.kamePhase === "prep"
        ? kamePrepFrames
        : player.kamePhase === "loop"
          ? kameLoopFrames
          : player.kamePhase === "charge"
            ? kameChargeFrames
            : player.kamePhase === "fire"
              ? kameFireFrames
              : kameEndFrames;

    const reachedPhaseEnd = player.frameIndex >= currentFrames.length - 1 && player.frameTimer === 0;

    if (reachedPhaseEnd) {
      if (player.kamePhase === "prep") {
        player.kamePhase = "loop";
        player.kameLoopCycles = 0;
        player.frameIndex = 0;
      } else if (player.kamePhase === "loop") {
        player.kameLoopCycles++;
        if (player.kameLoopCycles >= 2) {
          player.kamePhase = "charge";
          player.frameIndex = 0;
        } else {
          player.frameIndex = 0;
        }
      } else if (player.kamePhase === "charge") {
        player.kamePhase = "fire";
        player.frameIndex = 0;
      } else if (player.kamePhase === "fire") {
        player.kamePhase = "end";
        player.frameIndex = 0;
      } else if (player.kamePhase === "end") {
        player.kamehamehaTimer = 0;
        player.kamePhase = "idle";
        player.action = "idle";
        player.frameIndex = 0;
      }
      player.frameTimer = 0;
    }
  }
}

function drawPlayer() {
  const actionConfig = getActionConfig();
  const frames = actionConfig.frames;
  const safeFrameIndex = player.frameIndex % frames.length;
  const img = frames[safeFrameIndex];
  const frameOffset = { x: actionConfig.xOffset || 0, y: actionConfig.yOffset || 0 };

  if (img && img.complete) {
    const boxX = Math.round(player.x);
    const boxY = Math.round(player.y);
    const anchorX = player.action === "kamehameha" ? Math.round(actionConfig.anchorX) : boxX;
    const anchorY = player.action === "kamehameha" ? Math.round(actionConfig.anchorY) : boxY;
    const boxWidth = Math.round(actionConfig.width);
    const boxHeight = Math.round(actionConfig.height);
    let drawWidth;
    let drawHeight;

    if (actionConfig.sourceAnchorWidth && actionConfig.sourceAnchorHeight) {
      const scale = Math.min(
        boxWidth / actionConfig.sourceAnchorWidth,
        boxHeight / actionConfig.sourceAnchorHeight
      );
      drawWidth = Math.round(img.naturalWidth * scale);
      drawHeight = Math.round(img.naturalHeight * scale);
    } else {
      const aspectRatio = img.naturalWidth / img.naturalHeight || 1;
      drawWidth = boxWidth;
      drawHeight = Math.round(drawWidth / aspectRatio);

      if (drawHeight > boxHeight) {
        drawHeight = boxHeight;
        drawWidth = Math.round(drawHeight * aspectRatio);
      }
    }

    const drawX = anchorX + Math.round((boxWidth - drawWidth) / 2) + frameOffset.x;
    const drawY = anchorY + (boxHeight - drawHeight) + frameOffset.y;
    const finalDrawX = drawX;
    const finalDrawY = drawY;
    const finalDrawWidth = drawWidth;
    const finalDrawHeight = drawHeight;

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(
      finalDrawX + Math.round(finalDrawWidth / 2),
      groundY - 3,
      Math.round(finalDrawWidth * 0.32),
      12,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.save();
    if (player.direction === -1 && player.action !== "back") {
      const centerX = finalDrawX + finalDrawWidth / 2;
      ctx.translate(centerX, 0);
      ctx.scale(-1, 1);
      ctx.translate(-centerX, 0);
    }

    ctx.drawImage(
      img,
      finalDrawX,
      finalDrawY,
      finalDrawWidth,
      finalDrawHeight
    );
    ctx.restore();
  }

  if (frames.length > 1) {
    player.frameTimer++;
    if (player.frameTimer >= player.frameDelay) {
      player.frameTimer = 0;
      if (player.action === "kamehameha") {
        player.frameIndex = Math.min(player.frameIndex + 1, frames.length - 1);
      } else {
        player.frameIndex = (player.frameIndex + 1) % frames.length;
      }
    }
  } else {
    player.frameIndex = 0;
    player.frameTimer = 0;
  }
}

function gameLoop() {
  if (!gameStarted) return;

  updateCameraShake();
  ctx.save();
  ctx.translate(Math.round(cameraShake.x), Math.round(cameraShake.y));

  drawBackground();
  updatePlayer();
  updateDust();
  updateBurstEffects();
  updateSoftDustEffects();
  updateEffectKame();
  drawBurstEffects();
  drawDust();
  drawSoftDustEffects();
  drawPlayer();
  drawEffectKame();
  updateAuraEffect();
  drawAuraEffect();
  ctx.restore();

  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", () => {
  if (deviceModal) {
    deviceModal.classList.remove("hidden");
    return;
  }
  startGameWithMode(isTouchDevice() ? "mobile" : "pc");
});

if (mobileModeBtn) {
  mobileModeBtn.addEventListener("click", () => {
    startGameWithMode("mobile");
  });
}

if (pcModeBtn) {
  pcModeBtn.addEventListener("click", () => {
    startGameWithMode("pc");
  });
}

if (guideBtn && guideModal) {
  guideBtn.addEventListener("click", () => {
    guideModal.classList.remove("hidden");
  });
}

if (closeGuideBtn && guideModal) {
  closeGuideBtn.addEventListener("click", () => {
    guideModal.classList.add("hidden");
  });
}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "a") {
    pressControl("a");
  }
  if (key === "h") {
    return;
  }
  if (key === "s") {
    pressControl("s");
  }
  if (key === "w") {
    if (e.repeat) return;
    pressControl("w");
  }

  if (key === "d") {
    if (e.repeat) return;
    pressControl("d");
  }

  if (key === "enter") {
    if (e.repeat) return;
    pressControl("enter");
  }
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key === "a") releaseControl("a");
  if (key === "enter") releaseControl("enter");
  if (key === "h") keys.h = false;
  if (key === "s") releaseControl("s");
  if (key === "w") releaseControl("w");
  if (key === "d") {
    releaseControl("d");
  }
});

for (const button of touchButtons) {
  const control = button.dataset.touchControl;
  if (!control) continue;

  const startPress = (event) => {
    event.preventDefault();
    button.classList.add("is-active");
    pressControl(control);
  };

  const endPress = (event) => {
    event.preventDefault();
    button.classList.remove("is-active");
    releaseControl(control);
  };

  button.addEventListener("pointerdown", startPress);
  button.addEventListener("pointerup", endPress);
  button.addEventListener("pointercancel", endPress);
  button.addEventListener("lostpointercapture", endPress);
  button.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") {
      endPress(event);
    }
  });
}

gameCanvas.addEventListener("mousedown", (event) => {
  if (!event.shiftKey || player.action !== "kamehameha") return;
  effectKameEditor.dragging = true;
  updateEffectKameOffsetFromPointer(event);
});

gameCanvas.addEventListener("mousemove", (event) => {
  if (!effectKameEditor.dragging) return;
  updateEffectKameOffsetFromPointer(event);
});

window.addEventListener("mouseup", () => {
  if (!effectKameEditor.dragging) return;
  effectKameEditor.dragging = false;
  saveEffectKameOffset();
});
