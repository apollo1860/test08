let questions = {
  anfänger: [
    { type: "vocab", q: "Haus", a: "casa", opts: ["casa","pane","pizza","latte"] },
    { type: "vocab", q: "Hund", a: "cane", opts: ["cane","gatto","tavolo","libro"] },
    { type: "mc", q: "Was heißt Tisch?", a: "tavolo", opts: ["tavolo","torta","topo","treno"] },
    { type: "mc", q: "Was heißt Apfel?", a: "mela", opts: ["mela","pera","uva","arancia"] },
    { type: "gap", q: "Io ___ Marco.", a: "sono", opts: ["sono","sei","siamo","siete"] },
    { type: "gap", q: "Come ___?", a: "stai", opts: ["stai","sto","sta","stiamo"] },
    { type: "vocab", q: "Milch", a: "latte", opts: ["latte","vino","acqua","pane"] },
    { type: "mc", q: "Was heißt Danke?", a: "grazie", opts: ["grazie","scusa","ciao","buongiorno"] },
    { type: "vocab", q: "Brot", a: "pane", opts: ["pane","pizza","formaggio","birra"] },
    { type: "gap", q: "Mi chiamo ___.", a: "Marco", opts: ["Marco","Sono","Italia","Roma"] }
  ],
  normal: [
    { type: "mc", q: "Was heißt Zug?", a: "treno", opts: ["treno","bus","aereo","auto"] },
    { type: "vocab", q: "Stuhl", a: "sedia", opts: ["sedia","letto","porta","muro"] },
    { type: "gap", q: "Noi ___ amici.", a: "siamo", opts: ["siamo","sono","siete","sei"] },
    { type: "mc", q: "Was heißt Schlüssel?", a: "chiave", opts: ["chiave","porta","tavolo","libro"] },
    { type: "vocab", q: "Schule", a: "scuola", opts: ["scuola","ospedale","chiesa","mercato"] },
    { type: "mc", q: "Was heißt Flughafen?", a: "aeroporto", opts: ["aeroporto","ospedale","stadio","banca"] },
    { type: "gap", q: "Loro ___ studenti.", a: "sono", opts: ["sono","siamo","sei","sta"] },
    { type: "vocab", q: "Fenster", a: "finestra", opts: ["finestra","porta","tetto","muro"] },
    { type: "mc", q: "Was heißt Bahnhof?", a: "stazione", opts: ["stazione","piazza","strada","scuola"] },
    { type: "gap", q: "Tu ___ felice?", a: "sei", opts: ["sei","sono","siete","sta"] }
  ],
  profi: [
    { type: "mc", q: "Was heißt Herausforderung?", a: "sfida", opts: ["sfida","sfoglia","scopa","sfortuna"] },
    { type: "vocab", q: "Wolke", a: "nuvola", opts: ["nuvola","vento","pioggia","cielo"] },
    { type: "gap", q: "Se io ___ tempo, verrei.", a: "avessi", opts: ["avessi","avrei","avrò","avuto"] },
    { type: "mc", q: "Was heißt Steuer (finanziell)?", a: "tassa", opts: ["tassa","tavola","tesoro","testo"] },
    { type: "vocab", q: "Schublade", a: "cassetto", opts: ["cassetto","armadio","porta","tavolo"] },
    { type: "gap", q: "Se lui ___ qui, sarebbe felice.", a: "fosse", opts: ["fosse","era","è","sarà"] },
    { type: "mc", q: "Was heißt Leistung?", a: "prestazione", opts: ["prestazione","presentazione","pressione","preoccupazione"] },
    { type: "vocab", q: "Verantwortung", a: "responsabilità", opts: ["responsabilità","possibilità","stabilità","attività"] },
    { type: "gap", q: "Vorrei che tu ___.", a: "venissi", opts: ["venissi","vieni","venire","venuto"] },
    { type: "mc", q: "Was heißt Wirtschaft?", a: "economia", opts: ["economia","ecologia","edilizia","energia"] }
  ]
};

// Zutaten
let goodIngredients = ["🍅","🧀","🍄","🥓","🥬","🐟","🫒","🌶️","🧄","🥦"];
let badIngredients = ["🔩","👟","🍌","🍫","🐍","🦄"];

let chosenPizza = "kurz";
let difficulty = "anfänger";
let currentQuestions = [];
let currentIndex = 0;
let pizza = ["🍕"]; 
let wrongAnswers = [];

function setPizza(type){ chosenPizza = type; }
function setDifficulty(level){ difficulty = level; }

function startGame(){
  document.getElementById("startScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.add("active");

  // Anzahl Fragen je nach Pizza
  let qCount = chosenPizza === "kurz" ? 4 : (chosenPizza === "lang" ? 7 : Math.floor(Math.random()*4)+4);

  let pool = [...questions[difficulty]];
  currentQuestions = shuffle(pool).slice(0,qCount);
  currentIndex = 0;
  pizza = ["🍕"];
  wrongAnswers = [];
  showQuestion();
}

function showQuestion(){
  if(currentIndex >= currentQuestions.length){
    if(wrongAnswers.length>0){
      document.getElementById("gameScreen").classList.remove("active");
      document.getElementById("reviewScreen").classList.add("active");
      showReview();
    } else {
      endGame();
    }
    return;
  }

  let q = currentQuestions[currentIndex];
  document.getElementById("questionText").innerText = q.type==="vocab" ? `Übersetze: ${q.q}` : q.q;
  let container = document.getElementById("answerContainer");
  container.innerHTML = "";

  q.opts.forEach(opt=>{
    let btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = ()=>checkAnswer(opt);
    container.appendChild(btn);
  });

  updatePizza();
}

function checkAnswer(opt){
  let q = currentQuestions[currentIndex];
  if(opt===q.a){
    pizza.push(goodIngredients[currentIndex % goodIngredients.length]);
  } else {
    pizza.push(badIngredients[currentIndex % badIngredients.length]);
    wrongAnswers.push(q);
  }
  currentIndex++;
  showQuestion();
}

function showReview(){
  let container = document.getElementById("reviewContainer");
  container.innerHTML = "";
  wrongAnswers.forEach((q,i)=>{
    let div = document.createElement("div");
    div.innerText = q.type==="vocab" ? `Übersetze: ${q.q}` : q.q;
    q.opts.forEach(opt=>{
      let btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = ()=>{
        if(opt===q.a){
          pizza = pizza.map((z)=> badIngredients.includes(z) ? goodIngredients[Math.floor(Math.random()*goodIngredients.length)] : z);
        }
        if(i===wrongAnswers.length-1) endGame();
      }
      div.appendChild(btn);
    });
    container.appendChild(div);
  });
}

function endGame(){
  document.getElementById("reviewScreen").classList.remove("active");
  document.getElementById("gameScreen").classList.remove("active");
  document.getElementById("endScreen").classList.add("active");
  document.getElementById("finalPizza").innerText = pizza.join(" ");
  document.getElementById("comment").innerText = pizza.some(z=>badIngredients.includes(z)) 
    ? "😅 Deine Pizza hat... seltsame Zutaten!" 
    : "Perfetto! 🇮🇹 Buonissima Pizza!";
}

function restartGame(){
  document.getElementById("endScreen").classList.remove("active");
  document.getElementById("startScreen").classList.add("active");
}

function updatePizza(){
  document.getElementById("pizzaContainer").innerText = pizza.join(" ");
}

function shuffle(arr){
  return arr.sort(()=>Math.random()-0.5);
}

// Web Speech API
function speakQuestion(){
  let q = currentQuestions[currentIndex];
  let utterance = new SpeechSynthesisUtterance(q.a);
  utterance.lang = "it-IT";
  speechSynthesis.speak(utterance);
}
