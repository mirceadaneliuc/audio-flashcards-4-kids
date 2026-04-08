# ENGLISH FLASHCARDS 4 KIDS — AI AGENT HANDOFF
> Last updated: 2026-04-08 | Version: v4.5.2
> This file enables any AI agent to understand the full project and continue work immediately.

---

## PROJECT OVERVIEW
Android + web app teaching English vocabulary to young non-English speaking children (ages 3–8).
- Audio-first: TTS speaks each word, child repeats into mic, Vosk speech recognition evaluates
- Two-level navigation: Category → Subcategory → Game (single-subcategory categories skip subcategory screen)
- Hosted on GitHub Pages + Android APK via Capacitor

---

## REPO & DEPLOYMENT
- **GitHub:** https://github.com/mirceadaneliuc/audio-flashcards-4-kids
- **User:** mirceadaneliuc / elzorab
- **Live web:** https://mirceadaneliuc.github.io/audio-flashcards-4-kids/
- **APK ID:** com.elzorab.flashcards
- **Local path:** ~/Github/audio-flashcards-4-kids/
- **Web files:** ~/Github/audio-flashcards-4-kids/docs/

---

## BUILD COMMANDS (always use clean)
```bash
cd ~/Github/audio-flashcards-4-kids
npx cap sync android
cd android
./gradlew clean assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.elzorab.flashcards/.MainActivity

git add docs/
git commit -m "vX.X.X - description"
git push
```

---

## FILE STRUCTURE
```
docs/
├── index.html          ← MAIN APP (v4.5.2) — single file, vanilla JS
├── words.json          ← ALL WORD DATA — 17 categories
├── MASTER_PLAN.md      ← version history
├── vosk.js             ← Vosk speech recognition library (5.6MB, do not edit)
├── vosk-model-small-en-us-0.15.tar.gz  ← 40MB model (do not edit)
└── img/                ← all images (PNG/JPG)
android/
└── app/src/main/java/com/elzorab/flashcards/MainActivity.java
    └── COOP/COEP headers → enables SharedArrayBuffer for Vosk WASM
capacitor.config.json   ← appId: com.elzorab.flashcards, webDir: docs
```

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

### Navigation flow
Splash → buildCatMenu() → showSubMenu(catKey) → startGame(catKey,subKey) → showCard() → _playCard() → startListening()

**Single-subcategory skip:** if a category has only 1 subcategory, `showSubMenu()` calls `startGame()` directly. Back button in `goMenu()` checks same condition and goes to cat screen directly.

### Game loop
1. `startGame()` — shuffles deck, applies consecutive pairs, fires TTS warm-up, shows GET READY 1.5s
2. `showCard()` — clears stale content, renders image/emoji (opacity:0 until loaded), speaks word after 600ms
3. `startListening()` — creates Vosk KaldiRecognizer with current deck vocabulary, opens mic, 5s/7s timeout
4. `evaluate()` — fuzzy Levenshtein match, thresholds: ≤3 chars=0.6, ≤5=0.68, 6+=0.75
5. `onCorrect()` — +10 stars, confetti, advance card
6. `onWrong()` — miss 1: replay slow; miss 2: syllables + word; miss 3: push to end of deck

### Speech recognition (Vosk)
- Model loaded at startup: `Vosk.createModel('vosk-model-small-en-us-0.15.tar')`
- COOP/COEP headers in MainActivity.java enable SharedArrayBuffer
- Per-card KaldiRecognizer with vocabulary grammar (current deck words only, deduped)
- ScriptProcessorNode feeds mic audio; 5s timeout (7s for words >6 chars)
- Partial fallback on timeout
- `stopListening()` properly async-closes AudioContext with `.catch(()=>{})`

### Consecutive pairs (sizes category)
After shuffle in `startGame()`, these pairs are always kept adjacent:
`[big,small], [long,short], [tall,short], [fat,thin], [heavy,light], [old,young]`
Short has two versions: `short.jpg` (trees, paired with tall) and `short_long.jpg` (pencils, paired with long).
Pair matching uses image field to distinguish.

### Image rendering
- Images shown at **360px** (all categories)
- Emojis shown at **220px** font-size
- Image loads with opacity:0 until fully loaded, then opacity:1 (prevents flash)
- Media element cleared immediately on `showCard()` and `startGame()` to prevent stale content

### TTS timing
- `startGame()`: speaks subcategory label, shows "GET READY... 🎯", hides card until first word loads
- `_playCard()`: speaks word 600ms after card shown, mic activates immediately after TTS completes
- `startListening()`: fires immediately after TTS callback (no 800ms delay)
- `navPrev/navNext`: 200ms delay before showCard()

### Known issues / Vosk quirks
- sampleRate 48000 warning on every recognizer creation — harmless, Vosk auto-corrects
- ScriptProcessorNode deprecated — functional, migration to AudioWorklet pending
- "pink" special case in evaluate(): if heard contains "ink/think/ping" → accept
- First word occasionally silent — TTS warm-up in startGame() mitigates this

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

## CATEGORIES & IMAGE COVERAGE
Format: category/subcategory — ✅=has image, ❌=emoji only

### animals
- farm: all ❌ (cow, pig, horse, sheep, chicken, goat, duck, donkey, turkey)
- jungle: all ❌ (lion, elephant, monkey, tiger, zebra, giraffe, crocodile, hippo)
- woods: all ❌ (bear, frog, wolf, deer, fox, owl, hedgehog, squirrel, rabbit, boar, badger)
- pets: all ❌ (dog, cat, rabbit, fish, hamster, parrot, turtle, guinea pig)
- birds: ✅ sparrow, crow | ❌ owl, eagle, penguin, parrot, flamingo, swan, pigeon
- sea: ✅ seahorse, turtle | ❌ fish, shark, whale, dolphin, crab, octopus, jellyfish, lobster
- insects: ✅ dragonfly, firefly, fly, spider | ❌ bee, butterfly, ant, ladybug, caterpillar, beetle

### food
- fruits: ✅ plum, pomegranate, raspberry | ❌ apple, banana, orange, strawberry, grape, watermelon, lemon, peach, pear, cherry, mango, pineapple, kiwi, blueberry
- vegetables: all ❌
- dairy: ✅ yogurt | ❌ milk, cheese, egg, butter
- bakery: ✅ bread | ❌ cake, cookie, pizza, muffin, pancake, toast, donut, pretzel, waffle
- drinks: ✅ water, lemonade, smoothie | ❌ juice, milk, tea
- sweets: ✅ ice cream, jelly | ❌ candy, chocolate, lollipop, cupcake

### colors — all ✅ (color pencil square images)

### numbers — all ❌ (1-10, 11-20, tens)

### shapes
- ✅ square, rectangle, oval | ❌ circle, triangle, star, heart, diamond

### sizes — all ✅ (big, small, tall, short×2, long, fat, thin, heavy, light, old, young)

### feelings
- ✅ happy, scared, excited, proud | ❌ sad, angry, surprised, tired, sick, bored

### body
- face: ✅ teeth, cheek, chin | ❌ eye, nose, mouth, ear, hair, tongue
- upper: ✅ head, neck, shoulder, chest, back | ❌ arm, hand, finger
- lower: ✅ hips, knee, toe | ❌ leg, foot
- organs: all ✅ (heart, brain, lungs, stomach, liver, kidneys)

### home
- bedroom: ✅ pillow, lamp, dresser | ❌ bed, clock, door, window
- kitchen: all ❌
- living: all ❌
- bathroom: all ❌

### nature
- weather: ✅ snow, storm, cloudy, fog | ❌ others
- plants: ✅ grass, bush, tree | ❌ others
- landforms: ✅ forest, island, lake, valley, hills, ocean, sea | ❌ mountain, volcano, desert, canyon

### space (new top-level category)
- space: ✅ asteroid, galaxy, astronaut, comet | ❌ moon, star, sun, earth, rocket, telescope
- solar: interactive map mode (tap planets) — solar_system.png with SVG hotspots

### seasons
- spring: ✅ spring, snowdrops | ❌ rainbow
- summer: ✅ summer | ❌ others
- fall: ✅ fall, acorn, leaves, harvest | ❌ wind, pumpkin
- winter: ✅ winter, snowman, fireplace, skiing, skating | ❌ snow, ice, hot chocolate

### clothes: ✅ coat, belt, tie, raincoat, sandals, swimsuit, sweater | ❌ others
### transport: ✅ hot_air_balloon | ❌ others
### home
- bedroom: ✅ pillow, lamp, dresser, closet | ❌ bed, clock, door, window
- kitchen: ✅ fridge, stove, cup, plate, fork, pot, bowl, pan | ❌ spoon, knife
- living: ✅ table, tv, armchair, painting, couch | ❌ sofa, books, light
- bathroom: ✅ towel | ❌ bathtub, soap, toothbrush, mirror

### family, school — all ❌

---

## IMAGES IN docs/img/
### Animals
sparrow.png, crow.png, seahorse.png, dragonfly.png, firefly.png, fly.png, spider.png, turtle.png

### Food
bread.png, water.png, lemonade.png, smoothie.png, yogurt.png, plum.png, raspberry.png, pomegranate.png, ice_cream.png, jelly.png

### Colors
color_red.png, color_blue.png, color_yellow.png, color_green.png, color_orange.png, color_purple.png, color_pink.png, color_white.png, color_black.png, color_brown.png, color_gray.png

### Shapes
oval.png, rectangle.png, square.png

### Sizes
big.jpg, small.jpg, tall.jpg, short.jpg, short_long.jpg, long.jpg, fat.jpg, thin.jpg, heavy.jpg, light.jpg, old.jpg, young.jpg

### Feelings
happy.png, scared.png, excited.png, proud.png

### Body
head.png, neck.png, shoulder.png, chest.png, back.png, hips.png, knee.png, toe.png, cheek.png, chin.png, teeth.png, heart.png, brain.png, lungs.png, stomach.png, liver.png, kidney.png

### Home
pillow.png, lamp.png, dresser.png

---

## RECENT VERSION HISTORY
| Version | Changes |
|---------|---------|
| v4.5.1 | Transport: hot air balloon image |
| v4.5.0 | Clothes images (coat, tie, belt, raincoat, sandals, swimsuit, sweater), mic active fix |
| v4.4.10 | Fix: mic faded during listening |
| v4.4.9 | Seasons: fall/winter images + words, spring snowdrops, mic/layout fixes |
| v4.4.8 | Fix: partial text height stable, mic shows listening immediately |
| v4.4.7 | Spring/summer images, snowdrops, ocean+sea added to landforms |
| v4.4.6 | Nature images (forest, island, lake), valley+hills added, asteroids cleanup |
| v4.4.5 | Solar system pixel-perfect hotspots (from user annotation), comet+asteroids clickable |
| v4.4.4 | Solar system hotspot radii match planet sizes exactly |
| v4.4.3 | Solar system planet hotspot positions fine-tuned |
| v4.4.2 | Solar system SVG hotspots fix planet tap accuracy |
| v4.4.1 | Solar system fixes: hotspot coords, mic buttons, pinch-to-zoom |
| v4.4.0 | Interactive solar system map — tap planets, free exploration mode |
| v4.3.10 | Weather images: snow, storm, cloudy, fog |
| v4.3.9 | Speak category name during GET READY, hide blank card; living room + bathroom updates |
| v4.3.8 | Hide blank card during GET READY |
| v4.3.7 | Kitchen images + bowl/pan added, bedroom closet |
| v4.3.6 | home/bedroom images (pillow, lamp, dresser added) |
| v4.3.5 | all organs images (heart, brain, lungs, stomach, liver, kidneys) |
| v4.3.4 | body images, organs subcategory, hip→hips, stale image fixes, TTS timing |
| v4.3.3 | insects icon 🐞, turtle in sea, body/face images, TTS warm-up fixes |
| v4.3.2 | feelings updates (emojis, images), global 2x image size, back button fix |
| v4.3.1 | long/short images, sizes skip subcategory screen, sizes 2x |
| v4.3.0 | pink fix, long word timeout, opposite pairs, shape/size images, fat/old/young |
| v4.2.2 | AudioContext race condition fix, stale grammar on card transition |
| v4.2.1 | Hotfix: closure bug causing wrong subcategory words |

---

## WORKING CONVENTIONS
- User saves files locally to the correct directory themselves — agent does NOT provide cp commands
- All changes accumulate in a pending list until user says "APC"
- APC = Apply + Present all changed files + Show git/build commands
- Version format: v4.X.Y — minor for new features, patch for fixes
- Agent reads full index.html before making code changes
- words.json edits done via Python script, never manually
- Images with black backgrounds → use Pillow to replace dark pixels with white
