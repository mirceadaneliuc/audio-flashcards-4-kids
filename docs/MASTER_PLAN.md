# ENGLISH FLASHCARDS 4 KIDS — MASTER PLAN
**Version:** v4.5.22
**Last updated:** 2026-04-09
**Repo:** https://github.com/mirceadaneliuc/audio-flashcards-4-kids
**Live web (cPanel):** https://systemaromania.site/flashcards
**Live web (GitHub Pages):** https://mirceadaneliuc.github.io/audio-flashcards-4-kids/
**APK ID:** com.elzorab.flashcards

---

## ARCHITECTURE

```
audio-flashcards-4-kids/
├── docs/
│   ├── index.html              ← main app (v4.5.22) — Vosk SR + two-level nav
│   ├── words.json              ← 17 categories, 378 words
│   ├── coi-serviceworker.js    ← COOP/COEP header injector for cPanel/LiteSpeed
│   ├── favicon.ico             ← UK flag favicon
│   ├── SUPPORT.md              ← contact page (email + WhatsApp)
│   ├── vosk.js                 ← vosk-browser library (5.6MB)
│   ├── vosk-model-small-en-us-0.15.tar.gz  ← 40MB Vosk model
│   ├── MASTER_PLAN.md          ← this file
│   └── img/                    ← all images (PNG/JPG, all under 100KB)
├── android/
│   ├── app/src/main/java/com/elzorab/flashcards/MainActivity.java
│   │   └── COOP/COEP headers → enables SharedArrayBuffer for Vosk WASM
│   └── local.properties        ← sdk.dir=/home/elzorab/Android/Sdk
├── capacitor.config.json       ← appId: com.elzorab.flashcards, webDir: docs
└── package.json
```

**Critical Android note:** The model is stored in APK assets as
`vosk-model-small-en-us-0.15.tar` (WITHOUT .gz). Code auto-detects platform:
- Android (native): loads `.tar` from assets
- Web (cPanel): loads `/flashcards/vosk-model-small-en-us-0.15.tar.gz`

**Web hosting note:** cPanel (LiteSpeed) requires TWO things for Vosk WASM:
1. `.htaccess` with COOP/COEP headers (both `set` and `always set`)
2. `coi-serviceworker.js` as the FIRST script in `<head>`

**TTS note:** Native TTS does NOT work on iodéOS (privacy Android fork) — device limitation, not a bug. Works on all standard Android.

---

## NAVIGATION FLOW

```
Splash → Category Menu → Subcategory Menu → Game → back to Subcategory Menu
```

---

## GAME LAYOUT (v4.5.20+)

- Top row (back + progress + stars) fixed at top of screen
- Main card: image/emoji + word (auto-fit font) + syllables + wave
- partial-text (heard word in quotes) below card
- nav-row: ◀ [status text] ▶ below partial-text
- Fixed side buttons: 🔊 left, 🎤 right
- Landscape: smaller card via `@media(orientation:landscape)`

---

## SPEECH RECOGNITION — VOSK-BROWSER ✅

- Model loaded at startup, cached after first download
- Per-card KaldiRecognizer with vocabulary grammar
- sampleRate passed from AudioContext (no more mismatch warning)
- 5s timeout (7s for words >6 chars)
- Fuzzy Levenshtein matching: ≤3=0.60, ≤5=0.68, 6+=0.75

---

## WORD DATABASE — words.json

**378 words / 17 categories**

| Category | Icon | Words |
|----------|------|------:|
| Animals | 🐾 | 65 |
| Food | 🍎 | 54 |
| Colors | 🌈 | 11 |
| Numbers | 🔢 | 30 |
| Shapes | 🔷 | 8 |
| Sizes | 📏 | 12 |
| Feelings | ❤️ | 10 |
| Body | 🫀 | 28 |
| Home | 🏠 | 31 |
| Nature | 🌿 | 29 |
| Space | 🚀 | 18 |
| Seasons | 🍂 | 22 |
| Clothes | 👕 | 20 |
| Family | 👨‍👩‍👧 | 10 |
| Transport | 🚗 | 14 |
| School | 🎒 | 16 |

**Number emojis replaced with plain digits** (1, 2, 3...) rendered as large blue styled text — fixes rectangle boxes on older Android.

---

## BUILD COMMANDS

```bash
# Git deploy
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
# Output: android/app/build/outputs/apk/release/app-release.apk
# Rename to Flashcards4Kids.apk before uploading to GitHub Releases
```

> ⚠️ Always use `clean` — Capacitor caches old files.

---

## PENDING

1. **[LOW]** Fix Android status bar black bar overlapping app top
2. **[PLANNED]** Migrate ScriptProcessorNode → AudioWorkletNode
3. **[PLANNED]** Add categories: Letters, Greetings, Time, Actions/Verbs, Health
4. **[PLANNED]** Google Play Store publication ($25 one-time fee, keystore ready)

---

## VERSION HISTORY

| Version | Changes |
|---------|---------|
| v4.5.22 | Word auto-fits font size to card width — no more mid-word breaks |
| v4.5.21 | partial-text moved outside card, no longer clipped |
| v4.5.20 | Top row fixed at screen top; arrows moved to nav-row below word; landscape mode |
| v4.5.19 | Game card centered vertically |
| v4.5.18 | Fix: SyntaxError from stray backslash |
| v4.5.17 | Fix: initCapacitor runs early — splash tap instant |
| v4.5.16 | Numbers render as large blue digits; sampleRate fix; AudioContext order fix |
| v4.5.15 | TTS retry logic with delays before fallback |
| v4.5.14 | TTS health check on init; responsive image size; word overflow fix |
| v4.5.13 | Category cards smaller; version removed from topbar |
| v4.5.12 | Full responsive layout with clamp() on all sizes |
| v4.5.11 | Vosk auto-detects Android vs web model path |
| v4.5.10 | UK flag favicon; cPanel web hosting fully working |
| v4.5.9 | Fix: Vosk model absolute path for cPanel |
| v4.5.8 | Fix: Vosk model .tar → .tar.gz for web |
| v4.5.7 | coi-serviceworker.js for COOP/COEP on LiteSpeed |
| v4.5.6 | Fixed broken image references after optimization |
| v4.5.5 | Image optimization: 36 images under 100KB |
| v4.5.4 | Vosk loading overlay non-blocking on web |
| v4.5.3 | School/transport images |
| v4.5.2 | Version on splash, debug logs removed |
| v4.5.1 | Hot air balloon image |
| v4.5.0 | Clothes images; mic active fix |
| v4.4.0 | Interactive Solar System map |
| v4.3.0 | Pink fix, opposite pairs, shape/size images |
| v4.2.2 | AudioContext race condition fix |
| v4.0.0 | Vosk-browser SR + two-level navigation |
