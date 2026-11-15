// config.js — kila kitu cha trainer kiko hapa. Mteja mpya = hariri faili hili tu.
// (self ili ifanye kazi kwenye app na kwenye service worker)
self.TRAINER = {
  brand: "Ommy Fitness Center",
  color: "#BDD922",          // green halisi ya logo ya Ommy
  logo: "logo.jpg",          // logo ya mteja kwenye folder kuu; ikikosekana, jina la brand linatumika
  workoutName: "Ommy Starter",
  rounds: 3,                 // 10x3 = reps 10, raundi 3
  secondsPerExercise: 60,    // EMOM: zoezi 1 kila dakika
  exercises: [
    { name: "Plank out",            reps: "10", video: "videos/plank-out.mp4" },
    { name: "Inclined plank in",    reps: "10", video: "videos/inclined-plank-in.mp4" },
    { name: "Inclined plank jacks", reps: "30", video: "videos/inclined-plank-jacks.mp4" },
    { name: "Switch lunges",        reps: "10", video: "videos/switch-lunges.mp4" },
    { name: "Climbers",             reps: "10", video: "videos/climbers.mp4" }
  ],
  text: {
    start: "Anza mazoezi",
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
    doneTitle: "Umemaliza",
    doneCount: "Mazoezi uliyokamilisha",
    again: "Rudia",
    home: "Rudi mwanzo",
    minutes: "dakika",
    exercises: "mazoezi"
  }
};
