# 🇬🇧 English Flashcards 4 Kids

> An audio-first English vocabulary app for young non-English speaking children (ages 3–8). No reading required — just images, sound, and voice.

![version](https://img.shields.io/badge/version-4.5.6-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android-orange)

---

## 🎯 How it works

The app speaks a word out loud. The child repeats it into the microphone. Built-in offline voice recognition evaluates the answer — no typing, no reading, just listening and speaking.

- ✅ If correct → confetti, stars, next word
- 🔁 If wrong → the word is repeated up to 2 more times with hints (slow replay → syllables)
- ⏭️ After 3 misses → word pushed to end of deck and revisited later

---

## 📱 Try it / Download

| | Link |
|---|---|
| 🌐 **Try online (Chrome)** | https://systemaromania.site/flashcards |
| 📱 **Download Android APK** | https://github.com/mirceadaneliuc/audio-flashcards-4-kids/releases/download/v4.5.10/Flashcards4Kids.apk |

> **Online version:** works best in Chrome or Edge. Speech recognition requires the Vosk model (~40MB download on first visit, then cached offline).
> **Android APK:** install by enabling "Unknown sources" in Android settings. Works fully offline.

---

## 📚 Content — 378 words across 17 categories

| Category | Words | Subcategories |
|:---------|------:|:--------------|
| 🐾 Animals | 65 | Farm, Jungle, Woods, Pets, Birds, Sea, Insects |
| 🍎 Food | 54 | Fruits, Vegetables, Dairy, Bakery, Drinks, Sweets |
| 🔢 Numbers | 30 | 1–10, 11–20, Tens |
| 🫀 Body | 28 | Face, Upper, Lower, Organs |
| 🌿 Nature | 29 | Weather, Plants, Landforms |
| 🏠 Home | 31 | Bedroom, Kitchen, Living Room, Bathroom |
| 🚀 Space | 18 | Space flashcards + Interactive Solar System map |
| 🍂 Seasons | 22 | Spring, Summer, Fall, Winter |
| 👕 Clothes | 20 | — |
| ❤️ Feelings | 10 | — |
| 🌈 Colors | 11 | — |
| 📏 Sizes | 12 | — |
| 🔷 Shapes | 8 | — |
| 👨‍👩‍👧 Family | 10 | Parents, Grandparents |
| 🚗 Transport | 14 | Land, Air, Water |
| 🎒 School | 16 | People, Places, Supplies |

---

## ✨ Special features

- **Interactive Solar System** — tap planets on the map to learn their names, pinch to zoom
- **Offline speech recognition** powered by [Vosk](https://alphacephei.com/vosk/) — works without internet after first load
- **Progressive hint system** — slow replay → syllable breakdown → skip
- **Stars, streaks & confetti** for motivation
- **Hundreds of illustrations** for visual learning
- **Version shown on splash screen**

---

## 🛠 Tech stack

- Vanilla JS + HTML5 — single file, no framework
- [Vosk-browser](https://github.com/ccoreilly/vosk-browser) for offline speech recognition
- [Capacitor](https://capacitorjs.com/) for Android APK packaging
- Hosted on GitHub Pages + cPanel

---

## 🏗 Build (Android)

```bash
cd ~/Github/audio-flashcards-4-kids
npx cap sync android && cd android
./gradlew clean assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

**Release APK:**
```bash
./gradlew clean assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## ⭐ Support the project

If you find this useful, please give it a star — it helps a lot!

---

## 📄 License

MIT — free to use, modify and distribute.
