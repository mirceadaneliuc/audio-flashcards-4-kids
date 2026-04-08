# ENGLISH FLASHCARDS 4 KIDS — AI AGENT HANDOFF
> Last updated: 2026-04-08 | Version: v4.5.0
> This file enables any AI agent to understand the full project and continue work immediately.

---

## PROJECT OVERVIEW
Android + web app teaching English vocabulary to young non-English speaking children (ages 3-8).
- Audio-first: TTS speaks each word, child repeats into mic, Vosk speech recognition evaluates
- Two-level navigation: Category -> Subcategory -> Game (single-subcategory categories skip subcategory screen)
- Special mode: Solar System has its own interactive tap-the-planet screen (not the standard game loop)
- Hosted on GitHub Pages + Android APK via Capacitor

---

## REPO & DEPLOYMENT
- GitHub: https://github.com/mirceadaneliuc/audio-flashcards-4-kids
- User: mirceadaneliuc / elzorab
- Live web: https://mirceadaneliuc.github.io/audio-flashcards-4-kids/
- APK ID: com.elzorab.flashcards
- Local path: ~/Github/audio-flashcards-4-kids/
- Web files: ~/Github/audio-flashcards-4-kids/docs/

---

## BUILD COMMANDS (always use clean)
cd ~/Github/audio-flashcards-4-kids
npx cap sync android
cd android
./gradlew clean assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.elzorab.flashcards/.MainActivity

git add docs/
git commit -m "vX.X.X - description"
git push

---

## FILE STRUCTURE
docs/
  index.html         - MAIN APP (v4.5.0) single file, vanilla JS
  words.json         - ALL WORD DATA 16 categories
  MASTER_PLAN.md     - version history
  vosk.js            - Vosk speech recognition library 5.6MB do not edit
  vosk-model-small-en-us-0.15.tar.gz  - 40MB model do not edit
  img/               - all images PNG/JPG
android/
  app/src/main/java/com/elzorab/flashcards/MainActivity.java
    COOP/COEP headers enable SharedArrayBuffer for Vosk WASM
capacitor.config.json  - appId: com.elzorab.flashcards, webDir: docs
AGENT_HANDOFF.md       - this file (repo root)

---

## ARCHITECTURE: index.html

### Key globals
- WORDS_DATA -- loaded from words.json
- deck[] -- shuffled array of word objects for current subcategory
- idx -- current card index
- attempts -- miss counter (resets each card)
- busy -- prevents double-firing
- listening -- mic active flag
- voskReady -- Vosk model loaded flag
- currentCat, currentSub -- current navigation state

### Navigation flow
Splash -> buildCatMenu() -> showSubMenu(catKey) -> startGame(catKey,subKey) -> showCard() -> _playCard() -> startListening()

Single-subcategory skip: if a category has only 1 subcategory, showSubMenu() calls startGame() directly.
Back button in goMenu() checks same condition and goes to cat screen directly.

Solar System special case: in startGame(), if subKey === 'solar', calls startSolarGame() instead.
Solar System has its own screen (#solar-screen), dark space background, interactive tap-the-planet
image with hotspots, and its own feedback/back button logic.

### Standard game loop
1. startGame() -- shuffles deck, applies consecutive pairs, fires TTS warm-up, clears stale content, shows GET READY 1.5s
2. showCard() -- clears media element (opacity:0), renders image/emoji once loaded (opacity:1), speaks word after 600ms
3. startListening() -- creates Vosk KaldiRecognizer with deduped deck vocabulary, opens mic, 5s/7s timeout
4. evaluate() -- fuzzy Levenshtein match, thresholds: <=3 chars=0.6, <=5=0.68, 6+=0.75
5. onCorrect() -- +10 stars, confetti, advance card
6. onWrong() -- miss 1: replay slow; miss 2: syllables + word; miss 3: push to end of deck

### Speech recognition (Vosk)
- Model loaded at startup: Vosk.createModel('vosk-model-small-en-us-0.15.tar')
- COOP/COEP headers in MainActivity.java enable SharedArrayBuffer
- Per-card KaldiRecognizer with vocabulary grammar (current deck words only, deduped with Set)
- ScriptProcessorNode feeds mic audio; 5s timeout (7s for words >6 chars)
- Partial fallback on timeout
- stopListening() properly async-closes AudioContext with .catch(()=>{})

### Consecutive pairs (sizes category)
After shuffle in startGame(), these pairs are always kept adjacent:
[big,small], [long,short], [tall,short], [fat,thin], [heavy,light], [old,young]
Short has two versions: short.jpg (trees, paired with tall) and short_long.jpg (pencils, paired with long).
Pair matching uses image field to distinguish the two "short" entries.

### Image rendering
- Images shown at 360px (all categories)
- Emojis shown at 220px font-size
- Image loads with opacity:0 until fully loaded, then opacity:1 (prevents flash)
- Media element cleared immediately on showCard() and startGame() to prevent stale content

### TTS timing (Android native TTS via Capacitor)
- speak(): calls _TTS.stop() then 100ms later fires new speak; estimated duration = max(1200, length*120)ms
- startGame(): fires silent warm-up speak, clears stale content, shows GET READY for 1.5s before first card
- _playCard(): speaks word 600ms after card shown
- startListening(): fires 800ms after TTS estimated completion callback
- navPrev/navNext: 200ms delay before showCard()

### Known issues / Vosk quirks
- sampleRate 48000 warning on every recognizer creation -- harmless, Vosk auto-corrects
- ScriptProcessorNode deprecated -- functional, migration to AudioWorklet pending
- "pink" special case in evaluate(): if heard contains "ink/think/ping" -> accept
- First word occasionally silent -- TTS warm-up + GET READY delay in startGame() mitigates this

---

## words.json STRUCTURE
{
  "category_key": {
    "label": "DISPLAY NAME",
    "icon": "emoji",
    "color": "#RRGGBB",
    "subcategories": {
      "sub_key": {
        "label": "SUB DISPLAY NAME",
        "icon": "emoji",
        "words": [
          {"w": "word", "e": "emoji", "s": ["SYL","LA","BLES"], "img": "img/filename.png"}
        ]
      }
    }
  }
}
Fields: w=word, e=emoji fallback, s=syllables for miss-2 hint, img=optional image path relative to docs/

---

## CATEGORIES & IMAGE COVERAGE (v4.5.0)
Format: YES=has image, NO=emoji only

### animals (icon:animal paw, color:#FF6B6B)
- farm: all NO -- cow, pig, horse, sheep, chicken, goat, duck, donkey, turkey
- jungle: all NO -- lion, elephant, monkey, tiger, zebra, giraffe, crocodile, hippo
- woods: all NO -- bear, frog, wolf, deer, fox, owl, hedgehog, squirrel, rabbit, boar, badger
- pets: all NO -- dog, cat, rabbit, fish, hamster, parrot, turtle, guinea pig
- birds: YES sparrow,crow | NO owl,eagle,penguin,parrot,flamingo,swan,pigeon
- sea: YES seahorse,turtle | NO fish,shark,whale,dolphin,crab,octopus,jellyfish,lobster
- insects (icon:ladybug): YES dragonfly,firefly,fly,spider | NO bee,butterfly,ant,ladybug,caterpillar,beetle

### food (color:#FFA94D)
- fruits: YES plum,pomegranate,raspberry | NO apple,banana,orange,strawberry,grape,watermelon,lemon,peach,pear,cherry,mango,pineapple,kiwi,blueberry
- vegetables: all NO -- carrot,potato,tomato,broccoli,corn,onion,pepper,cucumber,pea,garlic
- dairy: YES yogurt | NO milk,cheese,egg,butter
- bakery: YES bread | NO cake,cookie,pizza,muffin,pancake,toast,donut,pretzel,waffle
- drinks: YES water,lemonade,smoothie | NO juice,milk,tea
- sweets: YES ice cream,jelly | NO candy,chocolate,lollipop,cupcake

### colors (color:#CC5DE8) -- all YES, pencil square images for all 11 colors

### numbers (color:#339AF0) -- all NO (1-10, 11-20, tens)

### shapes (color:#20C997)
- YES square,rectangle,oval | NO circle,triangle,star,heart,diamond

### sizes (color:#FFA94D) -- all YES
- big,small,tall,short(trees),long,short(pencils),fat,thin,heavy,light,old,young

### feelings (icon:red heart, color:#339AF0)
- YES happy,scared,excited,proud | NO sad,angry,surprised,tired,sick,bored

### body (color:#FF6B6B)
- face: YES teeth,cheek,chin | NO eye,nose,mouth,ear,hair,tongue
- upper: YES head,neck,shoulder,chest,back | NO arm,hand,finger
- lower: YES hips,knee,toe | NO leg,foot
- organs: all YES -- heart,brain,lungs,stomach,liver,kidneys

### home (color:#845EF7)
- bedroom: YES pillow,lamp,dresser,closet | NO bed,clock,door,window
- kitchen: YES fridge,stove,cup,plate,fork,pot,bowl,pan | NO spoon,knife
- living: YES table,tv,armchair,painting,couch | NO sofa,books,light
- bathroom: YES towel | NO bathtub,soap,toothbrush,mirror

### nature (color:#51CF66)
- weather: YES snow,storm,cloudy,fog | NO sun,rain,wind,cloud,rainbow
- plants: YES grass,bush | NO tree,flower,leaf,rose,cactus,mushroom
- landforms: YES forest,lake,island,valley,hills,ocean,sea | NO mountain,river,beach,desert,volcano

### space (color:#3D3D8F) -- NEW CATEGORY in v4.5.0
- space: YES asteroid,galaxy,astronaut,comet | NO moon,star,sun,earth,rocket,telescope
- solar: all NO -- mercury,venus,earth,mars,jupiter,saturn,uranus,neptune
  NOTE: solar subKey triggers startSolarGame() -- special interactive screen, NOT standard game loop

### seasons (color:#FFA94D)
- spring: YES spring,snowdrops | NO rainbow
- summer: YES summer,ice cream | NO sun,beach,butterfly
- fall: YES fall,leaves,acorn,harvest | NO wind,pumpkin
- winter: YES winter,snow,coat,fireplace,snowman,skiing,skating | NO snowflake

### clothes (color:#845EF7)
- everyday: all NO -- shirt,pants,dress,shoes,socks,hat,jacket
- accessories: YES belt,tie | NO scarf,gloves,bag,sunglasses,watch
- seasonal: YES raincoat,swimsuit,sweater,sandals | NO boots,umbrella

### family (color:#FF6B6B) -- all NO
- immediate: mom,dad,baby,sister,brother
- extended: grandma,grandpa,uncle,aunt,cousin

### transport (color:#339AF0) -- all NO
- land: car,bus,train,bike,truck,motorcycle
- air: plane,helicopter,rocket,hot air balloon
- water: boat,ship,submarine,canoe

### school (color:#20C997) -- all NO
- supplies: pencil,book,bag,ruler,eraser,scissors,crayon,glue
- people: teacher,student,principal,friend
- places: classroom,library,playground,cafeteria,gym

---

## IMAGES IN docs/img/
Animals: sparrow.png, crow.png, seahorse.png, dragonfly.png, firefly.png, fly.png, spider.png, turtle.png
Food: bread.png, water.png, lemonade.png, smoothie.png, yogurt.png, plum.png, raspberry.png, pomegranate.png, ice_cream.png, jelly.png
Colors: color_red.png, color_blue.png, color_yellow.png, color_green.png, color_orange.png, color_purple.png, color_pink.png, color_white.png, color_black.png, color_brown.png, color_gray.png
Shapes: oval.png, rectangle.png, square.png
Sizes: big.jpg, small.jpg, tall.jpg, short.jpg, short_long.jpg, long.jpg, fat.jpg, thin.jpg, heavy.jpg, light.jpg, old.jpg, young.jpg
Feelings: happy.png, scared.png, excited.png, proud.png
Body: head.png, neck.png, shoulder.png, chest.png, back.png, hips.png, knee.png, toe.png, cheek.png, chin.png, teeth.png, heart.png, brain.png, lungs.png, stomach.png, liver.png, kidney.png
Home: pillow.png, lamp.png, dresser.png, closet.png, fridge.png, stove.png, cup.png, plate.png, fork.png, pot.png, bowl.png, pan.png, table.png, tv.png, armchair.png, painting.png, couch.png, towel.png
Nature: snow.png, storm.png, cloudy.png, fog.png, grass.png, bush.png, forest.png, lake.png, island.png, valley.png, hills.png, ocean.png, sea.png
Space: asteroid.png, galaxy.png, astronaut.png, comet.png
Seasons: spring.png, snowdrops.png, summer.png, fall.png, leaves.png, acorn.png, harvest.png, winter.png, coat.png, fireplace.png, snowman.png, skiing.png, skating.png
Clothes: belt.png, tie.png, raincoat.png, swimsuit.png, sweater.png, sandals.png

---

## VERSION HISTORY
v4.5.0 - Space category, Solar System interactive mode, seasons/home/nature/clothes images, new words
v4.3.6 - Home/bedroom images, TTS stop-before-speak fix, increased duration estimate
v4.3.5 - All organs images (heart, brain, lungs, stomach, liver, kidneys)
v4.3.4 - Body images, organs subcategory, hip->hips, stale image fixes, TTS timing
v4.3.3 - Insects icon ladybug, turtle in sea, body/face images, TTS warm-up fixes
v4.3.2 - Feelings updates (emojis, images), global 2x image size, back button fix
v4.3.1 - long/short images, sizes skip subcategory screen, sizes 2x
v4.3.0 - pink fix, long word timeout, opposite pairs, shape/size images, fat/old/young
v4.2.2 - AudioContext race condition fix, stale grammar on card transition
v4.2.1 - Hotfix: closure bug causing wrong subcategory words

---

## WORKING CONVENTIONS
- User saves files locally to the correct directory themselves -- agent does NOT provide cp commands
- All changes accumulate in PENDING_CHANGES.md until user says "apply"
- On apply: update MASTER_PLAN.md, bump version, present files, give git commands
- Version format: v4.X.Y -- minor for new features, patch for fixes
- Agent reads full index.html before making code changes
- words.json edits done via Python script, never manually
- Images with black backgrounds: use Pillow to replace dark pixels with white
- Build always uses ./gradlew clean assembleDebug (never skip clean)
