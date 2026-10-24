const decisions = [
  {
    id: "architecture",
    question: "Sistemi geri almak için önce neyi doğrularsın?",
    hint: "Eski uygulama sürümünün bugünkü veritabanı şemasıyla uyumlu olduğuna dair hangi kanıtı ararsın?",
    choices: [
      {
        safe: true,
        title: "Veritabanı geçişini ve geri dönüş uyumunu kontrol et",
        description: "Önce şema değişikliğini doğrula; uyumluysa önceki sürüme dön.",
        resultTitle: "Geri dönüş kontrollü ilerledi.",
        outcome: "Önceki sürüme geçmeden önce şema uyumu ve yedek durumu doğrulandı.",
        why: "Uygulama kodunu geri almak, veritabanı değişikliklerini kendiliğinden geri almaz. Uyumluluk kanıtı veri kaybı riskini düşürür."
      },
      {
        safe: false,
        title: "Üretim veritabanına hızlı bir yama uygula",
        description: "Bekleyenleri azaltmak için canlı kayıtları elle düzelt.",
        resultTitle: "Etki alanı belirsiz kaldı.",
        outcome: "Canlı veriye yapılan değişiklik izlenebilir bir geri dönüş adımı olmadan yayıldı.",
        why: "İncelenmemiş üretim yaması veri bütünlüğünü ve olay incelemesini riske atar."
      }
    ]
  },
  {
    id: "testing",
    question: "Yeni sürümü yeniden devreye nasıl alırsın?",
    hint: "En kritik kullanıcı akışını ve geri dönüş yolunu canlıya çıkmadan nasıl gözlemlersin?",
    choices: [
      {
        safe: true,
        title: "Maskeli veride duman testi çalıştır, sonra kademeli aç",
        description: "Randevu oluşturma ve iptal akışını doğrula; küçük bir grupta izle.",
        resultTitle: "Yayına kontrollü döndün.",
        outcome: "Kritik akışlar sentetik ve maskeli veride doğrulandı; sürüm kademeli açıldı.",
        why: "Küçük ve gözlemlenebilir bir yayına alma, hatanın etkisini sınırlar ve geri dönüş sinyali sağlar."
      },
      {
        safe: false,
        title: "Sırayı kısaltmak için sürümü doğrudan canlıya al",
        description: "Testi daha sonra yapacağını varsayarak tüm kullanıcılara aç.",
        resultTitle: "Hata etkisi genişledi.",
        outcome: "Yeni sürüm kritik akışlar doğrulanmadan tüm kullanıcılara açıldı.",
        why: "Üretim, kabul testi değildir. Önceden belirlenmiş kontrol ve geri dönüş koşulu olmadan risk büyür."
      }
    ]
  },
  {
    id: "privacy",
    question: "Logda bir hasta adı görünüyor. Ne yaparsın?",
    hint: "Sorunu ekiple paylaşırken kimlik bilgisini nasıl azaltır ve erişimi nasıl sınırlarsın?",
    choices: [
      {
        safe: true,
        title: "Adı maskele, erişimi kısıtla ve sentetik kimlik kullan",
        description: "Olay kaydını yalnızca gerekli ekiple, asgari veriyle incele.",
        resultTitle: "Gizlilik korundu.",
        outcome: "Kişi adı paylaşılmadı; inceleme sentetik kimlik ve sınırlı erişimle sürdü.",
        why: "Amaç için gerekli olmayan kişisel veriyi yaymak KVKK ve hasta mahremiyeti açısından gereksiz risk oluşturur."
      },
      {
        safe: false,
        title: "Ham logu ekip sohbetine gönder",
        description: "Herkes aynı bilgiyi görürse sorun daha hızlı çözülür diye düşün.",
        resultTitle: "Gereksiz veri paylaşıldı.",
        outcome: "Kimlik bilgisi erişim kapsamı belirsiz bir kanala taşındı.",
        why: "Sorun giderme için kişi adını paylaşmak gerekmez; erişim ve veri miktarı amaçla sınırlı tutulmalıdır."
      }
    ]
  }
];

const labels = {
  role: { backend: "Arka uç", qa: "Kalite", devops: "Operasyon", product: "Ürün" },
  goal: { architecture: "Mimari", testing: "Test", privacy: "Gizlilik" }
};

const tutorFallbacks = {
  architecture: "Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin?",
  testing: "Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin?",
  privacy: "Bu inceleme için gerçekten gerekli veri nedir ve kimlerin erişmesi gerekir?"
};

const state = {
  profile: { level: null, role: null, goal: null },
  currentDecision: 0,
  choices: [],
  timerId: null,
  remainingSeconds: 60,
  picked: false
};

const byId = (id) => document.getElementById(id);
const introScreen = byId("screen-intro");
const gameScreen = byId("screen-game");
const endingScreen = byId("screen-ending");
const startButton = byId("start-button");
const feedbackPanel = byId("feedback-panel");
const timerElement = byId("timer");

document.querySelectorAll("[data-setting]").forEach((button) => {
  button.addEventListener("click", () => {
    const setting = button.dataset.setting;
    state.profile[setting] = button.dataset.value;
    document.querySelectorAll('[data-setting="' + setting + '"]').forEach((sibling) => {
      sibling.setAttribute("aria-pressed", String(sibling === button));
    });
    startButton.disabled = Object.values(state.profile).some((value) => !value);
  });
});

byId("profile-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (startButton.disabled) return;
  startGame();
});

function startGame() {
  state.currentDecision = 0;
  state.choices = [];
  hideScreen(endingScreen);
  hideScreen(introScreen);
  showScreen(gameScreen);
  byId("profile-context").textContent = contextForProfile();
  renderDecision();
}

function contextForProfile() {
  const contexts = {
    architecture: "Mimari odağın: sürüm ve şema uyumunu görünür kıl.",
    testing: "Test odağın: kritik akışları küçük adımlarla doğrula.",
    privacy: "Gizlilik odağın: gerekli olan en az veriyi kullan."
  };
  return contexts[state.profile.goal] || "Hizmeti geri getirirken veri bütünlüğünü koru.";
}

function renderDecision() {
  const decision = decisions[state.currentDecision];
  state.picked = false;
  state.remainingSeconds = 60;
  clearTimer();
  feedbackPanel.hidden = true;
  feedbackPanel.classList.remove("is-risk");
  byId("step-current").textContent = String(state.currentDecision + 1).padStart(2, "0");
  byId("decision-number").textContent = String(state.currentDecision + 1).padStart(2, "0");
  byId("decision-question").textContent = decision.question;
  byId("hint-text").textContent = decision.hint;
  byId("profile-context").textContent = contextForProfile();
  byId("progress-fill").style.width = (((state.currentDecision + 1) / decisions.length) * 100) + "%";
  document.querySelector(".tutor-hint").hidden = state.profile.level === "experienced";
  byId("choice-list").innerHTML = decision.choices.map((choice, index) => {
    const letter = index === 0 ? "A" : "B";
    return '<button class="decision-choice" type="button" data-cy="choice-' + (choice.safe ? "safe" : "unsafe") + '" data-safe="' + choice.safe + '">' +
      '<span class="option-letter">' + letter + '</span>' +
      '<span class="option-copy"><strong>' + choice.title + '</strong><span>' + choice.description + '</span></span>' +
      '<span class="option-arrow" aria-hidden="true">›</span></button>';
  }).join("");
  byId("choice-list").querySelectorAll(".decision-choice").forEach((button, index) => {
    button.addEventListener("click", () => choose(index, false));
  });
  if (state.profile.level === "experienced") startTimer();
  else timerElement.hidden = true;
}

function startTimer() {
  timerElement.hidden = false;
  updateTimerLabel();
  state.timerId = window.setInterval(() => {
    state.remainingSeconds -= 1;
    updateTimerLabel();
    if (state.remainingSeconds <= 0) {
      clearTimer();
      choose(1, true);
    }
  }, 1000);
}

function updateTimerLabel() {
  const minutes = String(Math.floor(state.remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(state.remainingSeconds % 60).padStart(2, "0");
  timerElement.textContent = minutes + ":" + seconds;
}

function clearTimer() {
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
}

function choose(choiceIndex, timedOut) {
  if (state.picked) return;
  state.picked = true;
  clearTimer();
  const decision = decisions[state.currentDecision];
  const choice = decision.choices[choiceIndex];
  const safe = choice.safe && !timedOut;
  state.choices.push({ decisionId: decision.id, safe, timedOut: Boolean(timedOut) });
  byId("choice-list").querySelectorAll("button").forEach((button) => { button.disabled = true; });
  feedbackPanel.hidden = false;
  feedbackPanel.classList.toggle("is-risk", !safe);
  byId("feedback-label").textContent = safe ? "KONTROLLÜ KARAR" : "RİSKLİ KARAR";
  byId("feedback-title").textContent = timedOut ? "Süre doldu; doğrulama atlandı." : choice.resultTitle;
  byId("feedback-outcome").textContent = timedOut
    ? "Karar penceresi kapandı. Ekip, güvenli kontrol adımları tamamlanmadan ilerledi."
    : choice.outcome;
  byId("feedback-why").textContent = timedOut
    ? "Zaman baskısında karar verememek de sistem için bir sonuç üretir; ekipte bir eskalasyon yolu tanımlı olmalıdır."
    : choice.why;
  byId("tutor-reply").hidden = true;
  byId("tutor-reply").textContent = "";
  byId("student-answer").value = "";
  byId("continue-button").textContent = state.currentDecision === decisions.length - 1 ? "Nöbet raporunu gör" : "Devam et";
  byId("continue-button").append(document.createTextNode(state.currentDecision === decisions.length - 1 ? " ✓" : " →"));
  feedbackPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

byId("continue-button").addEventListener("click", () => {
  if (!state.picked) return;
  if (state.currentDecision < decisions.length - 1) {
    state.currentDecision += 1;
    renderDecision();
    byId("decision-question").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  showEnding();
});

function showEnding() {
  clearTimer();
  hideScreen(gameScreen);
  showScreen(endingScreen);
  const passed = state.choices.length === decisions.length && state.choices.every((answer) => answer.safe);
  endingScreen.classList.toggle("is-risk", !passed);
  byId("ending-stamp-icon").textContent = passed ? "✓" : "!";
  byId("ending-kicker").innerHTML = '<span class="eyebrow-line"></span> NÖBET RAPORU · ' + (passed ? "09:05" : "09:42");
  byId("ending-title").textContent = passed ? "Hizmet güvende." : "Kriz büyüdü.";
  byId("ending-summary").textContent = passed
    ? "Randevu sistemi geri döndü. Ekip veri bütünlüğünü ve kişi mahremiyetini koruyarak ilerledi."
    : "Bazı kontroller atlandı. Hizmetin yanında veri bütünlüğü veya mahremiyet de risk altına girdi.";
  byId("ending-role").textContent = labels.role[state.profile.role];
  byId("ending-goal").textContent = labels.goal[state.profile.goal];
  byId("ending-reflection").textContent = passed
    ? "Bu kontrolleri olay sonrası kısa bir nöbet yönergesine ekle; bir sonraki nöbet daha sakin başlasın."
    : "Bir sonraki adım, etkiyi sınırlamak ve olay kaydını kişisel veriden arındırarak incelemek.";
  endingScreen.dataset.result = passed ? "good" : "bad";
  byId("ending-title").dataset.cy = passed ? "ending-good" : "ending-bad";
}

byId("restart-button").addEventListener("click", () => {
  clearTimer();
  state.currentDecision = 0;
  state.choices = [];
  state.picked = false;
  hideScreen(gameScreen);
  hideScreen(endingScreen);
  showScreen(introScreen);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

byId("tutor-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const answer = byId("student-answer").value.trim().slice(0, 300);
  if (!answer) return;
  const replyElement = byId("tutor-reply");
  const decision = decisions[state.currentDecision];
  replyElement.hidden = false;
  replyElement.textContent = "Bir soru hazırlıyorum…";
  try {
    const response = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer,
        decisionId: decision.id,
        level: state.profile.level,
        role: state.profile.role,
        goal: state.profile.goal
      })
    });
    if (!response.ok) throw new Error("Model endpoint is not configured");
    const payload = await response.json();
    const proposed = String(payload.reply || "");
    if (payload.mode !== "gemini" || !isTutorSafe(proposed, decision.id)) {
      replyElement.textContent = tutorFallback(decision.id, answer);
    } else {
      replyElement.textContent = proposed;
    }
  } catch (_error) {
    replyElement.textContent = tutorFallback(decision.id, answer);
  }
  byId("student-answer").value = "";
});

function isTutorSafe(reply, decisionId) {
  const normalized = reply.toLocaleLowerCase("tr");
  if (reply.length > 180 || !reply.includes("?")) return false;
  const unsafePhrases = [
    "doğru cevap", "seçenek a", "seçenek b", "a seçene", "b seçene",
    "şunu seç", "bunu seç", "şunu yap", "bunu yap", "yapmalısın",
    "etmelisin", "uygula", "seçmelisin"
  ];
  if (unsafePhrases.some((phrase) => normalized.includes(phrase))) return false;
  const decisionWords = {
    architecture: ["rollback", "geri dön", "şema", "migration", "yama"],
    testing: ["test et", "duman testi", "kademeli aç", "canlıya al"],
    privacy: ["maskele", "ham log", "hasta adı", "kişisel veriyi paylaş"]
  };
  return !(decisionWords[decisionId] || []).some((phrase) => normalized.includes(phrase));
}

function tutorFallback(decisionId, answer) {
  if (answer.length < 8) return "Biraz daha açalım: hangi gözlemlenebilir kanıt kararını destekler?";
  return tutorFallbacks[decisionId] || "Bu kararın etkisini hangi kanıtla değerlendirebilirsin?";
}

function hideScreen(element) { element.hidden = true; }
function showScreen(element) { element.hidden = false; }

if (new URLSearchParams(window.location.search).has("e2e")) {
  document.documentElement.dataset.e2e = "true";
}
