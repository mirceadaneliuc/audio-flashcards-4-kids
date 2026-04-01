# 🌍 English Flashcards 4 Kids

> An audio-first English vocabulary app for young non-English speaking children. No reading required — just images, sound, and voice.

![version](https://img.shields.io/badge/version-3.4.0-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android-orange)

---

## 🚀 Try It Live

👉 **[Open the app](https://mirceadaneliuc.github.io/audio-flashcards-4-kids/)**

> Works best on **Chrome for Android** or any modern mobile browser over HTTPS.

---

## 🎯 What Is This?

**English Flashcards 4 Kids** is a vocabulary-building app designed for young children (ages 3–8) who are learning English as a second language. The entire experience is built around **audio and images** — the child does not need to read or write anything.

### How It Works

1. **A big emoji appears** on screen with the English word
2. **The app speaks the word** automatically
3. **The child taps the microphone** and repeats the word
4. If pronounced correctly (75%+ match), they advance to the next word 🎉
5. If not, the app **repeats the word more slowly**, then breaks it into **syllables** with visual highlighting
6. After 2 failed attempts the word is **skipped** and added to a retry pile
7. At the end of the deck, **all skipped words come back** for a second round

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔊 **Auto-play audio** | Every new word is spoken automatically when the card appears |
| 🎤 **Voice recognition** | Child speaks into the mic — app checks pronunciation |
| 📊 **75% match threshold** | Fuzzy matching allows for slight accent variations |
| 🔤 **Syllable breakdown** | On 2nd wrong answer: word broken into syllables with visual + audio highlights |
| 🐢 **Slow repetition** | 1st wrong attempt replays the word at a slower speed |
| ⏭️ **Smart skip** | After 2 failed attempts, word is skipped and revisited at the end |
| 🔁 **Retry round** | Failed words come back in a dedicated second round |
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

## 📋 Changelog

### v3.4.0 — 2026-04-01
- **JSGF grammar biasing:** tells Chrome exactly which word to listen for before each recognition session — Chrome heavily biases toward the target word and its known aliases, making short words like "five", "two", "ten" much more likely to be recognized
- This is how voice apps professionally solve single-word recognition — grammar hints are the standard solution

### v3.3.1 — 2026-04-01
- **Removed auto-mic:** Chrome on Android silently blocks programmatic mic activation — DuckDuckGo works because every session starts from a real user tap. Now child must tap 🎤 manually, ensuring Chrome grants full mic access every time

### v3.3.0 — 2026-04-01
- **Tap-to-confirm fallback for numbers:** after 2 failed voice attempts on any number, large digit buttons (1-10) appear inside the card — child taps the number they said to confirm and move on
- **Keeps learning flow:** numbers are hardest for Chrome SR with non-native children — this fallback ensures the session never stalls on numbers

### v3.2.3 — 2026-04-01
- **Number threshold lowered to 30%:** was 40%, still won't help empty results but catches more accent variations
- **Fixed aborted error causing spurious onWrong:** ERROR:aborted was triggering wrong-attempt counter when mic button was tapped

### v3.2.2 — 2026-04-01
- **Timer cancelled on any result event:** Chrome was delivering ['six'] AFTER the 2.5s timeout had already fired — now any result cancels the timer and resets it to 2s for the real result
- **Syllables spoken in lowercase:** fixes "EN" being spelled as letters E-N — TTS now speaks "en" as a natural sound

### v3.2.1 — 2026-04-01
- **Simplified recognition:** single session, 2.5s timeout, no restart loop
- **NO MATCH counts as wrong:** clean and fast — no more 5s waits or double mic sounds
- **Empty final waits:** if Chrome returns empty final, keeps waiting for real result within 2.5s window

### v3.2.0 — 2026-04-01
- **NO MATCH fully ignored:** only the 5s timeout ends a failed session — Chrome fires NO MATCH then the real result arrives, we no longer cut it off
- **Session auto-restart:** when Chrome closes the session early on Android (very common), we restart it silently keeping the mic blue
- **Seven syllable fix:** SE-VEN instead of SEV-VEN

### v3.1.0 — 2026-04-01
- **Removed phonetic syllable spelling:** AYT, FIYVE, WUN etc. removed — numbers show clean syllables (EIGHT, FIVE, ONE). Kids at this level don't know letters yet
- **NO MATCH 500ms delay:** waits half a second after NO MATCH before counting as wrong attempt — real Chrome result often arrives just after NO MATCH fires
- **Eight confirmed working** at threshold 0.4

### v3.0.0 — 2026-04-01
- **Fixed empty final result bug:** Chrome returns empty final then real result 100ms later — now ignores empty finals and waits for the real transcript
- **Number threshold lowered to 0.4:** numbers are hardest for non-native children — much more lenient matching
- **Seven syllables fixed:** "EN" was being spelled as letters E-N by TTS — changed to "SEV"+"VEN"
- **Eye/ear aliases expanded**

### v2.9.0 — 2026-04-01
- **continuous=true for recognition:** Chrome keeps the session open so short words like four/nine/eight have up to 5 seconds to be recognized instead of timing out immediately
- **NO MATCH ignored during continuous session:** only the 5s timeout or a final result closes the session — no more premature failures from Chrome cutting off too early
- **5 second auto-stop:** if no speech detected after 5s, uses whatever interim was captured or counts as wrong attempt

### v2.8.0 — 2026-04-01
- **Mic button debounced 800ms:** tablet was registering multiple taps per press, causing rapid repeated recognition sessions and NO MATCH spam
- **NO MATCH counts as attempt:** Chrome returning nothing IS a failed attempt — 3 strikes still works even when Chrome can't hear short words
- **Auto-mic restored:** 600ms after word plays, mic starts automatically with busy guard to prevent conflicts

### v2.7.0 — 2026-03-31
- **Removed auto-mic:** was causing race conditions with onWrong TTS — child taps mic manually after hearing the word
- **Fixed aborted error:** stopListening now nulls recog BEFORE calling abort(), so stale error events from dying sessions are ignored
- **Fixed word only spoken once:** removed synth.cancel() from startListening — onWrong TTS no longer gets cancelled when mic button is tapped
- **3-strike flow now works cleanly:** 1st=slow replay, 2nd=syllables, 3rd=move to back of queue

### v2.6.0 — 2026-03-31
- **NO MATCH no longer counts as wrong attempt:** when Chrome hears nothing (silence, background noise, short vowel sounds) the mic just re-enables silently — only actual speech that doesn't match counts as a fail
- **Numbers fix:** "one", "two", "six" etc. were consuming all 3 attempts via empty NO MATCH before child could even speak

### v2.5.0 — 2026-03-31
- **3-strike system:** 1st fail=slow replay, 2nd fail=syllable breakdown, 3rd fail=word moved to back of deck
- **Move to back of queue:** failed words get pushed to end of deck and come back later in the session
- **Always advances:** after 3rd fail app always moves to next word — never gets stuck

### v2.4.0 — 2026-03-31
- **Scrapped retry system** — was causing multiple simultaneous sessions, random behaviour, stuck buttons
- **Clean single-shot recognition** — one session per tap, 100ms startup gap, interim capture still active for short words
- **Fixed stuck 🔊/🎤 button sounds** — stopListening now properly clears wave animation and speaking class
- **onend fallback** — if Chrome ends session without result but has interim, uses interim; otherwise re-enables mic for manual retry

### v3.4.0 — 2026-04-01
- **JSGF grammar biasing:** tells Chrome exactly which word to listen for before each recognition session — Chrome heavily biases toward the target word and its known aliases, making short words like "five", "two", "ten" much more likely to be recognized
- This is how voice apps professionally solve single-word recognition — grammar hints are the standard solution

### v3.3.1 — 2026-04-01
- **Removed auto-mic:** Chrome on Android silently blocks programmatic mic activation — DuckDuckGo works because every session starts from a real user tap. Now child must tap 🎤 manually, ensuring Chrome grants full mic access every time

### v3.3.0 — 2026-04-01
- **Tap-to-confirm fallback for numbers:** after 2 failed voice attempts on any number, large digit buttons (1-10) appear inside the card — child taps the number they said to confirm and move on
- **Keeps learning flow:** numbers are hardest for Chrome SR with non-native children — this fallback ensures the session never stalls on numbers

### v3.2.3 — 2026-04-01
- **Number threshold lowered to 30%:** was 40%, still won't help empty results but catches more accent variations
- **Fixed aborted error causing spurious onWrong:** ERROR:aborted was triggering wrong-attempt counter when mic button was tapped

### v3.2.2 — 2026-04-01
- **Timer cancelled on any result event:** Chrome was delivering ['six'] AFTER the 2.5s timeout had already fired — now any result cancels the timer and resets it to 2s for the real result
- **Syllables spoken in lowercase:** fixes "EN" being spelled as letters E-N — TTS now speaks "en" as a natural sound

### v3.2.1 — 2026-04-01
- **Simplified recognition:** single session, 2.5s timeout, no restart loop
- **NO MATCH counts as wrong:** clean and fast — no more 5s waits or double mic sounds
- **Empty final waits:** if Chrome returns empty final, keeps waiting for real result within 2.5s window

### v3.2.0 — 2026-04-01
- **NO MATCH fully ignored:** only the 5s timeout ends a failed session — Chrome fires NO MATCH then the real result arrives, we no longer cut it off
- **Session auto-restart:** when Chrome closes the session early on Android (very common), we restart it silently keeping the mic blue
- **Seven syllable fix:** SE-VEN instead of SEV-VEN

### v3.1.0 — 2026-04-01
- **Removed phonetic syllable spelling:** AYT, FIYVE, WUN etc. removed — numbers show clean syllables (EIGHT, FIVE, ONE). Kids at this level don't know letters yet
- **NO MATCH 500ms delay:** waits half a second after NO MATCH before counting as wrong attempt — real Chrome result often arrives just after NO MATCH fires
- **Eight confirmed working** at threshold 0.4

### v3.0.0 — 2026-04-01
- **Fixed empty final result bug:** Chrome returns empty final then real result 100ms later — now ignores empty finals and waits for the real transcript
- **Number threshold lowered to 0.4:** numbers are hardest for non-native children — much more lenient matching
- **Seven syllables fixed:** "EN" was being spelled as letters E-N by TTS — changed to "SEV"+"VEN"
- **Eye/ear aliases expanded**

### v2.9.0 — 2026-04-01
- **continuous=true for recognition:** Chrome keeps the session open so short words like four/nine/eight have up to 5 seconds to be recognized instead of timing out immediately
- **NO MATCH ignored during continuous session:** only the 5s timeout or a final result closes the session — no more premature failures from Chrome cutting off too early
- **5 second auto-stop:** if no speech detected after 5s, uses whatever interim was captured or counts as wrong attempt

### v2.8.0 — 2026-04-01
- **Mic button debounced 800ms:** tablet was registering multiple taps per press, causing rapid repeated recognition sessions and NO MATCH spam
- **NO MATCH counts as attempt:** Chrome returning nothing IS a failed attempt — 3 strikes still works even when Chrome can't hear short words
- **Auto-mic restored:** 600ms after word plays, mic starts automatically with busy guard to prevent conflicts

### v2.7.0 — 2026-03-31
- **Removed auto-mic:** was causing race conditions with onWrong TTS — child taps mic manually after hearing the word
- **Fixed aborted error:** stopListening now nulls recog BEFORE calling abort(), so stale error events from dying sessions are ignored
- **Fixed word only spoken once:** removed synth.cancel() from startListening — onWrong TTS no longer gets cancelled when mic button is tapped
- **3-strike flow now works cleanly:** 1st=slow replay, 2nd=syllables, 3rd=move to back of queue

### v2.6.0 — 2026-03-31
- **NO MATCH no longer counts as wrong attempt:** when Chrome hears nothing (silence, background noise, short vowel sounds) the mic just re-enables silently — only actual speech that doesn't match counts as a fail
- **Numbers fix:** "one", "two", "six" etc. were consuming all 3 attempts via empty NO MATCH before child could even speak

### v2.5.0 — 2026-03-31
- **3-strike system:** 1st fail=slow replay, 2nd fail=syllable breakdown, 3rd fail=word moved to back of deck
- **Move to back of queue:** failed words get pushed to end of deck and come back later in the session
- **Always advances:** after 3rd fail app always moves to next word — never gets stuck

### v2.4.0 — 2026-03-31
- **Simplified recognition:** removed retry chain entirely — one clean session per tap, NO MATCH uses interim if available, otherwise calls onWrong()
- **Fixed buttons stuck active:** added 5s safety timeout to remove .speaking class and wave animation in case Chrome never fires onend
- **showCard always cancels TTS first** to prevent overlapping speech

### v2.3.0 — 2026-03-31
- **Fixed double-press bug:** abort error from previous session no longer resets retry counter — 300ms gap between retries lets old session fully close
- **Fixed hang after retries:** when all 3 retries exhaust with no result, now correctly calls onWrong() so slow-repeat and syllable feedback plays normally
- **handled flag:** prevents double-handling when multiple recognition events fire for the same attempt

### v2.2.0 — 2026-03-31
- **Silent retry logic:** when Chrome returns NO MATCH or empty result, app automatically retries up to 3 times (200ms gap) before giving up — child says "nine" once and Chrome gets multiple chances to recognise it
- **No visual change during retry** — mic stays blue, status stays "LISTENING..." so child doesn't know it's retrying

### v2.1.0 — 2026-03-31
- **Expanded digit map:** "11"→one, "3 3"→three, "nine nine"→nine, "serv en"→seven, and all double-digit patterns now mapped
- **Disabled continuous mode:** was causing double captures ("nine nine", "3 3") and extra noise — back to single-shot with interim capture
- **"serv en" recognized as seven:** 0.71 score passes the 0.68 threshold correctly

### v2.0.0 — 2026-03-31
- **Fixed infinite loop:** auto-mic only fires on first card presentation, not after wrong answers — child must tap mic to retry
- **Auto-mic delay: 800ms → 500ms**
- **Digit recognition for numbers:** Chrome returns "8", "8 8", "10" etc. instead of words — now converts digits to words before matching (8→eight, 10→ten, 2→two etc.)
- **DIGIT_WORDS map:** pre-evaluation digit→word conversion catches all numeric speech recognizer outputs

### v1.9.0 — 2026-03-31
- **Auto-mic:** microphone starts automatically 0.8s after the word finishes playing — child just listens then speaks without tapping
- **Continuous mode for short words:** words with 5 or fewer characters use continuous recognition with a 4s window, giving Chrome much more time to capture short sounds like "one", "two", "six", "ten"
- **bee → bear:** replaced bee (unrecognizable by Chrome SR — pure vowel with no consonant anchor) with bear 🐻

### v1.8.0 — 2026-03-31
- Replace bee with bear

### v1.7.0 — 2026-03-31
- **Root cause fix for bee/short words:** Chrome fires `NO MATCH` instead of `onresult` for very short words — now captures interim transcripts before Chrome drops them, so "bee", "two", "egg" etc. are rescued from the interim buffer
- **interimResults:true:** recognition now reads partial results as they come in, giving a second chance before Chrome discards low-confidence short words

### v1.6.0 — 2026-03-30
- **Comprehensive alias coverage for ALL single-syllable words:** egg, arm, foot, ear, numbers (one through ten), red, blue, sun, star, fire, rain, snow, bed, key, cup, hat, and more — each with 15-25 phonetic aliases
- **Three-tier match threshold:** 4-letter words use 55%, 5-6 letter words use 68%, longer words use 75% — makes short words much more forgiving
- **Improved article stripping:** alias check also strips "a/an/the" before matching

### v1.5.0 — 2026-03-30
- **Layout rebuilt:** 🔊 always fixed to left screen edge, 🎤 always fixed to right screen edge — works in portrait and landscape with no media queries
- **◀ ▶ arrows** moved inside the card itself — always visible regardless of orientation
- **Duck/Bee recognition massively expanded:** alias table now covers 10+ mishearings per word; article stripping catches "a duck", "the bee"; first-letter match for single-char returns like "B"
- **Lower threshold for short words:** 3-letter words (bee, cow, pig, egg) use 60% match instead of 75%

### v1.4.0 — 2026-03-30
- **Navigation arrows:** ◀ ▶ buttons let the child skip forward or go back to any word freely
- **Duck/Bee/short word fix:** added alias table for known speech recognizer mishearings (duck→doc/dak/dark, bee→be/b, egg→eg, etc.) + token-level matching now catches "a duck", "the bee"
- **Wrong answer simplified:** 1st fail = slow replay, 2nd fail = syllable breakdown — mic always re-enables after each, child never gets stuck
- **Tablet landscape layout:** in landscape mode on wide screens, 🔊 speaker pinned to far left edge, 🎤 mic pinned to far right edge — reachable by small thumbs without stretching
- **Menu landscape:** category grid switches to 4 columns in landscape

### v1.3.0 — 2026-03-30
- **Skip on 2nd fail:** after 2 wrong attempts the app plays syllable breakdown then automatically moves on — no more getting stuck on one word
- **Retry round preserved:** skipped words still come back at the end of the deck
- **Button layout:** 🔊 speaker moved to bottom-left (left thumb), 🎤 mic moved to bottom-right (right thumb)
- **Larger buttons:** both buttons increased in size for easier tapping by small fingers

### v1.2.0 — 2026-03-30
- **Retry round:** after completing the deck, all words the child failed to pronounce come back in a dedicated second round ("Let's try the tricky ones!")
- **Smart skip:** after 2 failed attempts on the same word, the app skips it with "We'll try again later!" instead of looping forever
- **Short word recognition fix:** improved fuzzy matching for short words (3–4 letters like "bee", "cat", "pig") — now correctly matches "the bee", "a bee", "B" etc.

### v1.1.0 — 2026-03-30
- Rebuilt as pure HTML5 single-file app (no framework dependencies)
- Added syllable-by-syllable breakdown with animated highlights on 2nd wrong attempt
- Added attempt dots indicator (3 dots showing how many tries used)
- Added streak badge (fires at 3+ correct in a row)
- Fixed TTS AudioContext unlock on mobile browsers

### v1.0.0 — 2026-03-30
- Initial release
- 8 categories, 100+ words with emoji
- Auto-play TTS on card appear
- Voice recognition with 75% fuzzy match threshold
- Confetti and star reward system
- Mobile-first responsive design

---

## 🛠 Tech Stack

- **Pure HTML5 / CSS3 / JavaScript** — single file, zero dependencies, zero frameworks
- **Web Speech API** — `SpeechSynthesis` for TTS, `SpeechRecognition` for voice input
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
└── docs/
    └── index.html          ← The full app (served by GitHub Pages)
```

---

## 🏗 Roadmap

- [ ] Add more word categories (Transport, Sports, Weather, School)
- [ ] Parent dashboard with progress tracking
- [ ] Difficulty levels (easy = 1 syllable words first)
- [ ] Multiple language UI (Romanian, Spanish, French menus)
- [ ] Native Android APK via Capacitor
- [ ] Offline mode with cached voices
- [ ] Spaced repetition — weight retry words higher in future sessions

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
