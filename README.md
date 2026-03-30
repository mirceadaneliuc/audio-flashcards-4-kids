# 🌍 English Flashcards 4 Kids

> An audio-first English vocabulary app for young non-English speaking children. No reading required — just images, sound, and voice.

![English Flashcards 4 Kids](https://img.shields.io/badge/version-1.0.0-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android-orange)

---

## 🎯 What Is This?

**English Flashcards 4 Kids** is a vocabulary-building app designed for young children (ages 3–8) who are learning English as a second language. The entire experience is built around **audio and images** — the child does not need to read or write anything.

### How It Works

1. **A big emoji appears** on screen with the English word
2. **The app speaks the word** automatically
3. **The child taps the microphone** and repeats the word
4. If pronounced correctly (75%+ match), they advance to the next word 🎉
5. If not, the app **repeats the word more slowly**, then breaks it into **syllables** with visual highlighting, and asks the child to try again

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔊 **Auto-play audio** | Every new word is spoken automatically when the card appears |
| 🎤 **Voice recognition** | Child speaks into the mic — app checks pronunciation |
| 📊 **75% match threshold** | Fuzzy matching allows for slight accent variations |
| 🔤 **Syllable breakdown** | On wrong answer: word is broken into syllables with visual + audio highlights |
| 🐢 **Slow repetition** | First wrong attempt replays the word at a slower speed |
| 🏆 **Stars & streaks** | Points awarded per correct word, streak badge at 3+ in a row |
| 🎉 **Confetti celebrations** | Visual reward on each correct pronunciation |
| 📱 **Mobile-first design** | Large touch targets, designed for small fingers |
| 🌈 **8 categories** | Animals, Food, Colors, Numbers, Body, Home, Nature, Clothes |
| 📚 **100+ words** | Shuffled deck per session so it stays fresh |

---

## 📂 Categories & Words

| Category | Words |
|---|---|
| 🐾 Animals | dog, cat, lion, bird, fish, rabbit, elephant, monkey, frog, horse, duck, sheep, pig, cow, bee |
| 🍎 Food | apple, pizza, ice cream, banana, cake, cookie, bread, milk, egg, cheese, orange, carrot |
| 🎨 Colors | red, blue, yellow, green, orange, purple, pink, white, black, brown |
| 🔢 Numbers | one, two, three, four, five, six, seven, eight, nine, ten |
| 👁️ Body | eye, ear, nose, mouth, hand, foot, heart, arm, leg, hair |
| 🏠 Home | house, door, bed, book, chair, lamp, clock, key, cup, phone |
| 🌿 Nature | sun, moon, tree, snow, rain, star, flower, cloud, fire, leaf |
| 👕 Clothes | shirt, shoes, hat, pants, socks, dress, jacket, gloves, scarf |

---

## 🚀 Try It Live

👉 **[Open the app](https://YOUR_USERNAME.github.io/audio-flashcards-4-kids/)**

> Works best on **Chrome for Android** or any modern mobile browser over HTTPS.

---

## 🛠 Tech Stack

- **Pure HTML5 / CSS3 / JavaScript** — single file, zero dependencies, zero frameworks
- **Web Speech API** — `SpeechSynthesis` for text-to-speech, `SpeechRecognition` for voice input
- **Levenshtein distance** — fuzzy string matching for pronunciation scoring
- **CSS animations** — confetti, card bounce, syllable highlights, mic pulse
- **Google Fonts** — Fredoka One + Nunito for kid-friendly typography

---

## 📱 Browser Compatibility

| Browser | TTS | Mic / Speech Recognition |
|---|---|---|
| Chrome Android | ✅ | ✅ |
| Chrome Desktop | ✅ | ✅ (needs internet) |
| Brave Desktop | ⚠️ Needs espeak-ng | ❌ Blocked by privacy settings |
| Firefox | ✅ | ❌ Not supported |
| Safari iOS | ✅ | ✅ |

> **Recommended:** Chrome on Android or iOS Safari for full functionality.

---

## 📁 Project Structure

```
audio-flashcards-4-kids/
├── README.md               ← You are here
├── LICENSE
├── docs/
│   └── index.html          ← The full app (served by GitHub Pages)
└── capacitor/              ← Android APK build files (coming soon)
    ├── package.json
    ├── capacitor.config.json
    └── www/
        └── index.html
```

---

## 🏗 Roadmap

- [ ] Add more word categories (Transport, Sports, Weather, School)
- [ ] Parent dashboard with progress tracking
- [ ] Difficulty levels (easy = 1 syllable words first)
- [ ] Multiple language UI (Romanian, Spanish, French menus)
- [ ] Native Android APK via Capacitor
- [ ] Offline mode with cached voices
- [ ] Spaced repetition — review words the child got wrong more often

---

## 🤝 Contributing

Pull requests welcome! To add a new category:

1. Add an entry to the `CATS` object in `docs/index.html`
2. Each word needs: `w` (word), `e` (emoji), `s` (syllables array in uppercase)
3. Add 3 preview emojis for the menu card

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with ❤️ for kids learning English around the world.*
