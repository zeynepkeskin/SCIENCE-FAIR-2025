let conditionAssigned;
let trial = 0;
let totalTrials = 6;
let startTime;
let attentionTotalTime = 0;
let attentionCorrect = 0;
let memoryCorrect = 0;

const memoryPhrases = [
  "silver mountain",
  "quiet river",
  "blue window",
  "empty garden",
  "soft shadow",
];

let memoryPhrase;

let moodCalm = null;
let moodFocus = null;
let moodOverall = null;

function showConsentScreen() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("consent").style.display = "block";
}

function disagree() {
  alert("You chose not to participate. Thank you.");
}

function agree() {
  conditionAssigned = Math.random() < 0.5 ? "A" : "B";
  document.getElementById("consent").style.display = "none";

  if (conditionAssigned === "A") showActivityA();
  else showActivityB();
}

function showMemoryPhrase(condition) {
  memoryPhrase =
    memoryPhrases[Math.floor(Math.random() * memoryPhrases.length)];

  const id = condition === "A" ? "memory-phrase-A" : "memory-phrase-B";

  document.getElementById(id).innerText =
    "Please remember this phrase: " + memoryPhrase;

  setTimeout(() => {
    document.getElementById(id).innerText = "";
  }, 5000);
}

function showActivityA() {
  document.getElementById("activity-A").style.display = "block";
  showMemoryPhrase("A");

  const video = document.getElementById("activity-video");
  video.currentTime = 0;
  video.play();

  startTimer("A");
}

function showActivityB() {
  document.getElementById("activity-B").style.display = "block";
  showMemoryPhrase("B");
  startTimer("B");
}

function startTimer(condition) {
  setTimeout(() => {
    endActivity(condition);
  }, 5 * 60 * 1000); // 5 minutes
}

function endActivity(condition) {
  if (condition === "A") {
    const video = document.getElementById("activity-video");
    video.pause();
    video.currentTime = 0;
  }

  document.getElementById(
    condition === "A" ? "activity-A" : "activity-B"
  ).style.display = "none";

  document.getElementById("attention-task").style.display = "block";
  startAttentionTask();
}

function startAttentionTask() {
  trial = 0;
  attentionTotalTime = 0;
  attentionCorrect = 0;
  nextTrial();
}

function nextTrial() {
  if (trial >= totalTrials) {
    endAttentionTask();
    return;
  }

  trial++;
  document.getElementById("grid").innerHTML = "";
  startTime = Date.now();

  let targetIndex = Math.floor(Math.random() * 25);

  for (let i = 0; i < 25; i++) {
    let div = document.createElement("div");
    div.classList.add("shape");

    if (i === targetIndex) {
      div.style.backgroundColor = "red";
      div.onclick = () => {
        attentionCorrect++;
        attentionTotalTime += Date.now() - startTime;
        nextTrial();
      };
    }

    document.getElementById("grid").appendChild(div);
  }
}

function endAttentionTask() {
  document.getElementById("attention-task").style.display = "none";
  document.getElementById("memory-task").style.display = "block";
}

function submitMemory() {
  const response = document
    .getElementById("memory-input")
    .value.trim()
    .toLowerCase();

  memoryCorrect = response === memoryPhrase ? 1 : 0;

  document.getElementById("memory-task").style.display = "none";
  document.getElementById("mood-survey").style.display = "block";
}

function recordMood(type, value) {
  if (type === "calm") moodCalm = value;
  if (type === "focus") moodFocus = value;
  if (type === "mood") moodOverall = value;
}

function finishStudy() {
  if (moodCalm === null || moodFocus === null || moodOverall === null) {
    alert("Please answer all questions.");
    return;
  }

  const data = {
    condition: conditionAssigned,
    attentionTime: attentionTotalTime,
    attentionCorrect: attentionCorrect,
    memoryCorrect: memoryCorrect,
    moodCalm: moodCalm,
    moodFocus: moodFocus,
    moodOverall: moodOverall,
  };

  fetch(
    "https://script.google.com/macros/s/AKfycbzNQsrsxBzqlcMMJ9pRpB1OqAKPUkya0qtzt2_ikpullesLsakKwlUh9Hjhtrn4KDnb/exec",
    {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  document.getElementById("mood-survey").style.display = "none";
  alert("Thank you for participating!");
}
