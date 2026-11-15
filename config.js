// config.js — kila kitu cha trainer kiko hapa. Mteja mpya = hariri faili hili tu.
self.TRAINER = {
  brand: "Ommy Fitness App",
  color: "#BDD922",            // green halisi ya logo ya Ommy
  logo: "logo-ommy.png",       // logo yenye background wazi; ikikosekana, jina la brand linatumika

  // ---- Mazoezi kwa level ----
  // productId = kufuli: mazoezi yanafunguka tu baada ya product hiyo kufunguliwa. Beginner haina kufuli (bure).
  workouts: [
    {
      id: "beginner", level: "Beginner", name: "Ommy Starter",
      rounds: 3, secondsPerExercise: 60,
      exercises: [
        { name: "Plank out",            reps: "10", video: "plank-out.mp4" },
        { name: "Inclined plank in",    reps: "10", video: "inclined-plank-in.mp4" },
        { name: "Inclined plank jacks", reps: "30", video: "inclined-plank-jacks.mp4" },
        { name: "Switch lunges",        reps: "10", video: "switch-lunges.mp4" },
        { name: "Climbers",             reps: "10", video: "climbers.mp4" }
      ]
    },
    {
      id: "advanced", level: "Advanced", name: "Ommy Advanced",
      productId: "advanced",
      rounds: 4, secondsPerExercise: 60,
      // MFANO TU: videos ni zile zile za Beginner na reps zimeongezwa. Ommy atatuma videos halisi za Advanced.
      exercises: [
        { name: "Plank out",            reps: "15", video: "plank-out.mp4" },
        { name: "Inclined plank in",    reps: "15", video: "inclined-plank-in.mp4" },
        { name: "Inclined plank jacks", reps: "40", video: "inclined-plank-jacks.mp4" },
        { name: "Switch lunges",        reps: "15", video: "switch-lunges.mp4" },
        { name: "Climbers",             reps: "15", video: "climbers.mp4" }
      ]
    }
  ],

  // ---- Bidhaa zinazouzwa ----
  // type "workout" = inafungua level; type "meal" = inafungua faili (PDF).
  // codeHashes = SHA-256 ya code anazopewa mteja baada ya kulipa (tengeneza kwa codes.html).
  // Code za DEMO-* ni za majaribio tu: ZIBADILISHE kabla ya kuuza kweli.
  products: [
    {
      id: "advanced", type: "workout", title: "Ommy Advanced",
      desc: "Mazoezi magumu zaidi: raundi 4 na reps nyingi.",
      price: "TSh 30,000",
      codeHashes: [
        "ab263d64b8878b43eab1d32ebe400c3c50b5b711ca45f2196632a22feb919a1e",
        "246df25a39aff86d3bb208379290d3a9cc49ad9c0353579138a03599494377c6"
      ]
    },
    {
      id: "meal-loss", type: "meal", title: "Meal Plan: Kupunguza Uzito",
      desc: "Mpangilio wa chakula wa wiki 4 kwa Kiswahili.",
      price: "TSh 20,000", file: "meal-plan-kupunguza-uzito.pdf",
      codeHashes: [
        "3c443d8721be149555839759593863986a404ad3499a230f2fb10dafa9ee2124",
        "246df25a39aff86d3bb208379290d3a9cc49ad9c0353579138a03599494377c6"
      ]
    },
    {
      id: "meal-muscle", type: "meal", title: "Meal Plan: Kuongeza Misuli",
      desc: "Mpangilio wa chakula kwa kujenga misuli.",
      price: "TSh 20,000", file: "meal-plan-kuongeza-misuli.pdf",
      codeHashes: [
        "d5a7c5762603eed14713463df5ffa4a205c4547bde4dea2c8f9a0cf896d15cbb",
        "246df25a39aff86d3bb208379290d3a9cc49ad9c0353579138a03599494377c6"
      ]
    }
  ],

  // ---- Jinsi ya kulipa (awamu ya kwanza: lipa kisha WhatsApp, upate code) ----
  pay: {
    whatsapp: "255700000000",   // namba ya WhatsApp ya Ommy, bila + wala 0 mwanzo (mf. 2557XXXXXXXX)
    message: "Habari Coach Ommy, nimelipa kwa ajili ya",
    instructions: [
      "Tigo Pesa: 07XX XXX XXX (Jina la mpokeaji)",
      "NMB / CRDB: namba ya akaunti (Jina la akaunti)"
    ],
    soon: "Malipo ya moja kwa moja ndani ya app (M-Pesa, Tigo Pesa, Airtel Money) yanakuja."
  },

  speech: { lang: "en-US", round: "Round", reps: "reps", next: "Next", done: "Well done" },

  text: {
    tagTrain: "Mazoezi",
    tagMeal: "Meal Plan",
    mealIntro: "Mipango ya chakula kutoka kwa Coach Ommy.",
    start: "Anza mazoezi",
    unlock: "Fungua",
    locked: "Imefungwa",
    pay: "Lipia",
    open: "Fungua PDF",
    round: "Raundi",
    exercise: "Zoezi",
    reps: "reps",
    next: "Ifuatayo",
    last: "Hili ndilo la mwisho",
    pause: "Sitisha",
    resume: "Endelea",
    skip: "Ruka",
    end: "Maliza",
    endConfirm: "Maliza mazoezi sasa?",
    videoSoon: "Video inakuja",
    soundOn: "Sauti: ON",
    soundOff: "Sauti: OFF",
    doneTitle: "Umemaliza",
    doneCount: "Mazoezi uliyokamilisha",
    again: "Rudia",
    home: "Rudi mwanzo",
    minutes: "dakika",
    exercises: "mazoezi",
    payStep1: "Lipa kwa",
    payStep2: "Tuma uthibitisho wa malipo kwa WhatsApp",
    payStep3: "Weka code uliyopewa",
    sendWa: "Tuma WhatsApp",
    codePlaceholder: "Code yako",
    codeWrong: "Code si sahihi. Jaribu tena.",
    close: "Funga"
  }
};
