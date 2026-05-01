// ─────────────────────────────────────────────
//  menu.js — Advanced Menu System
//  Features: Main Menu, Settings, Character Select, Level Select, Credits
// ─────────────────────────────────────────────

// ── Constants ──────────────────────────────
var GAME_SETTINGS = {
  musicVolume: 0.3,
  sfxVolume: 0.5,
  difficulty: "normal", // "easy", "normal", "hard"
  selectedCharacter: "Pink Man",
  selectedLevel: 1,
};

// Load settings from localStorage
function loadGameSettings() {
  var saved = localStorage.getItem("gameSettings");
  if (saved) {
    GAME_SETTINGS = JSON.parse(saved);
  }
}

// Save settings to localStorage
function saveGameSettings() {
  localStorage.setItem("gameSettings", JSON.stringify(GAME_SETTINGS));
}

// Load or initialize high scores
function getHighScore() {
  var score = localStorage.getItem("highScore");
  return score ? parseInt(score) : 0;
}

function setHighScore(score) {
  localStorage.setItem("highScore", score.toString());
}

// ═════════════════════════════════════════════
//  MAIN MENU SCENE
// ═════════════════════════════════════════════
class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenu" });
  }

  preload() {
    // Load menu background
    this.load.image("menu-bg", "assets/2d/Background/Blue.png");
    
    // Load menu music (optional - using existing game sound if available)
    this.load.audio("menu-music", "assets/audio/GameSFX/Magic/Magic 04.wav");
    
    // Load button hover sound
    this.load.audio("button-hover", "assets/audio/GameSFX/Blops/Blop 1.wav");
    this.load.audio("button-click", "assets/audio/GameSFX/Bounce Jump/Retro Jump Simple C2 02.wav");
  }

  create() {
    loadGameSettings();
    
    // Parallax scrolling background
    var bg = this.add.tileSprite(0, 0, 800, 400, "menu-bg").setOrigin(0, 0);
    this.bg = bg;

    // Title text
    var title = this.add.text(400, 60, "MY AWESOME GAME", {
      font: "bold 48px Arial",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    });
    title.setOrigin(0.5, 0.5);

    // Subtitle
    var subtitle = this.add.text(400, 110, "An Adventure Awaits", {
      font: "24px Arial",
      fill: "#ffdd00",
    });
    subtitle.setOrigin(0.5, 0.5);

    // High score display
    var highScore = getHighScore();
    var scoreText = this.add.text(400, 150, `High Score: ${highScore}`, {
      font: "18px Arial",
      fill: "#00ff00",
    });
    scoreText.setOrigin(0.5, 0.5);

    // Button Y positions
    var buttonY = 240;
    var buttonSpacing = 55;

    // Play button
    this.createButton(
      400,
      buttonY,
      "PLAY GAME",
      () => this.scene.start("LevelSelect"),
    );

    // Character Select button
    this.createButton(
      400,
      buttonY + buttonSpacing,
      "CHARACTER",
      () => this.scene.start("CharacterSelect"),
    );

    // Settings button
    this.createButton(
      400,
      buttonY + buttonSpacing * 2,
      "SETTINGS",
      () => this.scene.start("Settings"),
    );

    // Credits button
    this.createButton(
      400,
      buttonY + buttonSpacing * 3,
      "CREDITS",
      () => this.scene.start("Credits"),
    );

    // Play background music (loop)
    // this.sound.play("menu-music", { loop: true, volume: GAME_SETTINGS.musicVolume });
  }

  createButton(x, y, text, callback) {
    // Button background
    var button = this.add.rectangle(x, y, 200, 45, 0x4a90e2, 0.9);
    button.setStrokeStyle(3, 0xffffff);
    button.setInteractive();

    // Button text
    var buttonText = this.add.text(x, y, text, {
      font: "bold 20px Arial",
      fill: "#ffffff",
    });
    buttonText.setOrigin(0.5, 0.5);

    // Hover effect
    button.on("pointerover", () => {
      button.setFillStyle(0x66b3ff);
      button.setScale(1.1);
      // this.sound.play("button-hover", { volume: GAME_SETTINGS.sfxVolume });
    });

    button.on("pointerout", () => {
      button.setFillStyle(0x4a90e2);
      button.setScale(1);
    });

    // Click effect
    button.on("pointerdown", () => {
      // this.sound.play("button-click", { volume: GAME_SETTINGS.sfxVolume });
      this.fadeOut(() => callback());
    });
  }

  fadeOut(callback) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, callback);
  }

  update() {
    // Subtle parallax effect
    this.bg.tilePositionX += 0.3;
  }
}

// ═════════════════════════════════════════════
//  LEVEL SELECT SCENE
// ═════════════════════════════════════════════
class LevelSelect extends Phaser.Scene {
  constructor() {
    super({ key: "LevelSelect" });
  }

  preload() {
    this.load.image("level-bg", "assets/2d/Background/Blue.png");
  }

  create() {
    this.add.image(0, 0, "level-bg").setOrigin(0, 0);

    // Title
    this.add.text(400, 40, "SELECT LEVEL", {
      font: "bold 40px Arial",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5);

    // Level buttons
    var levelCount = 5;
    var startY = 150;
    var buttonWidth = 120;
    var buttonHeight = 50;
    var spacing = 140;

    for (var i = 1; i <= levelCount; i++) {
      var x = 200 + (i - 1) * spacing;
      this.createLevelButton(x, startY, i);
    }

    // Back button
    this.createBackButton(400, 320);
  }

  createLevelButton(x, y, levelNum) {
    var button = this.add.rectangle(x, y, 100, 80, 0x2ecc71, 0.85);
    button.setStrokeStyle(3, 0xffffff);
    button.setInteractive();

    var text = this.add.text(x, y - 10, `LEVEL`, {
      font: "bold 16px Arial",
      fill: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);

    var numText = this.add.text(x, y + 15, levelNum.toString(), {
      font: "bold 32px Arial",
      fill: "#ffdd00",
    });
    numText.setOrigin(0.5, 0.5);

    button.on("pointerover", () => {
      button.setScale(1.15);
      button.setFillStyle(0x27ae60);
    });

    button.on("pointerout", () => {
      button.setScale(1);
      button.setFillStyle(0x2ecc71);
    });

    button.on("pointerdown", () => {
      GAME_SETTINGS.selectedLevel = levelNum;
      saveGameSettings();
      this.fadeOut(() => {
        this.scene.start("Game");
      });
    });
  }

  createBackButton(x, y) {
    var button = this.add.rectangle(x, y, 150, 45, 0xe74c3c, 0.85);
    button.setStrokeStyle(3, 0xffffff);
    button.setInteractive();

    var text = this.add.text(x, y, "← BACK", {
      font: "bold 18px Arial",
      fill: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);

    button.on("pointerover", () => {
      button.setScale(1.1);
      button.setFillStyle(0xc0392b);
    });

    button.on("pointerout", () => {
      button.setScale(1);
      button.setFillStyle(0xe74c3c);
    });

    button.on("pointerdown", () => {
      this.fadeOut(() => this.scene.start("MainMenu"));
    });
  }

  fadeOut(callback) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, callback);
  }
}

// ═════════════════════════════════════════════
//  CHARACTER SELECT SCENE
// ═════════════════════════════════════════════
class CharacterSelect extends Phaser.Scene {
  constructor() {
    super({ key: "CharacterSelect" });
  }

  preload() {
    this.load.image("char-bg", "assets/2d/Background/Blue.png");
    
    // Load character idle sprites
    var characters = ["Pink Man", "Ninja Frog", "Mask Dude", "Virtual Guy"];
    characters.forEach((char) => {
      var key = char.toLowerCase().replace(" ", "-");
      this.load.spritesheet(
        key,
        `assets/2d/Main Characters/${char}/Idle (32x32).png`,
        { frameWidth: 32, frameHeight: 32 },
      );
    });
  }

  create() {
    this.add.image(0, 0, "char-bg").setOrigin(0, 0);

    // Title
    this.add.text(400, 40, "SELECT CHARACTER", {
      font: "bold 40px Arial",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5);

    var characters = ["Pink Man", "Ninja Frog", "Mask Dude", "Virtual Guy"];
    var charKeys = ["pink-man", "ninja-frog", "mask-dude", "virtual-guy"];
    var startY = 180;
    var spacing = 180;

    // Create character cards
    characters.forEach((char, i) => {
      var x = 120 + i * spacing;
      this.createCharacterCard(x, startY, char, charKeys[i]);
    });

    // Back button
    this.createBackButton(400, 330);
  }

  createCharacterCard(x, y, charName, charKey) {
    var isSelected = GAME_SETTINGS.selectedCharacter === charName;
    var bgColor = isSelected ? 0xf39c12 : 0x34495e;

    var card = this.add.rectangle(x, y, 110, 140, bgColor, 0.85);
    card.setStrokeStyle(isSelected ? 4 : 2, isSelected ? 0xffdd00 : 0xffffff);
    card.setInteractive();

    // Character sprite (scaled up)
    var sprite = this.add.sprite(x, y - 20, charKey);
    sprite.setScale(2.5);

    // Create idle animation if not already created
    if (!this.anims.exists(charKey + "-idle")) {
      this.anims.create({
        key: charKey + "-idle",
        frames: this.anims.generateFrameNumbers(charKey),
        frameRate: 8,
        repeat: -1,
      });
    }
    sprite.play(charKey + "-idle");

    // Character name
    var text = this.add.text(x, y + 45, charName, {
      font: "bold 12px Arial",
      fill: "#ffffff",
      align: "center",
      wordWrap: { width: 100 },
    });
    text.setOrigin(0.5, 0.5);

    card.on("pointerover", () => {
      card.setScale(1.1);
    });

    card.on("pointerout", () => {
      card.setScale(1);
    });

    card.on("pointerdown", () => {
      GAME_SETTINGS.selectedCharacter = charName;
      saveGameSettings();
      this.scene.restart(); // Refresh to show selection
    });
  }

  createBackButton(x, y) {
    var button = this.add.rectangle(x, y, 150, 45, 0xe74c3c, 0.85);
    button.setStrokeStyle(3, 0xffffff);
    button.setInteractive();

    var text = this.add.text(x, y, "← BACK", {
      font: "bold 18px Arial",
      fill: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);

    button.on("pointerover", () => {
      button.setScale(1.1);
      button.setFillStyle(0xc0392b);
    });

    button.on("pointerout", () => {
      button.setScale(1);
      button.setFillStyle(0xe74c3c);
    });

    button.on("pointerdown", () => {
      this.fadeOut(() => this.scene.start("MainMenu"));
    });
  }

  fadeOut(callback) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, callback);
  }
}

// ═════════════════════════════════════════════
//  SETTINGS SCENE
// ═════════════════════════════════════════════
class Settings extends Phaser.Scene {
  constructor() {
    super({ key: "Settings" });
  }

  preload() {
    this.load.image("settings-bg", "assets/2d/Background/Blue.png");
  }

  create() {
    this.add.image(0, 0, "settings-bg").setOrigin(0, 0);

    // Title
    this.add.text(400, 40, "SETTINGS", {
      font: "bold 40px Arial",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5);

    var startY = 130;
    var spacing = 60;

    // Music Volume
    this.createSlider(
      50,
      startY,
      "Music Volume",
      GAME_SETTINGS.musicVolume,
      (value) => {
        GAME_SETTINGS.musicVolume = value;
      },
    );

    // SFX Volume
    this.createSlider(
      50,
      startY + spacing,
      "SFX Volume",
      GAME_SETTINGS.sfxVolume,
      (value) => {
        GAME_SETTINGS.sfxVolume = value;
      },
    );

    // Difficulty selector
    this.createDifficultySelector(50, startY + spacing * 2);

    // Save and Back buttons
    var buttonY = 320;
    this.createSaveButton(300, buttonY);
    this.createBackButton(500, buttonY);
  }

  createSlider(x, y, label, initialValue, onChangeCallback) {
    // Label
    this.add.text(x, y, label, {
      font: "bold 16px Arial",
      fill: "#ffffff",
    });

    // Background bar
    var barBg = this.add.rectangle(x + 150, y + 10, 250, 12, 0x555555, 0.8);

    // Slider knob
    var knobX = x + 150 + (initialValue - 0.5) * 250;
    var knob = this.add.circle(knobX, y + 10, 12, 0xffdd00);
    knob.setInteractive();

    // Value text
    var valueText = this.add.text(x + 420, y + 10, Math.round(initialValue * 100) + "%", {
      font: "14px Arial",
      fill: "#00ff00",
    });
    valueText.setOrigin(0, 0.5);

    // Drag logic
    var isDragging = false;
    knob.on("pointerdown", () => (isDragging = true));
    this.input.on("pointerup", () => (isDragging = false));

    this.input.on("pointermove", (pointer) => {
      if (isDragging) {
        var newX = Phaser.Math.Clamp(
          pointer.x,
          x + 150 - 125,
          x + 150 + 125,
        );
        knob.x = newX;

        var value = (newX - (x + 150 - 125)) / 250;
        valueText.setText(Math.round(value * 100) + "%");
        onChangeCallback(value);
      }
    });
  }

  createDifficultySelector(x, y) {
    // Label
    this.add.text(x, y, "Difficulty", {
      font: "bold 16px Arial",
      fill: "#ffffff",
    });

    var difficulties = ["Easy", "Normal", "Hard"];
    var buttonWidth = 80;
    var buttonSpacing = 90;

    difficulties.forEach((diff, i) => {
      var btnX = x + 150 + i * buttonSpacing;
      var isSelected =
        GAME_SETTINGS.difficulty === diff.toLowerCase();
      var bgColor = isSelected ? 0xf39c12 : 0x4a90e2;

      var button = this.add.rectangle(btnX, y + 10, buttonWidth, 35, bgColor, 0.85);
      button.setStrokeStyle(2, 0xffffff);
      button.setInteractive();

      var text = this.add.text(btnX, y + 10, diff, {
        font: "bold 14px Arial",
        fill: "#ffffff",
      });
      text.setOrigin(0.5, 0.5);

      button.on("pointerdown", () => {
        GAME_SETTINGS.difficulty = diff.toLowerCase();
        this.scene.restart();
      });
    });
  }

  createSaveButton(x, y) {
    var button = this.add.rectangle(x, y, 150, 45, 0x2ecc71, 0.85);
    button.setStrokeStyle(3, 0xffffff);
    button.setInteractive();

    var text = this.add.text(x, y, "SAVE", {
      font: "bold 18px Arial",
      fill: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);

    button.on("pointerover", () => {
      button.setScale(1.1);
      button.setFillStyle(0x27ae60);
    });

    button.on("pointerout", () => {
      button.setScale(1);
      button.setFillStyle(0x2ecc71);
    });

    button.on("pointerdown", () => {
      saveGameSettings();
      this.fadeOut(() => this.scene.start("MainMenu"));
    });
  }

  createBackButton(x, y) {
    var button = this.add.rectangle(x, y, 150, 45, 0xe74c3c, 0.85);
    button.setStrokeStyle(3, 0xffffff);
    button.setInteractive();

    var text = this.add.text(x, y, "CANCEL", {
      font: "bold 18px Arial",
      fill: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);

    button.on("pointerover", () => {
      button.setScale(1.1);
      button.setFillStyle(0xc0392b);
    });

    button.on("pointerout", () => {
      button.setScale(1);
      button.setFillStyle(0xe74c3c);
    });

    button.on("pointerdown", () => {
      this.fadeOut(() => this.scene.start("MainMenu"));
    });
  }

  fadeOut(callback) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, callback);
  }
}

// ═════════════════════════════════════════════
//  CREDITS SCENE
// ═════════════════════════════════════════════
class Credits extends Phaser.Scene {
  constructor() {
    super({ key: "Credits" });
  }

  preload() {
    this.load.image("credits-bg", "assets/2d/Background/Blue.png");
  }

  create() {
    this.add.image(0, 0, "credits-bg").setOrigin(0, 0);

    // Title
    this.add.text(400, 40, "CREDITS", {
      font: "bold 40px Arial",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5);

    var credits = [
      "GAME DEVELOPMENT",
      "Created by Your Name",
      "",
      "PROGRAMMING",
      "Phaser 3 Game Engine",
      "JavaScript Magic",
      "",
      "ART & ASSETS",
      "Character sprites & tilesets",
      "from the starter pack",
      "",
      "SOUND EFFECTS",
      "Open source audio library",
      "",
      "SPECIAL THANKS",
      "To all playtesters & supporters!",
    ];

    var startY = 120;
    var spacing = 22;

    credits.forEach((line, i) => {
      var isTitle = line === line.toUpperCase() && line.length > 0;
      var fontSize = isTitle ? "bold 14px Arial" : "12px Arial";
      var color = isTitle ? "#ffdd00" : "#ffffff";

      this.add.text(400, startY + i * spacing, line, {
        font: fontSize,
        fill: color,
        align: "center",
      }).setOrigin(0.5, 0);
    });

    // Back button
    this.createBackButton(400, 360);
  }

  createBackButton(x, y) {
    var button = this.add.rectangle(x, y, 150, 45, 0xe74c3c, 0.85);
    button.setStrokeStyle(3, 0xffffff);
    button.setInteractive();

    var text = this.add.text(x, y, "← BACK", {
      font: "bold 18px Arial",
      fill: "#ffffff",
    });
    text.setOrigin(0.5, 0.5);

    button.on("pointerover", () => {
      button.setScale(1.1);
      button.setFillStyle(0xc0392b);
    });

    button.on("pointerout", () => {
      button.setScale(1);
      button.setFillStyle(0xe74c3c);
    });

    button.on("pointerdown", () => {
      this.fadeOut(() => this.scene.start("MainMenu"));
    });
  }

  fadeOut(callback) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, callback);
  }
}
