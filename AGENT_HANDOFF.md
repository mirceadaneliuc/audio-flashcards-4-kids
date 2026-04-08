# ENGLISH FLASHCARDS 4 KIDS — AI AGENT HANDOFF
> Last updated: 2026-04-08 | Version: v4.5.6 — app live at systemaromania.site/flashcards
> This file enables any AI agent to understand the full project and continue work immediately.

---

## PROJECT OVERVIEW
Android + web app teaching English vocabulary to young non-English speaking children (ages 3–8).
- Audio-first: TTS speaks each word, child repeats into mic, Vosk speech recognition evaluates
- Two-level navigation: Category → Subcategory → Game (single-subcategory categories skip subcategory screen)
- Special mode: Interactive Solar System map (tap planets, free exploration)
- Hosted on GitHub Pages + personal cPanel hosting + Android APK via Capacitor

---

## REPO & DEPLOYMENT
- **GitHub:** https://github.com/mirceadaneliuc/audio-flashcards-4-kids
- **User:** mirceadaneliuc / elzorab
- **Live web (GitHub Pages):** https://mirceadaneliuc.github.io/audio-flashcards-4-kids/
- **Live web (cPanel):** https://systemaromania.site/flashcards ✅ CONFIRMED WORKING
- **APK ID:** com.elzorab.flashcards
- **Release APK:** Flashcards4Kids.apk (signed, available on GitHub Releases)
- **Local path:** ~/Github/audio-flashcards-4-kids/
- **Web files:** ~/Github/audio-flashcards-4-kids/docs/

---

## FILE STRUCTURE
```
docs/
├── index.html              ← MAIN APP (v4.5.6) — single file, vanilla JS
├── words.json              ← ALL WORD DATA — 17 categories, 378 words
├── MASTER_PLAN.md          ← version history
├── AGENT_HANDOFF.md        ← this file
├── vosk.js                 ← Vosk speech recognition library (5.6MB, do not edit)
├── vosk-model-small-en-us-0.15.tar.gz  ← 40MB Vosk model (do not edit)
└── img/                    ← all images (PNG/JPG, all under 100KB after optimization)
android/
└── app/src/main/java/com/elzorab/flashcards/MainActivity.java
    └── COOP/COEP headers → enables SharedArrayBuffer for Vosk WASM
capacitor.config.json       ← appId: com.elzorab.flashcards, webDir: docs
~/flashcards-release.jks    ← release keystore (password: Flashme-1314, alias: flashcards)
```

**Critical Android note:** The model is stored in APK assets as
`vosk-model-small-en-us-0.15.tar` (WITHOUT .gz — Android asset packager
decompresses .gz files automatically). Code must reference `.tar` not `.tar.gz`.

**Web hosting note:** cPanel hosting requires `.htaccess` with COOP/COEP headers for Vosk WASM to work:
```apache
<IfModule mod_headers.c>
  Header set Cross-Origin-Opener-Policy "same-origin"
  Header set Cross-Origin-Embedder-Policy "require-corp"
</IfModule>
```
GitHub Pages does NOT support these headers — Vosk may fail there on some browsers.

---

## BUILD COMMANDS

```bash
cd ~/Github/audio-flashcards-4-kids
git add docs/
git commit -m "vX.X.X - description"
git push
```

```bash
cd ~/Github/audio-flashcards-4-kids
npx cap sync android && cd android
./gradlew clean assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.elzorab.flashcards/.MainActivity
```

**Release APK (signed, shareable):**
```bash
cd ~/Github/audio-flashcards-4-kids/android
./gradlew clean assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

> ⚠️ Always use `clean` — Capacitor caches old files.

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

**Single-subcategory skip:** if a category has only 1 subcategory, `showSubMenu()` calls `startGame()` directly.

**Solar system exception:** if subKey === 'solar', `startGame()` routes to `startSolarGame()` instead.

### Game loop
1. `startGame()` — shuffles deck, speaks subcategory label (GET READY), hides card until first word loads
2. `showCard()` — clears stale content, renders image/emoji (opacity:0 until loaded), speaks word after 600ms
3. `_playCard()` — speaks word, then immediately activates mic in listening state (no delay)
4. `startListening()` — creates Vosk KaldiRecognizer with current deck vocabulary, opens mic, 5s/7s timeout
5. `evaluate()` — fuzzy Levenshtein match, thresholds: ≤3 chars=0.6, ≤5=0.68, 6+=0.75
6. `onCorrect()` — +10 stars, confetti, advance card
7. `onWrong()` — miss 1: replay slow; miss 2: syllables + word; miss 3: push to end of deck

### Solar System mode
- Full cartoon map (`img/solar_system.png`) displayed instead of flashcard UI
- SVG overlay with circular hotspots mapped to each planet/object (viewBox matches image 1920x1209)
- Tap a hotspot → TTS speaks name → Vosk listens → same 3-miss hint system
- Free exploration — no forced order, no finish screen
- Includes: sun, mercury, venus, moon, earth, jupiter, mars, saturn, uranus, neptune, pluto, comet, asteroids
- Pinch-to-zoom supported, double-tap to reset zoom
- Stars/mic buttons visible and functional

### TTS timing
- `startGame()`: speaks subcategory label, 600ms pause, then showCard()
- `_playCard()`: speaks word 600ms after card shown, mic activates immediately after TTS
- `navPrev/navNext`: 200ms delay before showCard()

### Image rendering
- Images shown at **360px** (all categories)
- Emojis shown at **220px** font-size
- Image loads with opacity:0 until fully loaded, then opacity:1 (prevents flash)
- Card hidden during GET READY (visibility:hidden), revealed on showCard()
- All images optimized to under 100KB

### Consecutive pairs (sizes category)
After shuffle in `startGame()`, these pairs are always kept adjacent:
`[big,small], [long,short], [tall,short], [fat,thin], [heavy,light], [old,young]`
Short has two versions: `short.jpg` (trees, paired with tall) and `short_long.jpg` (pencils, paired with long).

### Known issues / Vosk quirks
- sampleRate 48000 warning on every recognizer creation — harmless, Vosk auto-corrects
- ScriptProcessorNode deprecated — functional, migration to AudioWorklet pending
- "pink" special case in evaluate(): if heard contains "ink/think/ping" → accept

---

## words.json STRUCTURE
```json
{
  "category_key": {
    "label": "DISPLAY NAME",
    "icon": "🐾",
    "color": "#FF6B6B",
    "subcategories": {
      "sub_key": {
        "label": "SUB DISPLAY NAME",
        "icon": "🐄",
        "words": [
          {"w": "word", "e": "🐄", "s": ["SYL","LA","BLES"], "img": "img/filename.png"}
        ]
      }
    }
  }
}
```
- `w` — word (what Vosk listens for, what TTS speaks)
- `e` — emoji fallback
- `s` — syllable array for miss-2 hint
- `img` — optional image path (relative to docs/)

---

## CATEGORIES (378 words, 17 categories)

| Category | Icon | Words | Subcategories |
|----------|------|------:|---------------|
| Animals | 🐾 | 65 | Farm, Jungle, Woods, Pets, Birds, Sea, Insects |
| Food | 🍎 | 54 | Fruits, Vegetables, Dairy, Bakery, Drinks, Sweets |
| Colors | 🌈 | 11 | (single) |
| Numbers | 🔢 | 30 | 1–10, 11–20, Tens |
| Shapes | 🔷 | 8 | (single) |
| Sizes | 📏 | 12 | (single) |
| Feelings | ❤️ | 10 | (single) |
| Body | 🫀 | 28 | Face, Upper, Lower, Organs |
| Home | 🏠 | 31 | Bedroom, Kitchen, Living Room, Bathroom |
| Nature | 🌿 | 29 | Weather, Plants, Landforms |
| Space | 🚀 | 18 | Space (flashcards), Solar (interactive map) |
| Seasons | 🍂 | 22 | Spring, Summer, Fall, Winter |
| Clothes | 👕 | 20 | (single) |
| Family | 👨‍👩‍👧 | 10 | Parents, Grandparents |
| Transport | 🚗 | 14 | Land, Air, Water |
| School | 🎒 | 16 | People, Places, Supplies |

---

## WORKING CONVENTIONS
- User saves files locally to the correct directory themselves — agent does NOT provide cp commands
- All changes accumulate in a pending list until user says **APC**
- **APC** = Apply all changes + Present all changed files + Show git commands + Show build commands
- On APC: bump version, update MASTER_PLAN.md + AGENT_HANDOFF.md, present files, give two separate command blocks (git / android)
- Version format: v4.X.Y — minor for new features, patch for fixes
- Agent reads full index.html before making code changes
- words.json edits done via Python script, never manually
- Images with black/transparent backgrounds → use Pillow to replace with white
- Run `optimize_images.py` after adding new images to keep all under 100KB
- After optimization run `fix_img_refs.py` to fix any PNG→JPG renamed references in words.json
- Do NOT display pending list after each change — just say "Added"
- Do NOT present files until APC

---

## PENDING / PLANNED
1. **[LOW]** Fix sampleRate warning — pass `audioContext.sampleRate` to KaldiRecognizer
2. **[NOTE]** favicon.ico 404 on cPanel is harmless — browser tab icon not present, does not affect app
2. **[LOW]** Fix Android status bar black bar overlapping app top
3. **[PLANNED]** Migrate ScriptProcessorNode → AudioWorkletNode
4. **[PLANNED]** Add categories: Letters, Greetings, Time, Actions/Verbs, Health
5. **[PLANNED]** Google Play Store publication ($25 one-time fee, keystore ready)
