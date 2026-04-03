# ENGLISH FLASHCARDS 4 KIDS — MASTER PLAN
**Version:** v4.0.0  
**Last updated:** 2025-04-03  
**Repo:** https://github.com/mirceadaneliuc/audio-flashcards-4-kids  
**Live web:** https://mirceadaneliuc.github.io/audio-flashcards-4-kids/  
**APK ID:** com.elzorab.flashcards

---

## ARCHITECTURE

```
audio-flashcards-4-kids/
├── docs/
│   ├── index.html              ← main app (v4.0.0) — Vosk SR + two-level nav
│   ├── words.json              ← 335 words, 16 categories, 60 subcategories
│   ├── test-vosk.html          ← Vosk speech test (WORKING, confirmed on tablet)
│   ├── vosk.js                 ← vosk-browser library (5.6MB)
│   ├── vosk-model-small-en-us-0.15.tar.gz  ← 40MB Vosk model (original)
│   ├── MASTER_PLAN.md          ← this file
│   └── config.js               ← HF token (gitignored)
├── android/
│   ├── app/src/main/java/com/elzorab/flashcards/MainActivity.java
│   │   └── COOP/COEP headers → enables SharedArrayBuffer for Vosk WASM
│   └── local.properties        ← sdk.dir=/home/elzorab/Android/Sdk
├── capacitor.config.json       ← appId: com.elzorab.flashcards, webDir: docs
└── package.json
```

**Critical Android note:** The model is stored in APK assets as  
`vosk-model-small-en-us-0.15.tar` (WITHOUT .gz — Android asset packager  
decompresses .gz files automatically, making it 70MB uncompressed).  
Code must reference `.tar` not `.tar.gz`.

---

## NAVIGATION FLOW

```
Splash → Category Menu → Subcategory Menu → Game → back to Subcategory Menu
```

- **Splash screen:** tap to start, triggers TTS unlock + Vosk load in background
- **Category Menu:** grid of 16 category cards with icon, label, word count
- **Subcategory Menu:** grid of subcategory cards for selected category; ⬅️ back to categories
- **Game:** audio flashcard loop; ⬅️ back to subcategory menu
- **Finish:** confetti + trophy, auto-returns to subcategory menu after 3s

---

## SPEECH RECOGNITION — VOSK-BROWSER ✅ CONFIRMED WORKING

**Decision:** Vosk-browser replaces native Android Speech Recognition.  
Native Android SR failed on short single-syllable words (numbers).  
Vosk tested on Lenovo TB311FU tablet with **100% accuracy** on all numbers  
and all single-syllable words tested.

**How it works in the APK:**
1. `vosk.js` loaded via `<script src="vosk.js">`
2. Model loaded at startup: `Vosk.createModel('vosk-model-small-en-us-0.15.tar')`
3. COOP/COEP headers in `MainActivity.java` enable `SharedArrayBuffer` (required by WASM)
4. Per-session `KaldiRecognizer` created with vocabulary grammar (only current deck words)
5. `ScriptProcessorNode` feeds mic audio chunks to Vosk at 48kHz (Vosk auto-corrects to 16kHz)
6. `result` event fires with final text → fuzzy-matched against target word
7. `partialresult` event shows real-time "hearing" feedback
8. 5-second timeout: if partial exists → evaluate it; if empty → count as miss

**Known acceptable limitation:** "sheep" ↔ "ship" confusion (acoustically identical in Vosk small model)

**MainActivity.java headers required:**
```java
response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
```

---

## GAME LOOP

1. Card shown → TTS speaks word automatically at 88% rate
2. Mic button enabled → child taps mic → Vosk listens (max 5s)
3. Match evaluation via fuzzy Levenshtein similarity:
   - 1–3 char words: threshold 0.60
   - 4–5 char words: threshold 0.68
   - 6+ char words: threshold 0.75
4. **Correct:** +10 stars, confetti, streak counter, advance to next card
5. **Miss 1:** replay word at 60% rate, try again
6. **Miss 2:** speak syllables individually + full word, try again
7. **Miss 3:** card pushed to end of deck ("try again later"), advance

---

## WORD DATABASE — words.json

**335 words / 16 categories / 60 subcategories**

| Category | Icon | Subcategories |
|----------|------|---------------|
| Animals | 🐾 | Farm, Wild, Pets, Birds, Sea, Insects |
| Food | 🍎 | Fruits, Vegetables, Dairy, Bakery, Drinks, Sweets |
| Colors | 🌈 | (single group) |
| Numbers | 🔢 | 1–10, 11–20, Tens |
| Shapes | 🔷 | (single group) |
| Sizes | 📏 | (single group) |
| Feelings | 💙 | (single group) |
| Body | 🫀 | Face, Upper Body, Lower Body |
| Home | 🏠 | Bedroom, Kitchen, Living Room, Bathroom |
| Nature | 🌿 | Weather, Plants, Space, Solar System, Landforms |
| Seasons | 🍂 | Spring, Summer, Fall, Winter |
| Clothes | 👕 | (single group) |
| Family | 👨‍👩‍👧 | (single group) |
| Transport | 🚗 | (single group) |
| School | 🎒 | (single group) |

**Future categories approved:** Letters, Greetings, Time, Actions/Verbs, Health  
**Special:** Solar System visual subcategory (planets on orbits) — planned separately

---

## BUILD COMMANDS

```bash
# Environment
export CAPACITOR_ANDROID_STUDIO_PATH=/snap/android-studio/209/bin/studio.sh

# Full build & deploy
cd ~/Github/audio-flashcards-4-kids
npx cap sync android
cd android && ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.elzorab.flashcards/.MainActivity

# Quick deploy (no JS changes)
cd ~/Github/audio-flashcards-4-kids/android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Git commit
cd ~/Github/audio-flashcards-4-kids
git add -A && git commit -m "v4.0.0 - Vosk SR + two-level navigation" && git push
```

---

## PENDING

1. **[NEXT]** Fix `sampleRate` warning — pass `audioContext.sampleRate` to `KaldiRecognizer` instead of hardcoded `16000` (Vosk auto-corrects anyway, low priority)
2. **[NEXT]** Fix Android status bar black bar overlapping app top
3. **[PLANNED]** Solar System visual subcategory — planets on orbital paths
4. **[PLANNED]** Signed release APK, app icon, splash screen
5. **[PLANNED]** Add word categories: Letters, Greetings, Time, Actions/Verbs, Health
6. **[PLANNED]** Migrate ScriptProcessorNode → AudioWorkletNode (currently deprecated but functional)

---

## COMPLETED

- ✅ v4.0.0 — Vosk-browser SR replaces native Android SR
- ✅ v4.0.0 — Two-level category/subcategory navigation
- ✅ v4.0.0 — All 335 words loaded dynamically from words.json
- ✅ Vosk confirmed working on tablet (100% accuracy on numbers + all tested words)
- ✅ COOP/COEP headers in MainActivity.java for SharedArrayBuffer
- ✅ Model served from APK assets as `.tar` (not `.tar.gz`)
- ✅ words.json — 335 words, 16 categories, 60 subcategories
- ✅ 3-strike progressive hint system (replay → syllables → skip)
- ✅ Native TTS via Capacitor plugin (TextToSpeech)
- ✅ Fuzzy Levenshtein matching with per-word-length thresholds
- ✅ Confetti, streak counter, star system
- ✅ Inline fallback data if words.json fails to load
- ✅ DTW approach tested and abandoned (voice-to-TTS mismatch)

---

## VERSION HISTORY

| Version | Changes |
|---------|---------|
| v4.0.0 | Vosk-browser SR + two-level navigation + words.json 335 words |
| v3.7.0 | Native Android SR (failed on short words) |
| v1.5.0 | Web-only, fuzzy matching, 8 categories |
