# ENGLISH FLASHCARDS 4 KIDS — AI AGENT HANDOFF
> Last updated: 2026-04-09 | Version: v4.5.22
> This file enables any AI agent to understand the full project and continue work immediately.

---

## PROJECT OVERVIEW
Android + web app teaching English vocabulary to young non-English speaking children (ages 3–8).
- Audio-first: TTS speaks each word, child repeats into mic, Vosk speech recognition evaluates
- Two-level navigation: Category → Subcategory → Game (single-subcategory categories skip subcategory screen)
- Special mode: Interactive Solar System map (tap planets, free exploration)
- Hosted on cPanel (systemaromania.site/flashcards) + GitHub Pages + Android APK via Capacitor

---

## REPO & DEPLOYMENT
- **GitHub:** https://github.com/mirceadaneliuc/audio-flashcards-4-kids
- **User:** mirceadaneliuc / elzorab
- **Live web (cPanel):** https://systemaromania.site/flashcards ✅ CONFIRMED WORKING
- **Live web (GitHub Pages):** https://mirceadaneliuc.github.io/audio-flashcards-4-kids/
- **APK ID:** com.elzorab.flashcards
- **Release APK:** Flashcards4Kids.apk (signed, on GitHub Releases)
- **Local path:** ~/Github/audio-flashcards-4-kids/
- **Web files:** ~/Github/audio-flashcards-4-kids/docs/
- **Keystore:** ~/flashcards-release.jks (password: Flashme-1314, alias: flashcards)

---

## FILE STRUCTURE
```
docs/
├── index.html              ← MAIN APP (v4.5.22) — single file, vanilla JS
├── words.json              ← ALL WORD DATA — 17 categories, 378 words
├── coi-serviceworker.js    ← COOP/COEP header injector (MUST be first script in <head>)
├── favicon.ico             ← UK flag favicon
├── SUPPORT.md              ← contact page (WhatsApp + email)
├── MASTER_PLAN.md          ← version history
├── AGENT_HANDOFF.md        ← this file
├── vosk.js                 ← Vosk speech recognition library (5.6MB, do not edit)
├── vosk-model-small-en-us-0.15.tar.gz  ← 40MB Vosk model (do not edit)
└── img/                    ← all images (PNG/JPG, all under 100KB)
android/
└── app/src/main/java/com/elzorab/flashcards/MainActivity.java
    └── COOP/COEP headers → enables SharedArrayBuffer for Vosk WASM
capacitor.config.json       ← appId: com.elzorab.flashcards, webDir: docs
```

**Android model path:** `vosk-model-small-en-us-0.15.tar` (no .gz — Capacitor strips it)
**Web model path:** `/flashcards/vosk-model-small-en-us-0.15.tar.gz`
**Auto-detected in code:** `const isNative=window.Capacitor&&window.Capacitor.isNativePlatform()`

**Web hosting (cPanel/LiteSpeed):**
1. `.htaccess` with both `Header set` and `Header always set` for COOP/COEP
2. `coi-serviceworker.js` as FIRST script in `<head>` before vosk.js
3. Vosk model path must be absolute: `/flashcards/vosk-model-small-en-us-0.15.tar.gz`

**TTS:** Native Capacitor TTS tested on init with 500ms+1000ms retry. Falls back to browser TTS if unavailable. Does NOT work on iodéOS (privacy Android fork) — device limitation.

---

## BUILD COMMANDS

```bash
# Web deploy
cd ~/Github/audio-flashcards-4-kids
git add docs/
git commit -m "vX.X.X - description"
git push

# Debug APK
cd ~/Github/audio-flashcards-4-kids
npx cap sync android && cd android
./gradlew clean assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk

# Release APK (signed)
cd ~/Github/audio-flashcards-4-kids/android
./gradlew clean assembleRelease
cp app/build/outputs/apk/release/app-release.apk ~/Flashcards4Kids.apk
```

> ⚠️ Always use `clean`. For debug→release switch: `adb uninstall com.elzorab.flashcards` first (different signatures).

---

## ARCHITECTURE: index.html

### Key globals
- `WORDS_DATA` — loaded from words.json
- `deck[]` — shuffled array of word objects for current subcategory
- `idx` — current card index
- `attempts` — miss counter (resets each card)
- `busy` — prevents double-firing
- `listening` — mic active flag
- `voskReady` — Vosk model loaded flag
- `currentCat`, `currentSub` — current navigation state
- `solarItem`, `solarAttempts`, `solarBusy` — solar system mode state

### Navigation flow
Splash → buildCatMenu() → showSubMenu(catKey) → startGame(catKey,subKey) → showCard() → _playCard() → startListening()

### Game layout (v4.5.20+)
- `#top-row` — fixed at top (position:fixed), back + progress + stars
- `#main-card` — image/emoji + word (fitWord() auto-scales font) + syllables + wave + feedback overlay
- `#partial-text` — heard word in quotes, OUTSIDE card (not clipped)
- `#nav-row` — ◀ [status text] ▶, arrows away from side buttons
- `#btn-listen` / `#btn-mic` — fixed left/right side buttons
- `@media(orientation:landscape)` — smaller card and emoji

### fitWord()
Called after every `main-word` text change. Shrinks font-size px by px until `scrollWidth ≤ card.clientWidth - 32`. Prevents mid-word breaks on long words like STRAWBERRY, PRINCIPAL.

### Game loop
1. `startGame()` — shuffles deck, speaks subcategory label, hides card
2. `showCard()` — renders image/emoji, sets word + fitWord(), speaks after 600ms
3. `_playCard()` — speaks word, mic activates immediately after TTS
4. `startListening()` — KaldiRecognizer with audioContext.sampleRate, 5s/7s timeout
5. `evaluate()` — fuzzy Levenshtein match
6. `onCorrect()` — +10 stars, confetti, advance
7. `onWrong()` — miss 1: slow replay; miss 2: syllables; miss 3: push to end

### Numbers rendering
Number emojis (1️⃣ etc.) replaced with plain digit strings ("1","2"...) in words.json.
In showCard(): if `/^\d+$/.test(item.e)` → render as large blue Fredoka One text instead of emoji font.

### Solar System mode
- Full cartoon map tap planets → TTS + Vosk, same 3-miss system
- SVG hotspots, pinch-to-zoom, double-tap reset
- Includes: sun, mercury, venus, moon, earth, jupiter, mars, saturn, uranus, neptune, pluto, comet, asteroids

---

## CONTACT & PROMO
- **WhatsApp:** https://tinyurl.com/58yku663
- **Email:** onestopsolutions@duck.com
- **Promo files:** promo_ro.txt, promo_en.txt
- **Promo card:** promo.html (dark space theme, screenshot to share)
- **QR code:** qr_flashcards.png → systemaromania.site/flashcards

---

## WORKING CONVENTIONS
- User saves files locally — agent does NOT provide cp commands
- All changes accumulate until user says **APC**
- **APC** = bump version + update MASTER_PLAN + AGENT_HANDOFF + present files + git commands + build commands
- Version format: v4.X.Y — minor for features, patch for fixes
- Agent reads full index.html before code changes
- words.json edits via Python script only
- Images: use Pillow to replace black/transparent backgrounds with white
- Run `optimize_images.py` after new images (keep under 100KB)
- Run `fix_img_refs.py` after optimization (fix PNG→JPG renames in words.json)
- Do NOT show pending list after each change — just say "Added"
- Do NOT present files until APC

---

## PENDING / PLANNED
> **Note:** TTS does not work on iodéOS — device limitation, not a bug.

1. **[LOW]** Fix Android status bar black bar overlapping app top
2. **[PLANNED]** Migrate ScriptProcessorNode → AudioWorkletNode
3. **[PLANNED]** Add categories: Letters, Greetings, Time, Actions/Verbs, Health
4. **[PLANNED]** Google Play Store publication ($25 one-time fee, keystore ready)
