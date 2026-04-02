# English Flashcards 4 Kids — Master Plan
*Last updated: April 2, 2026*

---

## Vision
A vocabulary learning app for children aged 3–8, non-native English speakers.
Audio-first: emoji + TTS + voice recognition. No reading required at entry level.
Grows with the child from single words → subcategories → sentences.
Target: 1000+ users, universal device support, offline-capable.

---

## Current State
- **Version:** v3.7.0
- **Platform:** Android APK via Capacitor + GitHub Pages (web testing)
- **Repo:** https://github.com/mirceadaneliuc/audio-flashcards-4-kids
- **Live URL:** https://mirceadaneliuc.github.io/audio-flashcards-4-kids/
- **Local path:** ~/Github/audio-flashcards-4-kids/
- **Structure:** docs/index.html served by GitHub Pages + Capacitor APK

---

## Architecture

### App Structure
```
audio-flashcards-4-kids/
├── docs/
│   ├── index.html          ← single-file app
│   ├── words.json          ← master word database
│   ├── fingerprints.json   ← auto-generated MFCC fingerprints (DTW)
│   ├── config.js           ← API tokens (gitignored)
│   └── config.example.js   ← token template
├── android/                ← Capacitor Android project
├── capacitor.config.json
├── package.json
└── .gitignore
```

### Navigation Flow
```
Splash → Category Menu → Subcategory Menu → Flashcard Game → Back
```
- Child can go back to subcategory menu or all the way to category menu
- Each subcategory is playable independently

### Flashcard Game Flow
1. Card appears (emoji + word)
2. TTS plays the word automatically
3. Mic activates → child speaks
4. Recognition engine evaluates
5. Correct → confetti + stars + next word
6. Wrong attempt 1 → slow TTS replay
7. Wrong attempt 2 → syllable breakdown + TTS
8. Wrong attempt 3 → word pushed to back of deck, advance

---

## Speech Recognition — Roadmap

### Current (v3.7.0) — Capacitor Native Android SR
- Uses `@capacitor-community/speech-recognition` plugin
- Works for most words, fails on very short words (numbers)
- `partialResults:true` mode gives best results
- 5 second timeout safety net

### Next Phase — DTW (Dynamic Time Warping) Engine
**Goal:** 100% offline, no API keys, works on any device, 500+ word vocabulary

**How it works:**
1. **Reference samples:** TTS speaks each word → audio recorded → MFCC features extracted → saved to `fingerprints.json`
2. **Recognition:** Child speaks → record 2-3 seconds → extract MFCC → DTW compare against all fingerprints → best match wins
3. **Adding new words:** Add to `words.json` → run `build-fingerprints.html` → rebuild APK

**Tools to build:**
- `build-fingerprints.html` — browser tool: iterates all words, speaks via TTS, records audio, extracts MFCC, saves fingerprints.json
- DTW engine in JavaScript (~300 lines) embedded in index.html
- Accuracy: 90%+ for adult voices, 80%+ for children with tolerance tuning

**Short word strategy:**
- Numbers and very short words (one, two, six) may need lower DTW threshold
- Tune per-word thresholds based on testing
- 3-strike system gives 3 attempts before advancing

---

## Word Database — words.json

### Current: 335 words / 16 categories / 60 subcategories

### Categories & Subcategories

| Category | Subcategories | Words |
|---|---|---|
| 🐾 Animals | Farm, Wild, Pets, Birds, Sea Animals, Insects | ~65 |
| 🍎 Food | Fruits, Vegetables, Dairy, Bakery, Drinks, Sweets | ~55 |
| 🎨 Colors | Basic Colors | 11 |
| 🔢 Numbers | 1-10, 11-20, Tens | 30 |
| 🔷 Shapes | Basic Shapes | 8 |
| 📏 Sizes | Basic Sizes | 10 |
| 😊 Feelings | Basic Feelings | 10 |
| 💪 Body | Face, Upper Body, Lower Body | ~23 |
| 🏠 Home | Bedroom, Kitchen, Living Room, Bathroom | ~28 |
| 🌿 Nature | Weather, Plants, Space, Solar System, Landforms | ~40 |
| 🍂 Seasons | Spring, Summer, Fall, Winter | 20 |
| 👕 Clothes | Everyday, Accessories, Seasonal | ~19 |
| 👨‍👩‍👧 Family | Immediate, Extended | 10 |
| 🚗 Transport | Land, Air, Water | ~16 |
| 🏫 School | Supplies, People, Places | ~17 |

### Future Categories (approved for next expansion)
- 🔤 Letters (A-Z)
- 🗣️ Greetings (hello, goodbye, please, thank you, sorry)
- ⏰ Time (morning, night, today, yesterday, now, later)
- 🎭 Actions/Verbs (run, jump, eat, sleep, play, read, swim)
- 🏥 Health (doctor, medicine, hurt, sick, better, hospital)

### Special: Solar System Visual
- Planets displayed on orbits around the sun (separate visual subcategory)
- Tap planet → hear name → say name
- Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune

---

## Packaging — Capacitor

### Build Commands
```bash
# After updating docs/index.html or words.json:
cd ~/Github/audio-flashcards-4-kids
npx cap sync android
cd android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.elzorab.flashcards/.MainActivity
```

### Key Files
- `capacitor.config.json` — app ID: `com.elzorab.flashcards`
- `android/local.properties` — SDK path: `/home/elzorab/Android/Sdk`
- Capacitor plugins: `@capacitor-community/speech-recognition@7.0.1`, `@capacitor-community/text-to-speech@8.0.0`

### Environment
```bash
export CAPACITOR_ANDROID_STUDIO_PATH=/snap/android-studio/209/bin/studio.sh
```

---

## UI/UX Principles
- No reading required — emoji + audio only at entry level
- All text UPPERCASE for easy visual recognition
- 🔊 hear button: fixed to LEFT screen edge (portrait + landscape)
- 🎤 mic button: fixed to RIGHT screen edge (portrait + landscape)
- ◀ ▶ arrows: inside card, child can skip words
- Black bar at top (Android status bar) — to be addressed in production build
- Debug panel (🔍 button) — visible during development, remove before production release

---

## Testing Setup
- **Tablet:** Lenovo TB311FU, Android, Chrome v146
- **USB debugging:** enabled, connected via USB to desktop
- **DevTools:** brave://inspect/#devices on desktop Brave browser
- **Local server:** `python3 -m http.server 8766` in docs/ folder
- **Version visible:** top-left logo shows current version number

---

## Version History (key milestones)
- v1.0.0 — Initial release, 8 categories, 100+ words
- v1.5.0 — Fixed edge buttons, arrows inside card
- v2.0.0 — Digit recognition for numbers, fixed infinite loop
- v2.5.0 — 3-strike system with word pushed to back of deck
- v2.8.0 — Mic debounce 800ms (tablet multi-tap fix)
- v3.0.0 — Fixed empty final result bug, number threshold 0.3
- v3.3.0 — Tap-to-confirm number fallback
- v3.5.0 — Replaced Web Speech API with Hugging Face Whisper (blocked by GitHub secret scanning)
- v3.6.x — Capacitor APK, native Android TTS + SR, dual-mode recognition
- v3.7.0 — Clean architecture, partialResults SR, 5s timeout, stable 3-strike flow

---

## Known Issues / Next Steps
1. **Numbers recognition** — Android SR still struggles with short words (one, two, six, ten). **Fix: DTW engine** (next phase)
2. **Black bar at top** — Android status bar overlapping app. Fix: add `android:windowFullscreen` or use Capacitor status bar plugin
3. **Debug panel** — remove 🔍 button before production release
4. **Fingerprint generator** — build `build-fingerprints.html` tool
5. **DTW engine** — implement MFCC extraction + DTW matching in JavaScript
6. **Category/subcategory navigation** — update index.html to use words.json and two-level menu
7. **Solar System visual** — special interactive subcategory with planet orbits
8. **Production APK** — signed release build, app icon, splash screen
