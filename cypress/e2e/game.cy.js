const paths = [
  [true, true, true],
  [true, true, false],
  [true, false, true],
  [true, false, false],
  [false, true, true],
  [false, true, false],
  [false, false, true],
  [false, false, false]
];

function chooseProfile(level = "beginner") {
  cy.get('[data-setting="level"][data-value="' + level + '"]').click();
  cy.get('[data-setting="role"][data-value="backend"]').click();
  cy.get('[data-setting="goal"][data-value="privacy"]').click();
  cy.get('[data-cy="start"], #start-button').click();
}

function playPath(path) {
  path.forEach((isSafe, index) => {
    cy.get('[data-cy="choice-' + (isSafe ? "safe" : "unsafe") + '"]').click();
    cy.get("#feedback-panel").should("be.visible");
    cy.get("#feedback-outcome").should("not.be.empty");
    cy.get("#feedback-why").should("not.be.empty");
    if (index < path.length - 1) cy.get("#continue-button").click();
    else cy.get("#continue-button").click();
  });
}

describe("SE Primer telefon akışı", () => {
  beforeEach(() => {
    cy.visit("/?e2e=1");
  });

  it("başlamak için üç yanıt ister ve başlangıç ipucunu gösterir", () => {
    cy.get("#start-button").should("be.disabled");
    cy.get('[data-setting="level"][data-value="beginner"]').click();
    cy.get('[data-setting="role"][data-value="backend"]').click();
    cy.get("#start-button").should("be.disabled");
    cy.get('[data-setting="goal"][data-value="privacy"]').click();
    cy.get("#start-button").should("be.enabled").click();
    cy.get("#screen-game").should("be.visible");
    cy.get(".tutor-hint").should("be.visible");
    cy.contains("300 kişi bekliyor").should("be.visible");
  });

  it("deneyimli oyuncuya 60 saniyelik sayaç gösterir", () => {
    cy.clock();
    cy.get('[data-setting="level"][data-value="experienced"]').click();
    cy.get('[data-setting="role"][data-value="qa"]').click();
    cy.get('[data-setting="goal"][data-value="testing"]').click();
    cy.get("#start-button").click();
    cy.get("#timer").should("be.visible").and("contain", "01:00");
    cy.get(".tutor-hint").should("not.be.visible");
    cy.tick(1000);
    cy.get("#timer").should("contain", "00:59");
  });

  it("süre aşımını riskli karar sayar ve senaryoyu tamamlar", () => {
    cy.clock();
    cy.get('[data-setting="level"][data-value="experienced"]').click();
    cy.get('[data-setting="role"][data-value="devops"]').click();
    cy.get('[data-setting="goal"][data-value="architecture"]').click();
    cy.get("#start-button").click();
    cy.tick(60000);
    cy.get("#feedback-title").should("contain", "Süre doldu");
    cy.get("#continue-button").click();
    cy.get('[data-cy="choice-safe"]').click();
    cy.get("#continue-button").click();
    cy.get('[data-cy="choice-safe"]').click();
    cy.get("#continue-button").click();
    cy.get("#ending-bad").should("be.visible");
  });

  paths.forEach((path) => {
    it("şu karar dizisini beklenen sonla tamamlar: " + path.map((value) => value ? "A" : "B").join("-"), () => {
      chooseProfile();
      playPath(path);
      const expected = path.every(Boolean) ? "good" : "bad";
      cy.get("#screen-ending").should("be.visible").and("have.attr", "data-result", expected);
      cy.get(expected === "good" ? "[data-cy=ending-good]" : "[data-cy=ending-bad]").should("be.visible");
      cy.get("#ending-role").should("contain", "Arka uç");
      cy.get("#ending-goal").should("contain", "Gizlilik");
    });
  });

  it("rehberi Sokratik tutar ve oyuncu yerine seçim yapmaz", () => {
    chooseProfile();
    cy.get('[data-cy="choice-safe"]').click();
    cy.get("#student-answer").type("Şema uyumunu önce incelemek gerekir.");
    cy.get("#tutor-form").submit();
    cy.get("#tutor-reply").should("be.visible").and("contain", "?");
    cy.get("#tutor-reply").should("not.contain", "doğru cevap");
    cy.get("#continue-button").should("be.visible");
  });
});
