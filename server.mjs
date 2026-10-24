import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const maxBodyBytes = 4096;
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".md": "text/markdown; charset=utf-8"
};

const tutorQuestions = {
  architecture: "Bir geri dönüş kararının güvenli olduğunu hangi iki sistem kaydıyla doğrulayabilirsin?",
  testing: "Hangi kullanıcı akışını gözlemleyip hangi sinyalle durma kararı verebilirsin?",
  privacy: "Bu inceleme için gerçekten gerekli veri nedir ve kimlerin erişmesi gerekir?"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBodyBytes) {
        reject(new Error("Request body too large"));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on("end", () => {
      try { resolve(JSON.parse(body || "{}")); }
      catch { reject(new Error("Invalid JSON")); }
    });
    request.on("error", reject);
  });
}

function serveStatic(request, response) {
  const requested = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relative = requested === "/" ? "index.html" : requested.replace(/^\/+/, "");
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(resolved, (error, data) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(resolved)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === "POST" && request.url === "/api/tutor") {
    let payload;
    try { payload = await readBody(request); }
    catch (error) {
      sendJson(response, error.message === "Request body too large" ? 413 : 400, { error: error.message });
      return;
    }

    const answer = typeof payload.answer === "string" ? payload.answer.slice(0, 300) : "";
    const decisionId = Object.hasOwn(tutorQuestions, payload.decisionId) ? payload.decisionId : "architecture";
    if (!answer.trim()) {
      sendJson(response, 400, { error: "A short student answer is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      sendJson(response, 503, { mode: "local", error: "Gemini key is not configured." });
      return;
    }

    const prompt = [
      "You are a Socratic software engineering tutor for a fictional appointment system incident.",
      "Never state the correct option, choose an action, give a step-by-step solution, or repeat a choice as the answer.",
      "Ask exactly one short, open-ended question in Turkish that helps the student examine evidence, impact, or trade-offs.",
      "Do not include personally identifying or medical information. Keep the reply under 30 words.",
      "Scenario decision: " + decisionId + ".",
      "Learner level: " + String(payload.level || "beginner") + ".",
      "Learner role: " + String(payload.role || "backend") + ".",
      "Learning goal: " + String(payload.goal || "architecture") + ".",
      "Student answer: " + answer
    ].join("\n");

    try {
      const apiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 96 }
        }),
        signal: AbortSignal.timeout(10000)
      });
      if (!apiResponse.ok) {
        sendJson(response, 502, { mode: "error", error: "Tutor service returned an error." });
        return;
      }
      const data = await apiResponse.json();
      const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
      sendJson(response, 200, { mode: "gemini", reply });
    } catch {
      sendJson(response, 502, { mode: "error", error: "Tutor service is unavailable." });
    }
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD, POST" });
    response.end("Method not allowed");
    return;
  }
  serveStatic(request, response);
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write("SE Primer listening on http://127.0.0.1:" + port + "\n");
});
