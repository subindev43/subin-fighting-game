const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const guideModal = document.getElementById("guideModal");
const pauseModal = document.getElementById("pauseModal");

const startBtn = document.getElementById("startBtn");
const guideBtn = document.getElementById("guideBtn");
const toggleTrainingBotBtn = document.getElementById("toggleTrainingBotBtn");
const toggleBotSpamBtn = document.getElementById("toggleBotSpamBtn");
const closeGuideBtn = document.getElementById("closeGuideBtn");
const pauseMenuBtn = document.getElementById("pauseMenuBtn");
const pauseResetBtn = document.getElementById("pauseResetBtn");
const deviceModal = document.getElementById("deviceModal");
const mobileModeBtn = document.getElementById("mobileModeBtn");
const pcModeBtn = document.getElementById("pcModeBtn");
const menuCharacterImage = document.getElementById("menuCharacterImage");
const statusCharacterName = document.getElementById("statusCharacterName");
const hpText = document.getElementById("hpText");
const healthHudFill = document.getElementById("healthHudFill");
const healthDamageBar = document.getElementById("healthDamageBar");
const powerText = document.getElementById("powerText");
const powerBarUi = document.getElementById("powerBarUi");
const powerHudFill = document.getElementById("powerHudFill");
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

function isImageReady(img) {
  return Boolean(img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0);
}

const ASSET_ROOT = "assets";
const SHARED_EFFECT_ROOT = `${ASSET_ROOT}/EFFECT GAME`;
const STAGE_ROOT = `${ASSET_ROOT}/STAGES/stages1`;
const CHARACTER_LIBRARY = {
  gokuSsj: {
    id: "gokuSsj",
    name: "Goku Saiyan",
    root: `${ASSET_ROOT}/GOKU SSJ`,
    portrait: `${SHARED_EFFECT_ROOT}/ui/goku.png`
  }
};
const currentCharacter = CHARACTER_LIBRARY.gokuSsj;

function charAsset(path) {
  return `${currentCharacter.root}/${path}`;
}

function effectAsset(path) {
  return `${SHARED_EFFECT_ROOT}/${path}`;
}

function stageAsset(path) {
  return `${STAGE_ROOT}/${path}`;
}

if (menuCharacterImage) {
  menuCharacterImage.src = currentCharacter.portrait;
  menuCharacterImage.alt = currentCharacter.name;
}

if (statusCharacterName) {
  statusCharacterName.textContent = currentCharacter.name;
}

const idleFrames = loadFrames(charAsset("player/idle/1_0-"), 4);
const backFrames = loadFrames(charAsset("back/1_22-"), 4);
const crouchPrepFrames = loadFramePaths([
  charAsset("crouch/110.png")
]);
const crouchHoldFrames = loadFramePaths([
  charAsset("crouch/111.png")
]);
const powerPrepFrames = loadFramePaths([
  charAsset("power/1_200-20.png"),
  charAsset("power/1_200-21.png")
]);
const powerFrames = loadFramePaths([
  charAsset("power/1_200-22.png"),
  charAsset("power/1_200-23.png")
]);
const powerReleaseFrames = loadFramePaths([
  charAsset("power/1_200-24.png")
]);
const attackFrames = loadFramePaths([
  charAsset("attack/1.png"),
  charAsset("attack/2.png"),
  charAsset("attack/3.png"),
  charAsset("attack/4.png"),
  charAsset("attack/5.png"),
  charAsset("attack/6.png"),
  charAsset("attack/7.png"),
  charAsset("attack/8.png"),
  charAsset("attack/9.png"),
  charAsset("attack/10.png"),
  charAsset("attack/11.png"),
  charAsset("attack/12.png"),
  charAsset("attack/13.png"),
  charAsset("attack/14.png")
]);
const attackFrameDelays = [11, 11, 7, 7, 10, 7, 7, 7, 10, 10, 9, 7, 7, 9];
const walkKickFrames = loadFramePaths([
  charAsset("dichuyenda/1_200-253.png"),
  charAsset("dichuyenda/1_200-254.png"),
  charAsset("dichuyenda/1_200-255.png"),
  charAsset("dichuyenda/1_200-256.png")
]);
const walkKickFrameDelays = [8, 9, 9, 10];
const runAttackFrames = loadFramePaths([
  charAsset("runattack/1_200-60.png"),
  charAsset("runattack/1_200-61.png"),
  charAsset("runattack/1_200-59.png")
]);
const runAttackFrameDelays = [5, 8, 10];
const backAttackFrames = loadFramePaths([
  charAsset("luiattack/1_200-63.png"),
  charAsset("luiattack/1_200-64.png"),
  charAsset("luiattack/1_200-65.png"),
  charAsset("luiattack/1_200-66.png"),
  charAsset("luiattack/1_200-67.png")
]);
const backAttackFrameDelays = [9, 9, 10, 10, 8];
const attackJumpFrames = loadFramePaths([
  charAsset("attackjump/1.png"),
  charAsset("attackjump/2.png"),
  charAsset("attackjump/3.png"),
  charAsset("attackjump/5.png")
]);
const attackJumpFrameDelays = [13, 12, 10, 10];
const attackJumpFrameOffsets = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: -2, y: 1 },
  { x: 1, y: 0 }
];
const damageFrames = buildSequence(charAsset("damage/1_6000-"), 0, 4);
const damageFrameDelays = [7, 7, 8, 8, 10];
const outFrames = loadFramePaths([
  charAsset("out/1.png"),
  charAsset("out/2.png"),
  charAsset("out/3.png")
]);
const outFrameDelays = [8, 9, 999];
const outFrameOffsets = [
  { x: -6, y: 10 },
  { x: -4, y: 14 },
  { x: -4, y: 18 }
];
const kamePrepFrames = loadFramePaths([
  charAsset("kamehameha/1_200-257.png"),
  charAsset("kamehameha/1_200-258.png"),
  charAsset("kamehameha/1_200-259.png")
]);
const kameLoopFrames = loadFramePaths([
  charAsset("kamehameha/1_200-260.png"),
  charAsset("kamehameha/1_200-261.png")
]);
const kameChargeFrames = loadFramePaths([
  charAsset("kamehameha/1_200-262.png"),
  charAsset("kamehameha/1_200-263.png")
]);
const kameFireFrames = loadFramePaths([
  charAsset("kamehameha/1_200-264.png"),
  charAsset("kamehameha/1_200-265.png"),
  charAsset("kamehameha/1_200-266.png"),
  charAsset("kamehameha/1_200-267.png")
]);
const kameEndFrames = loadFramePaths([
  charAsset("kamehameha/1_200-268.png"),
  charAsset("kamehameha/1_200-269.png")
]);
const effectKameChargeFrames = buildSequence(effectAsset("effectkame/1_1420-"), 0, 12);
const effectKameLoopFrames = buildSequence(effectAsset("effectkame/1_1420-"), 13, 25);
const powerBarFrame = loadFramePaths([
  effectAsset("thanhpower/1_31190-20.png")
])[0];
const powerBarLevels = buildSequence(effectAsset("thanhpower/1_31201-"), 1, 84);
const powerLightningFrames = buildSequence(effectAsset("effectpower/1_30340-"), 0, 7);
const jumpPrepFrames = loadFramePaths([
  charAsset("jump/110.png"),
  charAsset("jump/111.png")
]);
const jumpFrames = loadFramePaths([
  charAsset("jump/1_40-0.png"),
  charAsset("jump/1_40-2.png")
]);
const airMoveFrames = loadFramePaths([
  charAsset("jumpdichuyen/1_21-0.png"),
  charAsset("jumpdichuyen/1_21-1.png"),
  charAsset("jumpdichuyen/1_21-2.png"),
  charAsset("jumpdichuyen/1_21-3.png")
]);
const airBackFrames = loadFramePaths([
  charAsset("jumpdichuyen/1_22-0.png"),
  charAsset("jumpdichuyen/1_22-1.png"),
  charAsset("jumpdichuyen/1_22-2.png"),
  charAsset("jumpdichuyen/1_22-3.png")
]);
const hoverFrames = loadFramePaths([
  charAsset("jump/1_40-2.png")
]);
const stageImage = new Image();
stageImage.src = stageAsset("1_0-14.png");
const stageBackImage = new Image();
stageBackImage.src = stageAsset("1_10-0.png");
const stageMidBackImage = new Image();
stageMidBackImage.src = stageAsset("1_11-24.png");
const stageFarImage = new Image();
stageFarImage.src = stageAsset("1_0-85.png");
const stageFogImage = new Image();
stageFogImage.src = stageAsset("1_0-50.png");
const stageFogFarImage = new Image();
stageFogFarImage.src = stageAsset("1_1-8.png");
const auraFrames = buildSequence(effectAsset("effectaura1/1_1500-"), 0, 3);
const aura2StartFrames = loadFramePaths([
  effectAsset("effectaura2/1_7002-0.png"),
  effectAsset("effectaura2/1_7002-1.png"),
  effectAsset("effectaura2/1_7002-2.png")
]);
const aura2LoopFrames = loadFramePaths([
  effectAsset("effectaura2/1_7002-4.png"),
  effectAsset("effectaura2/1_7002-5.png"),
  effectAsset("effectaura2/1_7002-6.png")
]);
const aura2EndFrames = loadFramePaths([
  effectAsset("effectaura2/1_7002-7.png"),
  effectAsset("effectaura2/1_7002-8.png")
]);
const aura3Frames = buildSequence(effectAsset("effectaura3/1_30202-"), 0, 7);
const aura4Frames = buildSequence(effectAsset("effectaura4/1_7003-"), 0, 15);
const effectDustFrames = buildSequence(effectAsset("effectbui/1_42-"), 12, 31);
const effectDust2Frames = loadFramePaths([
  effectAsset("effectbui2/1_7001-7.png"),
  effectAsset("effectbui2/1_7001-8.png"),
  effectAsset("effectbui2/1_7001-9.png"),
  effectAsset("effectbui2/1_7001-10.png"),
  effectAsset("effectbui2/1_7001-11.png"),
  effectAsset("effectbui2/1_7001-12.png")
]);
const jumpDustFrames = buildSequence(effectAsset("jumpbui/1_1109-"), 1, 10);
const standardSpriteSourceWidth = 64;
const standardSpriteSourceHeight = 66;
const walkFrames = loadFrames(charAsset("run/1_20-"), 8);
const runFrames = loadFrames(charAsset("run/1_100-"), 8);
const groundHeight = 140;
const groundY = gameCanvas.height - groundHeight;
const jumpPrepDuration = 8;
const powerPrepDuration = 8;

const player = {
  x: 240,
  y: groundY - 172,
  vx: 0,
  vy: 0,
  walkSpeed: 2.4,
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
  hoverTimer: 0,
  hoverFloatPhase: 0,
  hoverFloatOffset: 0,
  jumpPower: 0,
  jumpPrepTimer: 0,
  crouchPrepTimer: 0,
  attackTimer: 0,
  walkKickCooldown: 0,
  hitstunTimer: 0,
  damageFlashTimer: 0,
  isDown: false,
  powerPrepTimer: 0,
  powerReleaseTimer: 0,
  kamehamehaTimer: 0,
  kamePhase: "idle",
  kameLoopCycles: 0,
  kameAnchorX: 0,
  kameAnchorY: 0,
  health: 100,
  maxHealth: 100,
  mana: 0,
  maxMana: 100,
  power: 0,
  maxPower: 100,
  attackHasHit: false
};

const trainingBot = {
  worldX: 930,
  y: groundY - 172,
  vx: 0,
  vy: 0,
  direction: -1,
  width: 170,
  height: 180,
  action: "idle",
  frameIndex: 0,
  frameTimer: 0,
  frameDelay: 14,
  health: 220,
  maxHealth: 220,
  walkSpeed: 1.4,
  runSpeed: 3.2,
  canSprint: false,
  hitstunTimer: 0,
  damageFlashTimer: 0,
  attackCooldown: 0,
  dustCooldown: 0,
  runBurstPlayed: false,
  isDown: false,
  isActive: true
};
const spamBots = [];
let trainingBotEnabled = true;
let botSpamEnabled = false;
let nextSpamBotWorldX = 1560;
let playerHitCooldown = 0;

const dustParticles = [];
const burstEffects = [];
const softDustEffects = [];
const jumpDustEffects = [];
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
const powerLightningEffect = {
  active: false,
  frameIndex: 0,
  frameTimer: 0,
  frameDelay: 4,
  alpha: 0,
  targetAlpha: 0,
  scale: 1,
  targetScale: 1,
  pulse: 0
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
  j: false,
  s: false,
  w: false,
  h: false
};
let attackInputLocked = false;

let gameStarted = false;
let selectedControlMode = null;
let lastDPressTime = 0;
let lastWPressTime = 0;
let healthDamageDelayTimer = null;
let previousHealthValue = 100;
const doubleTapDelay = 250;
const gravity = 1;
const maxHoverFrames = 360;
const airMoveSpeed = 2.2;
const hoverDriftSpeed = 1.45;
const cameraLeftBoundary = 240;
const cameraRightBoundary = 860;
let isPauseMenuOpen = false;
let stageScrollX = 0;

const initialPlayerState = {
  x: 240,
  y: groundY - 172,
  vx: 0,
  vy: 0,
  direction: 1,
  walkSpeed: 2.4,
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
  hoverTimer: 0,
  hoverFloatPhase: 0,
  hoverFloatOffset: 0,
  jumpPower: 0,
  jumpPrepTimer: 0,
  crouchPrepTimer: 0,
  attackTimer: 0,
  walkKickCooldown: 0,
  hitstunTimer: 0,
  damageFlashTimer: 0,
  isDown: false,
  powerPrepTimer: 0,
  powerReleaseTimer: 0,
  kamehamehaTimer: 0,
  kamePhase: "idle",
  kameLoopCycles: 0,
  kameAnchorX: 0,
  kameAnchorY: 0,
  health: 100,
  mana: 0,
  power: 0,
  attackHasHit: false
};

function createBot(worldX, maxHealth = 120) {
  const isRunner = Math.random() < 0.12;
  return {
    worldX,
    y: groundY - 172,
    vx: 0,
    vy: 0,
    direction: -1,
    width: 170,
    height: 180,
    action: "idle",
    frameIndex: 0,
    frameTimer: 0,
    frameDelay: 14,
    health: maxHealth,
    maxHealth,
    walkSpeed: isRunner ? 1.7 : 1.18,
    runSpeed: isRunner ? 4.4 : 2.9,
    canSprint: isRunner,
    hitstunTimer: 0,
    damageFlashTimer: 0,
    attackCooldown: 0,
    dustCooldown: 0,
    runBurstPlayed: false,
    isDown: false,
    isActive: true
  };
}

function getPlayerWorldX() {
  return stageScrollX + player.x;
}

function getBotScreenX(bot) {
  return bot.worldX - stageScrollX;
}

function updateBotMenuButtons() {
  if (toggleTrainingBotBtn) {
    toggleTrainingBotBtn.textContent = `Bot Test: ${trainingBotEnabled ? "ON" : "OFF"}`;
    toggleTrainingBotBtn.classList.toggle("is-off", !trainingBotEnabled);
  }

  if (toggleBotSpamBtn) {
    toggleBotSpamBtn.textContent = `Bot Spam: ${botSpamEnabled ? "ON" : "OFF"}`;
    toggleBotSpamBtn.classList.toggle("is-off", !botSpamEnabled);
  }
}

function resetControls() {
  keys.a = false;
  keys.d = false;
  keys.enter = false;
  keys.j = false;
  keys.s = false;
  keys.w = false;
  keys.h = false;
  attackInputLocked = false;
}

function resetGameState() {
  Object.assign(player, initialPlayerState);
  stageScrollX = 0;
  Object.assign(trainingBot, {
    worldX: 930,
    y: groundY - 172,
    vx: 0,
    vy: 0,
    direction: -1,
    action: "idle",
    frameIndex: 0,
    frameTimer: 0,
    frameDelay: 14,
    health: trainingBot.maxHealth,
    walkSpeed: 1.4,
    runSpeed: 3.2,
    canSprint: false,
    hitstunTimer: 0,
    damageFlashTimer: 0,
    attackCooldown: 0,
    dustCooldown: 0,
    runBurstPlayed: false,
    isDown: false,
    isActive: trainingBotEnabled
  });
  spamBots.length = 0;
  nextSpamBotWorldX = 1560;
  playerHitCooldown = 0;
  if (healthDamageDelayTimer) {
    clearTimeout(healthDamageDelayTimer);
    healthDamageDelayTimer = null;
  }
  previousHealthValue = player.health;
  dustParticles.length = 0;
  burstEffects.length = 0;
  softDustEffects.length = 0;
  jumpDustEffects.length = 0;
  auraEffect.frameIndex = 0;
  auraEffect.frameTimer = 0;
  auraEffect.alpha = 0;
  auraEffect.targetAlpha = 0;
  auraEffect.scale = 0.82;
  auraEffect.targetScale = 0.82;
  aura2Effect.frameIndex = 0;
  aura2Effect.frameTimer = 0;
  aura2Effect.alpha = 0;
  aura2Effect.targetAlpha = 0;
  aura2Effect.scale = 0.9;
  aura2Effect.targetScale = 0.9;
  aura2Effect.phase = "idle";
  aura2Effect.previousPhase = "idle";
  aura3Effect.frameIndex = 0;
  aura3Effect.frameTimer = 0;
  aura3Effect.alpha = 0;
  aura3Effect.targetAlpha = 0;
  aura3Effect.scale = 1;
  aura3Effect.targetScale = 1;
  aura4Effect.active = false;
  aura4Effect.frameIndex = 0;
  aura4Effect.frameTimer = 0;
  aura4Effect.alpha = 0;
  aura4Effect.scale = 1;
  aura4Effect.driftX = 0;
  aura4Effect.driftY = 0;
  powerLightningEffect.active = false;
  powerLightningEffect.frameIndex = 0;
  powerLightningEffect.frameTimer = 0;
  powerLightningEffect.alpha = 0;
  powerLightningEffect.targetAlpha = 0;
  powerLightningEffect.scale = 1;
  powerLightningEffect.targetScale = 1;
  powerLightningEffect.pulse = 0;
  effectKame.active = false;
  effectKame.frameIndex = 0;
  effectKame.frameTimer = 0;
  effectKame.phase = "idle";
  effectKame.alpha = 0;
  effectKame.anchorX = 0;
  effectKame.anchorY = 0;
  cameraShake.x = 0;
  cameraShake.y = 0;
  cameraShake.strength = 0;
  cameraShake.targetStrength = 0;
  lastDPressTime = 0;
  lastWPressTime = 0;
  resetControls();
  updateStatusHud();
}

function closePauseMenu() {
  isPauseMenuOpen = false;
  if (pauseModal) {
    pauseModal.classList.add("hidden");
  }
}

function openPauseMenu() {
  if (!gameStarted) return;
  isPauseMenuOpen = true;
  resetControls();
  if (pauseModal) {
    pauseModal.classList.remove("hidden");
  }
}

function returnToMenu() {
  gameStarted = false;
  closePauseMenu();
  resetGameState();
  gameScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  if (guideModal) {
    guideModal.classList.add("hidden");
  }
  if (deviceModal) {
    deviceModal.classList.add("hidden");
  }
}

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
  closePauseMenu();
  resetGameState();
  gameStarted = true;
  menuScreen.classList.add("hidden");
  if (deviceModal) {
    deviceModal.classList.add("hidden");
  }
  gameScreen.classList.remove("hidden");
  gameLoop();
}

function triggerJump() {
  if (player.action === "damage" || player.action === "out") return;
  const now = Date.now();
  const isDoubleTapW = now - lastWPressTime <= doubleTapDelay;
  lastWPressTime = now;
  keys.w = true;

  if (!player.isJumping && player.jumpPrepTimer === 0) {
    player.jumpPower = isDoubleTapW ? -15.4 : -11.8;
    player.jumpPrepTimer = jumpPrepDuration;
    player.canDoubleJump = !isDoubleTapW;
    player.canHover = true;
    player.wantsHover = false;
    player.isHovering = false;
    spawnJumpDustEffect(player.x + 82, groundY + 6, player.direction, 0.92, 0.84);
    player.action = "jumpPrep";
    player.frameIndex = 0;
    player.frameTimer = 0;
  } else if (player.canDoubleJump) {
    player.vy = -14.2;
    player.canDoubleJump = false;
    player.canHover = true;
    player.isHovering = false;
    player.wantsHover = false;
    player.action = "jump";
    player.frameIndex = 0;
    player.frameTimer = 0;
  }
}

function canStartAttack() {
  return player.jumpPrepTimer === 0 &&
    player.crouchPrepTimer === 0 &&
    player.powerPrepTimer === 0 &&
    player.powerReleaseTimer === 0 &&
    player.kamehamehaTimer === 0 &&
    player.action !== "damage" &&
    player.action !== "out" &&
    (player.isJumping ? attackJumpFrames.length > 0 : attackFrames.length > 0) &&
    player.action !== "attack" &&
    player.action !== "backAttack" &&
    player.action !== "runAttack" &&
    player.action !== "attackJump" &&
    player.action !== "walkKick";
}

function startAttack() {
  if (attackInputLocked || !canStartAttack()) return;
  const isAirAttack = player.isJumping && attackJumpFrames.length > 0;
  const isBackAttack = !player.isJumping && player.action === "back" && backAttackFrames.length > 0;
  const isRunAttack = !player.isJumping && player.action === "run" && runAttackFrames.length > 0;
  const isWalkKick = !player.isJumping && player.action === "walk" && walkKickFrames.length > 0;
  if (isWalkKick && player.walkKickCooldown > 0) return;
  keys.j = true;
  attackInputLocked = true;
  player.attackHasHit = false;
  player.attackTimer = isAirAttack
    ? attackJumpFrames.length
    : isBackAttack
      ? backAttackFrames.length
    : isRunAttack
      ? runAttackFrames.length
    : isWalkKick
      ? walkKickFrames.length
      : attackFrames.length;
  player.vx = isAirAttack
    ? player.vx * 0.6
    : isBackAttack
      ? -player.walkSpeed * 0.45
    : isRunAttack
      ? player.runSpeed * 0.78
    : isWalkKick
      ? player.walkSpeed * 0.55
      : 0;
  player.action = isAirAttack ? "attackJump" : isBackAttack ? "backAttack" : isRunAttack ? "runAttack" : isWalkKick ? "walkKick" : "attack";
  player.frameIndex = 0;
  player.frameTimer = 0;
}

function finishAttack() {
  const completedAction = player.action;
  player.attackTimer = 0;
  player.attackHasHit = false;
  keys.j = false;
  if (completedAction === "walkKick") {
    player.walkKickCooldown = 10;
  }
  player.action = player.isJumping ? "jump" : Math.abs(player.vx) > 0.5 ? "walk" : "idle";
  player.frameIndex = 0;
  player.frameTimer = 0;
}

function pressControl(control) {
  if ((player.action === "damage" || player.action === "out") && control !== "j") {
    return;
  }

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

  if (control === "j") {
    startAttack();
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

  if (control === "j") {
    keys.j = false;
    attackInputLocked = false;
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

function spawnJumpDustEffect(x, y, direction = 1, scale = 1, alpha = 0.88) {
  jumpDustEffects.push({
    x,
    y,
    direction,
    scale,
    alpha,
    frameIndex: 0,
    frameTimer: 0,
    frameDelay: 3
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

function updateJumpDustEffects() {
  for (let i = jumpDustEffects.length - 1; i >= 0; i--) {
    const effect = jumpDustEffects[i];
    effect.frameTimer++;
    effect.alpha *= 0.95;
    effect.scale += 0.004;

    if (effect.frameTimer >= effect.frameDelay) {
      effect.frameTimer = 0;
      effect.frameIndex++;
    }

    if (effect.frameIndex >= jumpDustFrames.length || effect.alpha < 0.05) {
      jumpDustEffects.splice(i, 1);
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

function drawJumpDustEffects() {
  for (const effect of jumpDustEffects) {
    const img = jumpDustFrames[effect.frameIndex];
    if (!img || !img.complete) continue;

    const drawWidth = Math.round(108 * effect.scale);
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

function updatePowerLightningEffect() {
  const isPowerSurged = player.mana >= player.maxMana && player.power >= player.maxPower;

  powerLightningEffect.targetAlpha = isPowerSurged ? 0.82 : 0;
  powerLightningEffect.targetScale = isPowerSurged ? 1.04 : 0.96;
  powerLightningEffect.alpha += (powerLightningEffect.targetAlpha - powerLightningEffect.alpha) * 0.18;
  powerLightningEffect.scale += (powerLightningEffect.targetScale - powerLightningEffect.scale) * 0.16;

  if (!isPowerSurged && powerLightningEffect.alpha < 0.03) {
    powerLightningEffect.active = false;
    powerLightningEffect.frameIndex = 0;
    powerLightningEffect.frameTimer = 0;
    powerLightningEffect.alpha = 0;
    powerLightningEffect.pulse = 0;
    return;
  }

  if (isPowerSurged && !powerLightningEffect.active) {
    powerLightningEffect.active = true;
    powerLightningEffect.frameIndex = 0;
    powerLightningEffect.frameTimer = 0;
    powerLightningEffect.pulse = 0;
  }

  if (!powerLightningEffect.active) return;

  powerLightningEffect.pulse += 0.18;
  powerLightningEffect.frameTimer++;
  if (powerLightningEffect.frameTimer >= powerLightningEffect.frameDelay) {
    powerLightningEffect.frameTimer = 0;
    powerLightningEffect.frameIndex = (powerLightningEffect.frameIndex + 1) % powerLightningFrames.length;
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
  if (player.action === "out") {
    return {
      frames: outFrames,
      frameDelays: outFrameDelays,
      frameOffsets: outFrameOffsets,
      loop: false,
      width: 142,
      height: 142,
      xOffset: 0,
      yOffset: 28,
      shadowYOffset: 8,
      shadowScaleX: 0.4,
      shadowScaleY: 9,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "damage") {
    return {
      frames: damageFrames,
      frameDelays: damageFrameDelays,
      loop: false,
      width: 172,
      height: 182,
      yOffset: 8,
      sourceAnchorWidth: 58,
      sourceAnchorHeight: 64
    };
  }

  if (player.action === "backAttack") {
    return {
      frames: backAttackFrames,
      frameDelays: backAttackFrameDelays,
      loop: false,
      width: 178,
      height: 178,
      yOffset: 10,
      sourceAnchorWidth: 58,
      sourceAnchorHeight: 64
    };
  }

  if (player.action === "runAttack") {
    return {
      frames: runAttackFrames,
      frameDelays: runAttackFrameDelays,
      loop: false,
      width: 180,
      height: 176,
      yOffset: 12,
      sourceAnchorWidth: 58,
      sourceAnchorHeight: 62
    };
  }

  if (player.action === "walkKick") {
    return {
      frames: walkKickFrames,
      frameDelays: walkKickFrameDelays,
      loop: false,
      width: 176,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: 57,
      sourceAnchorHeight: 64
    };
  }

  if (player.action === "attackJump") {
    return {
      frames: attackJumpFrames,
      frameDelays: attackJumpFrameDelays,
      frameOffsets: attackJumpFrameOffsets,
      loop: false,
      width: 176,
      height: 176,
      yOffset: 12,
      sourceAnchorWidth: 54,
      sourceAnchorHeight: 65
    };
  }

  if (player.action === "attack") {
    return {
      frames: attackFrames,
      frameDelays: attackFrameDelays,
      loop: false,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "powerRelease") {
    return {
      frames: powerReleaseFrames,
      frameDelay: 999,
      width: 176,
      height: 184,
      yOffset: 6,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "powerPrep") {
    return {
      frames: powerPrepFrames,
      frameDelay: 10,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "power") {
    return {
      frames: powerFrames,
      frameDelay: 9,
      width: 176,
      height: 184,
      yOffset: 6,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
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
    return {
      frames: crouchPrepFrames,
      frameDelay: 14,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "crouch") {
    return {
      frames: crouchHoldFrames,
      frameDelay: 999,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "hover") {
    return {
      frames: hoverFrames,
      frameDelay: 999,
      width: 170,
      height: 180,
      yOffset: 8 + Math.round(player.hoverFloatOffset),
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "airBack") {
    return {
      frames: airBackFrames,
      frameDelay: 10,
      width: 170,
      height: 180,
      yOffset: 8 + Math.round(player.isHovering ? player.hoverFloatOffset : 0),
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "airMove") {
    return {
      frames: airMoveFrames,
      frameDelay: 10,
      width: 170,
      height: 180,
      yOffset: 8 + Math.round(player.isHovering ? player.hoverFloatOffset : 0),
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "jump") {
    return {
      frames: [jumpFrames[0]],
      frameDelay: 999,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "jumpPrep") {
    return {
      frames: jumpPrepFrames,
      frameDelay: 10,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "back") {
    return {
      frames: backFrames,
      frameDelay: 12,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "run") {
    return {
      frames: runFrames,
      frameDelay: 8,
      width: 178,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (player.action === "walk") {
    return {
      frames: walkFrames,
      frameDelay: 12,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  return {
    frames: idleFrames,
    frameDelay: 14,
    width: 170,
    height: 180,
    yOffset: 8,
    sourceAnchorWidth: standardSpriteSourceWidth,
    sourceAnchorHeight: standardSpriteSourceHeight
  };
}

function getBotActionConfig(bot) {
  if (bot.action === "out") {
    return {
      frames: outFrames,
      frameDelays: outFrameDelays,
      frameOffsets: outFrameOffsets,
      loop: false,
      width: 142,
      height: 142,
      xOffset: 0,
      yOffset: 28,
      shadowYOffset: 8,
      shadowScaleX: 0.4,
      shadowScaleY: 9,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (bot.action === "damage") {
    return {
      frames: damageFrames,
      frameDelays: damageFrameDelays,
      loop: false,
      width: 172,
      height: 182,
      yOffset: 8,
      sourceAnchorWidth: 58,
      sourceAnchorHeight: 64
    };
  }

  if (bot.action === "walk") {
    return {
      frames: walkFrames,
      frameDelay: 12,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (bot.action === "run") {
    return {
      frames: runFrames,
      frameDelay: 8,
      width: 178,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  if (bot.action === "attack") {
    return {
      frames: attackFrames,
      frameDelays: attackFrameDelays,
      loop: false,
      width: 170,
      height: 180,
      yOffset: 8,
      sourceAnchorWidth: standardSpriteSourceWidth,
      sourceAnchorHeight: standardSpriteSourceHeight
    };
  }

  return {
    frames: idleFrames,
    frameDelay: 14,
    width: 170,
    height: 180,
    yOffset: 8,
    sourceAnchorWidth: standardSpriteSourceWidth,
    sourceAnchorHeight: standardSpriteSourceHeight
  };
}

function drawBackground() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  const loopLayer = (img, width, height, y, scrollFactor, alpha = 1, composite = "source-over") => {
    if (!img.complete) return;

    const loopWidth = Math.round(width);
    const normalizedOffset = ((stageScrollX * scrollFactor) % loopWidth + loopWidth) % loopWidth;
    const offset = -normalizedOffset;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = composite;

    for (let i = -1; i <= 2; i++) {
      const drawX = offset + i * loopWidth;
      ctx.drawImage(img, Math.round(drawX), Math.round(y), loopWidth, Math.round(height));
    }

    ctx.restore();
  };

  if (stageImage.complete) {
    if (stageBackImage.complete) {
      const backWidth = Math.round(gameCanvas.width * 0.96);
      const backHeight = Math.round(stageBackImage.naturalHeight * (backWidth / stageBackImage.naturalWidth));
      const backY = Math.round(groundY - backHeight - 118);
      loopLayer(stageBackImage, backWidth, backHeight, backY, 0.16, 0.38);
    }

    if (stageMidBackImage.complete) {
      const midWidth = Math.round(gameCanvas.width * 0.92);
      const midHeight = Math.round(stageMidBackImage.naturalHeight * (midWidth / stageMidBackImage.naturalWidth));
      const midY = Math.round(groundY - midHeight - 98);
      loopLayer(stageMidBackImage, midWidth, midHeight, midY, 0.24, 0.44);
    }

    if (stageFarImage.complete) {
      const farWidth = Math.round(gameCanvas.width * 0.88);
      const farHeight = Math.round(stageFarImage.naturalHeight * (farWidth / stageFarImage.naturalWidth));
      const farY = Math.round(groundY - farHeight - 82);
      loopLayer(stageFarImage, farWidth, farHeight, farY, 0.34, 0.48);
    }

    loopLayer(stageImage, gameCanvas.width, gameCanvas.height, 0, 1, 1);
    if (stageFogFarImage.complete) {
      const fogFarWidth = Math.round(gameCanvas.width * 0.94);
      const fogFarHeight = Math.round(stageFogFarImage.naturalHeight * (fogFarWidth / stageFogFarImage.naturalWidth));
      const fogFarY = groundY - 128;
      loopLayer(stageFogFarImage, fogFarWidth, fogFarHeight, fogFarY, 0.6, 0.34, "screen");
    }

    if (stageFogImage.complete) {
      const fogBaseWidth = Math.round(gameCanvas.width);
      const fogBaseHeight = Math.round(stageFogImage.naturalHeight * (fogBaseWidth / stageFogImage.naturalWidth));
      const fogY = groundY - 64;
      loopLayer(stageFogImage, fogBaseWidth, fogBaseHeight, fogY, 0.82, 0.5, "screen");
    }
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

function getAttackHitbox() {
  if (player.isJumping && player.action === "attackJump") {
    if (player.frameIndex < 2) return null;
    return { start: 18, reach: 70, height: 76, yOffset: 44, damage: 16, knockback: 10, launchY: -8.4, hitstun: 22 };
  }

  if (player.action === "runAttack") {
    if (player.frameIndex > 1) return null;
    return { start: 26, reach: 76, height: 80, yOffset: 42, damage: 18, knockback: 12, launchY: -7.4, hitstun: 20 };
  }

  if (player.action === "backAttack") {
    if (player.frameIndex < 2 || player.frameIndex > 3) return null;
    return { start: 12, reach: 62, height: 76, yOffset: 42, damage: 14, knockback: 8, launchY: -6.2, hitstun: 18 };
  }

  if (player.action === "walkKick") {
    if (player.frameIndex < 1 || player.frameIndex > 2) return null;
    return { start: 18, reach: 72, height: 74, yOffset: 42, damage: 14, knockback: 9, launchY: -6.8, hitstun: 18 };
  }

  if (player.action === "attack") {
    const hitFrames = new Set([2, 3, 5, 6, 7, 11, 12]);
    if (!hitFrames.has(player.frameIndex)) return null;
    return { start: 14, reach: 58, height: 72, yOffset: 42, damage: 10, knockback: 7, launchY: -4.8, hitstun: 14 };
  }

  return null;
}

function applyDamageToBot(bot, hitbox) {
  bot.health = Math.max(0, bot.health - hitbox.damage);
  bot.frameIndex = 0;
  bot.frameTimer = 0;
  bot.damageFlashTimer = 8;
  if (bot.health <= 0) {
    bot.action = "out";
    bot.hitstunTimer = 0;
    bot.isDown = false;
    bot.vx = hitbox.knockback * player.direction * 0.62;
    bot.vy = Math.min(hitbox.launchY * 1.12, -7.2);
  } else {
    bot.action = "damage";
    bot.hitstunTimer = hitbox.hitstun || 18;
    bot.vx = hitbox.knockback * player.direction;
    bot.vy = hitbox.launchY || -5.2;
  }
  cameraShake.targetStrength = Math.max(cameraShake.targetStrength, 4.5);
}

function updateSingleBot(bot) {
  if (!bot.isActive) return;
  const botGroundY = groundY - 172;
  const playerWorldX = getPlayerWorldX();
  const botScreenX = getBotScreenX(bot);
  const wasAirborne = bot.y < botGroundY || bot.vy !== 0;

  bot.direction = bot.worldX > playerWorldX ? -1 : 1;
  const botFrontFootX = botScreenX + (bot.direction === 1 ? 78 : 54);
  const botRearFootX = botScreenX + (bot.direction === 1 ? 58 : 76);

  if (bot.hitstunTimer > 0) {
    bot.hitstunTimer--;
  }

  if (bot.damageFlashTimer > 0) {
    bot.damageFlashTimer--;
  }

  if (bot.attackCooldown > 0) {
    bot.attackCooldown--;
  }

  if (bot.dustCooldown > 0) {
    bot.dustCooldown--;
  }

  if (bot.action === "out") {
    if (bot.frameIndex === 0) {
      bot.vx *= 0.9;
    } else if (bot.frameIndex === 1) {
      bot.vx *= 0.72;
    } else if (bot.y >= botGroundY - 1) {
      bot.vx = 0;
      bot.isDown = true;
    }
  } else if (bot.action === "damage") {
    bot.vx *= bot.y < botGroundY - 1 ? 0.96 : 0.82;

    if (bot.y >= botGroundY - 1 && bot.frameIndex >= damageFrames.length - 1 && bot.frameTimer === 0) {
      bot.action = "idle";
      bot.frameIndex = 0;
      bot.frameTimer = 0;
    }
  } else if (!bot.isDown) {
    const distanceToPlayer = playerWorldX - bot.worldX;
    const absDistance = Math.abs(distanceToPlayer);

    if (absDistance > 86) {
      const wantsSprint = bot.canSprint && absDistance > 240;
      bot.action = wantsSprint ? "run" : "walk";
      bot.vx += ((distanceToPlayer > 0 ? (wantsSprint ? bot.runSpeed : bot.walkSpeed) : -(wantsSprint ? bot.runSpeed : bot.walkSpeed)) - bot.vx) * (wantsSprint ? 0.22 : 0.18);
    } else {
      bot.vx *= 0.72;
      if (bot.attackCooldown === 0) {
        bot.action = "attack";
      }

      if (bot.action === "attack" && bot.frameIndex >= 6 && bot.frameIndex <= 7 && bot.attackCooldown === 0) {
        if (playerHitCooldown === 0 && Math.abs(botScreenX - player.x) < 96 && Math.abs(bot.y - player.y) < 84) {
          takeDamage(8, {
            knockback: bot.direction === -1 ? 2.6 : -2.6,
            launchY: -1.2,
            hitstun: 16
          });
          playerHitCooldown = 24;
          cameraShake.targetStrength = Math.max(cameraShake.targetStrength, 2.8);
        }
        bot.attackCooldown = 42;
      }

      if (bot.action === "attack" && bot.frameIndex >= attackFrames.length - 1 && bot.frameTimer === 0) {
        bot.action = "idle";
        bot.frameIndex = 0;
        bot.frameTimer = 0;
      }
    }
  } else {
    bot.vx *= 0.78;
  }

  if (bot.y < botGroundY || bot.vy !== 0) {
    bot.vy += gravity * 0.42;
    bot.y += bot.vy;

    if (bot.y >= botGroundY) {
      bot.y = botGroundY;
      if (bot.vy > 5) {
        cameraShake.targetStrength = Math.max(cameraShake.targetStrength, 3.2);
        if (botScreenX > -120 && botScreenX < gameCanvas.width + 120) {
          spawnDust(botScreenX + 72, groundY - 8, 6, bot.direction === 1 ? -0.55 : 0.55, "rgba(205, 220, 205, 0.62)");
          spawnSoftDustEffect(botScreenX + 84, groundY + 6, bot.direction, 0.96, 0.68);
          spawnJumpDustEffect(botScreenX + 84, groundY + 8, bot.direction, 0.94, 0.82);
        }
      }
      bot.vy = 0;
    }
  }

  bot.worldX += bot.vx;

  const botScreenXAfterMove = getBotScreenX(bot);
  if (!wasAirborne && bot.y >= botGroundY - 1 && bot.dustCooldown === 0) {
    if (bot.action === "run" && Math.abs(bot.vx) > 2.6 && botScreenXAfterMove > -120 && botScreenXAfterMove < gameCanvas.width + 120) {
      if (!bot.runBurstPlayed) {
        spawnDustEffect(botRearFootX - (bot.direction === 1 ? 28 : -28), groundY + 10, bot.direction);
        spawnDust(botRearFootX, groundY - 8, 4, bot.direction === 1 ? -0.45 : 0.45, "rgba(220, 235, 220, 0.68)");
        bot.runBurstPlayed = true;
      }
      spawnDust(botRearFootX, groundY - 6, 3, bot.direction === 1 ? -0.55 : 0.55, "rgba(215, 230, 215, 0.66)");
      spawnSoftDustEffect(botFrontFootX, groundY + 4, bot.direction === 1 ? -1 : 1, 0.92, 0.52);
      bot.dustCooldown = 6;
    } else if (bot.action === "walk" && Math.abs(bot.vx) > 0.9 && botScreenXAfterMove > -120 && botScreenXAfterMove < gameCanvas.width + 120) {
      bot.runBurstPlayed = false;
      spawnDust(botRearFootX, groundY - 6, 2, bot.direction === 1 ? -0.28 : 0.28);
      spawnSoftDustEffect(botFrontFootX, groundY + 2, bot.direction === 1 ? -1 : 1, 0.8, 0.46);
      bot.dustCooldown = 14;
    } else if (bot.action !== "run") {
      bot.runBurstPlayed = false;
    }
  }

  if (!bot.isDown && !player.attackHasHit && botScreenX > -180 && botScreenX < gameCanvas.width + 180) {
    const hitbox = getAttackHitbox();

    if (hitbox) {
      const hitboxStart = hitbox.start || 0;
      const attackFrontX = player.direction === 1
        ? player.x + player.width * 0.5 + hitboxStart + hitbox.reach
        : player.x + player.width * 0.5 - hitboxStart;
      const attackBackX = player.direction === 1
        ? player.x + player.width * 0.5 + hitboxStart
        : player.x + player.width * 0.5 - hitboxStart - hitbox.reach;
      const targetFrontX = botScreenX + bot.width * 0.72;
      const targetBackX = botScreenX + bot.width * 0.28;
      const overlapsX = attackFrontX >= targetBackX && attackBackX <= targetFrontX;
      const attackTop = player.y + hitbox.yOffset;
      const attackBottom = attackTop + hitbox.height;
      const targetTop = bot.y + 36;
      const targetBottom = bot.y + bot.height - 18;
      const overlapsY = attackBottom >= targetTop && attackTop <= targetBottom;

      if (overlapsX && overlapsY) {
        player.attackHasHit = true;
        applyDamageToBot(bot, hitbox);
      }
    }
  }
}

function spawnSpamBotIfNeeded() {
  if (!botSpamEnabled) return;

  const playerWorldX = getPlayerWorldX();
  const activeSpamBots = spamBots.filter((bot) => bot.isActive && !bot.isDown).length;
  if (activeSpamBots >= 3) return;

  while (nextSpamBotWorldX < playerWorldX + 1800) {
    spamBots.push(createBot(nextSpamBotWorldX, 80));
    nextSpamBotWorldX += 980 + Math.round(Math.random() * 760);
    if (spamBots.filter((bot) => bot.isActive && !bot.isDown).length >= 3) {
      break;
    }
  }
}

function updateTrainingBot() {
  if (playerHitCooldown > 0) {
    playerHitCooldown--;
  }

  trainingBot.isActive = trainingBotEnabled;
  if (trainingBotEnabled) {
    updateSingleBot(trainingBot);
  }

  spawnSpamBotIfNeeded();

  for (const bot of spamBots) {
    updateSingleBot(bot);
  }

  for (let i = spamBots.length - 1; i >= 0; i--) {
    const bot = spamBots[i];
    const botScreenX = getBotScreenX(bot);
    if (bot.isDown && botScreenX < -260) {
      spamBots.splice(i, 1);
      continue;
    }
    if (botScreenX < -360 || botScreenX > gameCanvas.width + 360) {
      if (bot.worldX < getPlayerWorldX() - 420) {
        spamBots.splice(i, 1);
      }
    }
  }
}

function applyStageCamera() {
  let shiftX = 0;

  if (player.vx > 0 && player.x > cameraRightBoundary) {
    shiftX = cameraRightBoundary - player.x;
    player.x = cameraRightBoundary;
    stageScrollX -= shiftX;
  } else if (player.vx < 0 && player.x < cameraLeftBoundary) {
    shiftX = cameraLeftBoundary - player.x;
    player.x = cameraLeftBoundary;
    stageScrollX -= shiftX;
  }

  if (shiftX !== 0) {
    return;
  }
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

  if (player.hitstunTimer > 0) {
    player.hitstunTimer--;
  }

  if (player.damageFlashTimer > 0) {
    player.damageFlashTimer--;
  }

  if (player.walkKickCooldown > 0) {
    player.walkKickCooldown--;
  }

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

  if (player.action === "out") {
    if (player.frameIndex === 0) {
      player.vx *= 0.9;
    } else if (player.frameIndex === 1) {
      player.vx *= 0.72;
    } else if (player.y >= groundY - 172 - 1) {
      player.vx = 0;
      player.isDown = true;
    }
  }

  if (player.action === "damage") {
    player.vx *= player.y < groundY - 172 - 1 ? 0.96 : 0.82;

    if (player.y >= groundY - 172 - 1 && player.frameIndex >= damageFrames.length - 1 && player.frameTimer === 0) {
      player.action = "idle";
      player.frameIndex = 0;
      player.frameTimer = 0;
    }
  }

  if (player.action === "attack") {
    player.attackTimer = Math.max(0, attackFrames.length - player.frameIndex);
    player.vx *= 0.45;

    if (player.frameIndex >= 11 && player.frameIndex <= 12) {
      player.vx = 4.8;
    }
  }

  if (player.action === "backAttack") {
    player.attackTimer = Math.max(0, backAttackFrames.length - player.frameIndex);

    if (player.frameIndex <= 1) {
      player.vx = -player.walkSpeed * 0.6;
    } else if (player.frameIndex <= 3) {
      player.vx = player.direction * 2.8;
    } else {
      player.vx *= 0.5;
    }
  }

  if (player.action === "runAttack") {
    player.attackTimer = Math.max(0, runAttackFrames.length - player.frameIndex);

    if (player.frameIndex === 0) {
      player.vx = player.direction * 6.1;
    } else if (player.frameIndex === 1) {
      player.vx = player.direction * 3.2;
    } else {
      player.vx *= 0.55;
    }
  }

  if (player.action === "walkKick") {
    player.attackTimer = Math.max(0, walkKickFrames.length - player.frameIndex);
    player.vx *= 0.92;
  }

  if (player.action === "attackJump") {
    player.attackTimer = Math.max(0, attackJumpFrames.length - player.frameIndex);
    player.vx *= 0.94;
    player.vy *= 0.98;
  }

  if (player.kamehamehaTimer > 0) {
    player.vx *= 0.88;
    player.action = "kamehameha";
  } else if (player.action === "out") {
    player.isRunning = false;
  } else if (player.action === "damage") {
    player.isRunning = false;
  } else if (player.action === "attackJump") {
    player.isRunning = false;
  } else if (player.action === "backAttack") {
    player.isRunning = false;
  } else if (player.action === "runAttack") {
    player.isRunning = false;
  } else if (player.action === "walkKick") {
    player.isRunning = false;
  } else if (player.action === "attack") {
    player.isRunning = false;
  } else if (player.powerReleaseTimer > 0) {
    player.vx *= 0.9;
  } else if (player.powerPrepTimer > 0) {
    player.vx *= 0.9;
  } else if (player.crouchPrepTimer > 0) {
    player.vx *= 0.9;
  } else if (player.jumpPrepTimer > 0) {
    player.vx *= 0.9;
  } else if (player.isJumping) {
    player.wantsHover = keys.w;
    const wantsHoverDrift = player.wantsHover && (keys.a || keys.d);
    const canEnterHover = wantsHoverDrift ? player.vy >= -4 : player.vy >= -1;

    if (player.canHover && player.wantsHover && player.action !== "attackJump" && canEnterHover) {
      player.isHovering = true;
      player.hoverTimer++;
      player.vy = 0;
      player.action = "hover";

      if (player.hoverTimer >= maxHoverFrames) {
        player.isHovering = false;
        player.canHover = false;
        player.wantsHover = false;
        player.hoverTimer = 0;
        player.action = "jump";
      }
    } else {
      player.isHovering = false;
      player.hoverTimer = 0;
    }

    if (player.isHovering) {
      player.hoverFloatPhase += 0.12;
      player.hoverFloatOffset = Math.sin(player.hoverFloatPhase) * 2;
    } else {
      player.hoverFloatPhase = 0;
      player.hoverFloatOffset = 0;
    }

    if (keys.a) {
      const targetVx = player.isHovering ? -hoverDriftSpeed : -airMoveSpeed;
      player.vx += (targetVx - player.vx) * (player.isHovering ? 0.18 : 0.35);
      if (player.action !== "attackJump") {
        player.action = "airBack";
      }
    } else if (keys.d) {
      const targetVx = player.isHovering ? hoverDriftSpeed : airMoveSpeed;
      player.vx += (targetVx - player.vx) * (player.isHovering ? 0.18 : 0.35);
      if (player.action !== "attackJump") {
        player.action = "airMove";
      }
    } else {
      player.vx *= player.isHovering ? 0.92 : 0.9;
      if (!player.isHovering && player.action !== "attackJump") {
        player.action = "jump";
      }
    }
  } else if (player.action === "backAttack") {
    player.isRunning = false;
  } else if (player.action === "runAttack") {
    player.isRunning = false;
  } else if (player.action === "damage" || player.action === "out") {
    player.isRunning = false;
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
  applyStageCamera();
  player.vy += player.isHovering ? 0 : gravity;

  const groundPlayerY = groundY - 172;
  if (player.y >= groundPlayerY) {
    player.y = groundPlayerY;
    player.vy = 0;

    if (player.jumpPrepTimer === 0) {
      if (wasJumping) {
        spawnDust(player.x + 72, groundY - 8, 8, player.direction === 1 ? -0.6 : 0.6, "rgba(205, 220, 205, 0.65)");
        spawnSoftDustEffect(player.x + 84, groundY + 6, player.direction, 1.05, 0.74);
        spawnJumpDustEffect(player.x + 84, groundY + 8, player.direction, 1.02, 0.9);
      }
      player.isJumping = false;
      player.canDoubleJump = true;
      player.canHover = false;
      player.isHovering = false;
      player.wantsHover = false;
      player.hoverTimer = 0;
      player.hoverFloatPhase = 0;
      player.hoverFloatOffset = 0;
      player.jumpPower = 0;
    }
  }

  if (!keys.s && (player.action === "crouch" || player.action === "crouchPrep")) {
    player.crouchPrepTimer = 0;
    player.action = Math.abs(player.vx) > 0.5 ? "walk" : "idle";
  }

  if (
    (player.action === "attack" && player.frameIndex >= attackFrames.length - 1 && player.frameTimer === 0) ||
    (player.action === "backAttack" && player.frameIndex >= backAttackFrames.length - 1 && player.frameTimer === 0) ||
    (player.action === "runAttack" && player.frameIndex >= runAttackFrames.length - 1 && player.frameTimer === 0) ||
    (player.action === "attackJump" && player.frameIndex >= attackJumpFrames.length - 1 && player.frameTimer === 0) ||
    (player.action === "walkKick" && player.frameIndex >= walkKickFrames.length - 1 && player.frameTimer === 0)
  ) {
    finishAttack();
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

  if (
    player.isJumping &&
    player.jumpPrepTimer === 0 &&
    !player.isHovering &&
    player.action !== "damage" &&
    player.action !== "out" &&
    player.action !== "attackJump" &&
    player.action !== "airMove" &&
    player.action !== "airBack"
  ) {
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

  if (wasOnGround && !player.isJumping && player.action === "back" && Math.abs(player.vx) > 1.2 && player.frameTimer === 0) {
    spawnDust(player.x + 52, groundY - 5, 2, -0.18, "rgba(215, 228, 215, 0.52)");
    spawnSoftDustEffect(player.x + 60, groundY + 3, 1, 0.72, 0.36);
  }

  if (wasOnGround && !player.isJumping && player.action === "run" && Math.abs(player.vx) > 3 && player.frameTimer === 0) {
    spawnDust(player.x + 64, groundY - 6, 3, player.direction === 1 ? -0.55 : 0.55, "rgba(215, 230, 215, 0.7)");
    spawnSoftDustEffect(player.x + 78, groundY + 4, player.direction, 0.98, 0.56);
  }

  const actionConfig = getActionConfig();
  if (Array.isArray(actionConfig.frameDelays)) {
    const safeDelayIndex = Math.min(player.frameIndex, actionConfig.frameDelays.length - 1);
    player.frameDelay = actionConfig.frameDelays[safeDelayIndex] || actionConfig.frameDelay || 8;
  } else {
    player.frameDelay = actionConfig.frameDelay;
  }

  if (player.action !== player.previousAction) {
    player.frameIndex = 0;
    player.frameTimer = 0;
  }

  if (player.action === "out" && player.frameIndex >= outFrames.length - 1 && player.frameTimer === 0 && player.y >= groundPlayerY - 1) {
    player.vx = 0;
    player.vy = 0;
    player.isDown = true;
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

function drawActor(actor, actionConfig, options = {}) {
  const frames = actionConfig.frames;
  const safeFrameIndex = actor.frameIndex % frames.length;
  const img = frames[safeFrameIndex];
  if (Array.isArray(actionConfig.frameDelays)) {
    const safeDelayIndex = Math.min(safeFrameIndex, actionConfig.frameDelays.length - 1);
    actor.frameDelay = actionConfig.frameDelays[safeDelayIndex] || actionConfig.frameDelay || 8;
  } else {
    actor.frameDelay = actionConfig.frameDelay || actor.frameDelay || 8;
  }
  const perFrameOffset = Array.isArray(actionConfig.frameOffsets)
    ? actionConfig.frameOffsets[Math.min(safeFrameIndex, actionConfig.frameOffsets.length - 1)] || {}
    : {};
  const frameOffset = {
    x: (actionConfig.xOffset || 0) + (perFrameOffset.x || 0),
    y: (actionConfig.yOffset || 0) + (perFrameOffset.y || 0)
  };

  if (img && img.complete) {
    const boxX = Math.round(options.renderX ?? actor.x);
    const boxY = Math.round(actor.y);
    const anchorX = options.useAnchor ? Math.round(actionConfig.anchorX) : boxX;
    const anchorY = options.useAnchor ? Math.round(actionConfig.anchorY) : boxY;
    const boxWidth = Math.round(actionConfig.width);
    const boxHeight = Math.round(actionConfig.height);
    let drawWidth;
    let drawHeight;

    if (actionConfig.useNaturalSize) {
      drawWidth = img.naturalWidth;
      drawHeight = img.naturalHeight;
    } else if (actionConfig.sourceAnchorWidth && actionConfig.sourceAnchorHeight) {
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

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(
      drawX + Math.round(drawWidth / 2),
      groundY - 3 + (actionConfig.shadowYOffset || 0),
      Math.round(drawWidth * (actionConfig.shadowScaleX || 0.32)),
      actionConfig.shadowScaleY || 12,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.save();
    if (options.flash && options.flash > 0) {
      ctx.globalAlpha = 0.78 + Math.sin(options.flash) * 0.22;
      ctx.filter = "brightness(1.4)";
    }
    if (actor.direction === -1 && actor.action !== "back") {
      const centerX = drawX + drawWidth / 2;
      ctx.translate(centerX, 0);
      ctx.scale(-1, 1);
      ctx.translate(-centerX, 0);
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }

  if (frames.length > 1) {
    actor.frameTimer++;
    if (actor.frameTimer >= actor.frameDelay) {
      actor.frameTimer = 0;
      if (options.freezeAtEnd || actionConfig.loop === false) {
        actor.frameIndex = Math.min(actor.frameIndex + 1, frames.length - 1);
      } else {
        actor.frameIndex = (actor.frameIndex + 1) % frames.length;
      }
    }
  } else {
    actor.frameIndex = 0;
    actor.frameTimer = 0;
  }
}

function drawBot(bot) {
  if (!bot.isActive) return;

  const screenX = getBotScreenX(bot);
  if (screenX < -220 || screenX > gameCanvas.width + 220) return;

  drawActor(bot, getBotActionConfig(bot), {
    flash: bot.damageFlashTimer,
    renderX: screenX
  });

  const ratio = Math.max(0, bot.health / bot.maxHealth);
  const barWidth = 120;
  const barHeight = 10;
  const barX = Math.round(screenX + 20);
  const barY = Math.round(bot.y - 18);

  ctx.fillStyle = "rgba(10, 14, 24, 0.82)";
  ctx.fillRect(barX, barY, barWidth, barHeight);
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(barX, barY, Math.round(barWidth * ratio), barHeight);
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barWidth, barHeight);
}

function drawTrainingBot() {
  if (trainingBotEnabled) {
    drawBot(trainingBot);
  }

  for (const bot of spamBots) {
    drawBot(bot);
  }
}

function drawPlayer() {
  const actionConfig = getActionConfig();
  drawActor(player, actionConfig, {
    flash: player.damageFlashTimer,
    useAnchor: player.action === "kamehameha",
    freezeAtEnd: player.action === "kamehameha" || actionConfig.loop === false
  });
}

function updateMana() {
  const isChargingMana =
    player.action === "powerPrep" ||
    player.action === "power";

  if (isChargingMana) {
    player.mana = Math.min(player.maxMana, player.mana + 0.22);
    player.power = Math.min(player.maxPower, player.power + 0.16);
  }
}

function takeDamage(amount, options = {}) {
  if (player.action === "out") return;
  player.health = Math.max(0, player.health - amount);
  player.damageFlashTimer = 8;
  player.attackTimer = 0;
  player.walkKickCooldown = 0;
  player.jumpPrepTimer = 0;
  player.crouchPrepTimer = 0;
  player.powerPrepTimer = 0;
  player.powerReleaseTimer = 0;
  player.kamehamehaTimer = 0;
  player.kamePhase = "idle";
  player.kameLoopCycles = 0;
  player.attackHasHit = false;
  attackInputLocked = false;
  player.frameIndex = 0;
  player.frameTimer = 0;

  if (player.health <= 0) {
    player.action = "out";
    player.hitstunTimer = 0;
    player.isDown = false;
    player.isJumping = false;
    player.isHovering = false;
    player.wantsHover = false;
    player.vx = options.knockback ?? -3.4;
    player.vy = Math.min(options.launchY ?? -5.6, -5.6);
  } else {
    player.action = "damage";
    player.hitstunTimer = options.hitstun ?? 18;
    player.vx = options.knockback ?? -2.4;
    player.vy = options.launchY ?? -1.4;
  }
}

function heal(amount) {
  player.health = Math.min(player.maxHealth, player.health + amount);
}

function updateStatusHud() {
  const hpPercent = Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100));
  const powerPercent = Math.max(0, Math.min(100, (player.power / player.maxPower) * 100));

  if (healthHudFill) {
    healthHudFill.style.width = `${hpPercent}%`;
    healthHudFill.classList.toggle("is-low", player.health < 30);
  }

  if (healthDamageBar) {
    if (player.health >= previousHealthValue) {
      if (healthDamageDelayTimer) {
        clearTimeout(healthDamageDelayTimer);
        healthDamageDelayTimer = null;
      }
      healthDamageBar.style.width = `${hpPercent}%`;
    } else {
      if (healthDamageDelayTimer) {
        clearTimeout(healthDamageDelayTimer);
      }
      healthDamageDelayTimer = setTimeout(() => {
        healthDamageBar.style.width = `${hpPercent}%`;
        healthDamageDelayTimer = null;
      }, 300);
    }
  }

  if (powerHudFill) {
    powerHudFill.style.width = `${powerPercent}%`;
  }

  if (hpText) {
    hpText.textContent = `HP: ${Math.ceil(player.health)} / ${player.maxHealth}`;
  }

  if (powerText) {
    powerText.textContent = `Power: ${Math.ceil(player.power)} / ${player.maxPower}`;
  }

  previousHealthValue = player.health;
}

function drawBarLabel(label, value, maxValue, x, y) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.font = "14px Arial";
  ctx.fillText(`${label} ${Math.ceil(value)}/${maxValue}`, x, y);
}

function drawCappedHudBar(frame, fill, cap, options = {}) {
  if (!isImageReady(frame) || !isImageReady(fill) || !isImageReady(cap)) return;

  const {
    x,
    y,
    ratio,
    insetLeft = 1,
    insetRight = 3,
    leftSlope = 0,
    rightSlope = 8,
    fillColor = null,
    capColor = null
  } = options;

  const clampedRatio = Math.max(0, Math.min(1, ratio));
  const fillX = x + insetLeft;
  const fillY = y + Math.round((frame.naturalHeight - fill.naturalHeight) / 2);
  const maxFillWidth = Math.max(0, frame.naturalWidth - insetLeft - insetRight);
  const desiredWidth = Math.round(maxFillWidth * clampedRatio);

  ctx.save();
  ctx.drawImage(frame, x, y, frame.naturalWidth, frame.naturalHeight);

  if (desiredWidth > 0) {
    const capWidth = Math.min(cap.naturalWidth, desiredWidth);
    const bodyWidth = Math.max(0, desiredWidth - capWidth);
    const safeLeftSlope = Math.min(leftSlope, Math.max(0, desiredWidth - 1));
    const safeRightSlope = Math.min(rightSlope, Math.max(0, desiredWidth - 1));

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fillX, fillY);
    ctx.lineTo(fillX + Math.max(0, desiredWidth - safeRightSlope), fillY);
    ctx.lineTo(fillX + desiredWidth, fillY + fill.naturalHeight);
    ctx.lineTo(fillX, fillY + fill.naturalHeight);
    ctx.closePath();
    ctx.clip();

    if (bodyWidth > 0) {
      ctx.drawImage(
        fill,
        0,
        0,
        bodyWidth,
        fill.naturalHeight,
        fillX,
        fillY,
        bodyWidth,
        fill.naturalHeight
      );

      if (fillColor) {
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = fillColor;
        ctx.fillRect(fillX, fillY, bodyWidth, fill.naturalHeight);
        ctx.restore();
      }
    }

    const capX = fillX + desiredWidth - capWidth;
    ctx.drawImage(
      cap,
      cap.naturalWidth - capWidth,
      0,
      capWidth,
      cap.naturalHeight,
      capX,
      fillY,
      capWidth,
      cap.naturalHeight
    );

    if (capColor) {
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = capColor;
      ctx.fillRect(capX, fillY, capWidth, cap.naturalHeight);
      ctx.restore();
    }

    ctx.restore();
  }

  ctx.restore();
}

function drawPowerLightningEffect() {
  if (powerBarUi) {
    const isPowerFull = player.power >= player.maxPower;
    powerBarUi.classList.toggle("is-surged", isPowerFull);
  }
}

function getManaHudMetrics() {
  return null;
}

function drawManaHud() {
  drawPowerLightningEffect();
}

function drawHealthHud() {
  return;
}

function drawPowerHud() {
  return;
}

function gameLoop() {
  if (!gameStarted) return;

  if (isPauseMenuOpen) {
    requestAnimationFrame(gameLoop);
    return;
  }

  updateCameraShake();
  ctx.save();
  ctx.translate(Math.round(cameraShake.x), Math.round(cameraShake.y));

  drawBackground();
  updatePlayer();
  updateTrainingBot();
  updateDust();
  updateBurstEffects();
  updateSoftDustEffects();
  updateJumpDustEffects();
  updateEffectKame();
  updateMana();
  updatePowerLightningEffect();
  drawBurstEffects();
  drawDust();
  drawSoftDustEffects();
  drawTrainingBot();
  drawPlayer();
  drawJumpDustEffects();
  drawEffectKame();
  updateAuraEffect();
  drawAuraEffect();
  ctx.restore();
  updateStatusHud();
  drawHealthHud();
  drawManaHud();
  drawPowerHud();

  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", () => {
  if (deviceModal) {
    deviceModal.classList.remove("hidden");
    return;
  }
  startGameWithMode(isTouchDevice() ? "mobile" : "pc");
});

if (toggleTrainingBotBtn) {
  toggleTrainingBotBtn.addEventListener("click", () => {
    trainingBotEnabled = !trainingBotEnabled;
    updateBotMenuButtons();
  });
}

if (toggleBotSpamBtn) {
  toggleBotSpamBtn.addEventListener("click", () => {
    botSpamEnabled = !botSpamEnabled;
    if (!botSpamEnabled) {
      spamBots.length = 0;
    } else {
      nextSpamBotWorldX = Math.max(nextSpamBotWorldX, getPlayerWorldX() + 1320);
    }
    updateBotMenuButtons();
  });
}

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

updateBotMenuButtons();

if (pauseMenuBtn) {
  pauseMenuBtn.addEventListener("click", () => {
    returnToMenu();
  });
}

if (pauseResetBtn) {
  pauseResetBtn.addEventListener("click", () => {
    resetGameState();
    closePauseMenu();
  });
}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "escape") {
    e.preventDefault();
    if (isPauseMenuOpen) {
      closePauseMenu();
    } else {
      openPauseMenu();
    }
    return;
  }

  if (isPauseMenuOpen) return;

  if (key === "a") {
    pressControl("a");
  }
  if (key === "h") {
    if (e.repeat) return;
    takeDamage(20);
    return;
  }
  if (key === "g") {
    if (e.repeat) return;
    heal(10);
    return;
  }
  if (key === "s") {
    pressControl("s");
  }
  if (key === "w") {
    if (e.repeat) return;
    pressControl("w");
  }
  if (key === "j") {
    if (e.repeat) return;
    pressControl("j");
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
  if (isPauseMenuOpen) return;
  if (key === "a") releaseControl("a");
  if (key === "j") releaseControl("j");
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
    if (isPauseMenuOpen) return;
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
