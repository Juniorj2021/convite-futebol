const OG_IMAGE = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&h=630&q=85";

function tomorrowDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "numeric", day: "numeric"
  }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  const d = new Date(Date.UTC(+p.year, +p.month - 1, +p.day + 1, 12));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC", weekday: "long", day: "2-digit", month: "long", year: "numeric"
  }).format(d);
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
export async function onRequest(context) {
  const date = tomorrowDate();
  const desc = `Amanhã, ${date}, no Campo do Corujão. Obrigatório o uso do colete ou de camisas nas cores do colete.`;
  const canonical = new URL(context.request.url).origin + "/";
  const html = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>FUTEBOL AMANHÃ | Campo do Corujão</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Futebol no Campo do Corujão">
<meta property="og:title" content="FUTEBOL AMANHÃ"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="FUTEBOL AMANHÃ">
<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${OG_IMAGE}">
<meta name="theme-color" content="#071a33">
<style>
*{box-sizing:border-box}body{margin:0;background:#071a33;color:#fff;font-family:Arial,Helvetica,sans-serif;min-height:100vh;display:grid;place-items:center;padding:24px}
main{width:min(100%,620px);overflow:hidden;border-radius:22px;background:#102b4d;box-shadow:0 20px 60px #0006}
.hero{min-height:250px;background:linear-gradient(0deg,#071a33ee,#071a3330),url('${OG_IMAGE}') center/cover;display:flex;align-items:end;padding:28px}
.tag{display:inline-block;background:#b8f34a;color:#102b13;font-size:12px;font-weight:800;letter-spacing:1.5px;padding:8px 12px;border-radius:30px;margin-bottom:12px}
h1{font-size:clamp(34px,8vw,54px);line-height:.98;margin:0;font-weight:900;letter-spacing:-1.5px}
.content{padding:28px}.date{color:#b8f34a;font-weight:800;font-size:18px;text-transform:capitalize;margin:0 0 22px}
.details{display:grid;gap:14px;margin-bottom:24px}.detail{display:flex;gap:12px;align-items:center;font-size:17px}.symbol{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#ffffff14;font-size:19px;flex:none}
.notice{border-left:4px solid #b8f34a;background:#ffffff0d;padding:15px 16px;border-radius:0 12px 12px 0;line-height:1.5;margin:22px 0 26px}
.form-title{font-size:20px;margin:0 0 12px}.name-input{width:100%;padding:16px;border:1px solid #68809b;border-radius:12px;background:#fff;color:#102b4d;font-size:17px;outline:none}.name-input:focus{border-color:#b8f34a;box-shadow:0 0 0 3px #b8f34a33}
button{width:100%;border:0;cursor:pointer;text-align:center;background:#b8f34a;color:#102b13;font-weight:900;font-size:17px;padding:17px 20px;border-radius:12px;margin-top:12px}
button:disabled{opacity:.65;cursor:wait}.status{min-height:22px;color:#d7e6f6;font-size:14px;margin:10px 0 0}
.participants{margin:0 0 22px;padding:0}.participants-toggle{width:100%;margin:0 0 12px;background:#ffffff16;color:#fff;border:1px solid #7890aa;padding:13px;font-size:15px}.participants-panel{padding:16px;background:#0b2340;border:1px solid #ffffff26;border-radius:12px}.participants-panel[hidden]{display:none}.participants h2{font-size:20px;margin:0 0 6px}.count{color:#b8f34a;font-weight:800;margin:0 0 14px}.names{list-style:decimal;margin:0;padding-left:28px;display:grid;gap:8px}.names li{padding:0 0 0 4px;overflow-wrap:anywhere}.participant-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;background:#ffffff0d;border-radius:9px}.person-name{overflow-wrap:anywhere}.cancel-button{width:auto;flex:none;margin:0;padding:8px 10px;border:1px solid #ffb4a8;background:transparent;color:#ffd2ca;font-size:12px;border-radius:8px}.empty{color:#c4d2e1;font-size:14px}
.schedule-editor{margin:-8px 0 22px;padding:14px;background:#0b2340;border:1px solid #ffffff26;border-radius:12px}.schedule-editor summary{cursor:pointer;color:#b8f34a;font-weight:800}.schedule-controls{display:flex;gap:8px;align-items:center;margin-top:12px}.schedule-controls input{min-width:0;flex:1;padding:11px;border:1px solid #68809b;border-radius:9px;font-size:16px}.schedule-controls button{width:auto;margin:0;padding:11px 14px;font-size:13px}.schedule-status{font-size:13px;color:#d7e6f6;margin:8px 0 0}.foot{text-align:center;color:#b7c6d8;font-size:12px;margin-top:18px}
</style></head><body><main>
<section class="hero"><div><span class="tag">É AMANHÃ!</span><h1>FUTEBOL<br>AMANHÃ</h1></div></section>
<section class="content"><p class="date">${esc(date)}</p>
<div class="details"><div class="detail"><span class="symbol">⏰</span><span><strong>Horário:</strong> <span id="event-time">06:00</span></span></div>
<div class="detail"><span class="symbol">📍</span><span><strong>Local:</strong> Campo do Corujão</span></div></div>
<details class="schedule-editor"><summary>Alterar horário do futebol</summary><div class="schedule-controls"><input id="schedule-input" type="time" value="06:00" aria-label="Novo horário"><button id="schedule-save" type="button">SALVAR HORÁRIO</button></div><p class="schedule-status" id="schedule-status" role="status"></p></details>
<div class="notice"><strong>ATENÇÃO!</strong><br>Obrigatório o uso do colete ou de camisas nas cores do colete.</div>
<section class="participants" aria-live="polite">
<button class="participants-toggle" id="participants-toggle" type="button" aria-expanded="false" aria-controls="participants-panel">MOSTRAR PARTICIPANTES</button>
<div class="participants-panel" id="participants-panel" hidden>
<h2>Participantes confirmados</h2>
<p class="count" id="participant-count">Carregando confirmações...</p>
<ol class="names" id="participant-list"></ol>
</div>
</section>
<form id="confirm-form">
<h2 class="form-title">Confirme sua participação</h2>
<label for="participant-name">Seu nome completo</label>
<input class="name-input" id="participant-name" name="name" type="text" minlength="2" maxlength="70" autocomplete="name" placeholder="Digite seu nome" required>
<button id="submit-button" type="submit">CONFIRMAR MINHA PARTICIPAÇÃO</button>
<p class="status" id="form-status" role="status" aria-live="polite"></p>
</form>
<p class="foot">Sua confirmação ficará visível para os demais participantes.</p></section></main>
<script>
const form = document.getElementById("confirm-form");
const input = document.getElementById("participant-name");
const button = document.getElementById("submit-button");
const status = document.getElementById("form-status");
const count = document.getElementById("participant-count");
const list = document.getElementById("participant-list");
const participantsToggle = document.getElementById("participants-toggle");
const participantsPanel = document.getElementById("participants-panel");
const eventTime = document.getElementById("event-time");
const scheduleInput = document.getElementById("schedule-input");
const scheduleSave = document.getElementById("schedule-save");
const scheduleStatus = document.getElementById("schedule-status");
participantsToggle.addEventListener("click", () => {
  const opening = participantsPanel.hidden;
  participantsPanel.hidden = !opening;
  participantsToggle.textContent = opening ? "OCULTAR PARTICIPANTES" : "MOSTRAR PARTICIPANTES";
  participantsToggle.setAttribute("aria-expanded", String(opening));
});

async function loadSchedule() {
  try {
    const response = await fetch("/api/horario", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar o horário.");
    eventTime.textContent = data.time;
    scheduleInput.value = data.time;
  } catch (error) { scheduleStatus.textContent = error.message; }
}
scheduleSave.addEventListener("click", async () => {
  const time = scheduleInput.value;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    scheduleStatus.textContent = "Informe um horário válido.";
    return;
  }
  scheduleSave.disabled = true;
  scheduleStatus.textContent = "Salvando horário...";
  try {
    const response = await fetch("/api/horario", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível salvar.");
    eventTime.textContent = data.time;
    scheduleInput.value = data.time;
    scheduleStatus.textContent = "Horário atualizado para todos os participantes!";
  } catch (error) { scheduleStatus.textContent = error.message; }
  finally { scheduleSave.disabled = false; }
});
function normalizeName(name) {
  return name.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLocaleLowerCase("pt-BR");
}
function cancellationKey(name, eventDate) {
  return "futebol-cancel:" + eventDate + ":" + normalizeName(name);
}
async function cancelParticipation(name, eventDate, key, cancelButton) {
  if (!confirm("Deseja retirar sua confirmação de presença?")) return;
  cancelButton.disabled = true;
  status.textContent = "Cancelando sua participação...";
  try {
    const cancellationToken = localStorage.getItem(key);
    if (!cancellationToken) throw new Error("Código de cancelamento não encontrado neste navegador.");
    const response = await fetch("/api/confirmacoes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, eventDate, cancellationToken })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível cancelar.");
    localStorage.removeItem(key);
    status.textContent = "Sua confirmação foi retirada.";
    await loadParticipants();
  } catch (error) {
    status.textContent = error.message;
    cancelButton.disabled = false;
  }
}
function showParticipants(data) {
  list.replaceChildren();
  count.textContent = data.total + (data.total === 1 ? " pessoa confirmou presença" : " pessoas confirmaram presença");
  if (!data.total) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Ainda não há confirmações. Seja o primeiro!";
    list.appendChild(li);
    return;
  }
  data.participants.forEach(person => {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "participant-row";
    const name = document.createElement("span");
    name.className = "person-name";
    name.textContent = person.name;
    row.appendChild(name);

    const key = cancellationKey(person.name, data.eventDate);
    let token = null;
    try { token = localStorage.getItem(key); } catch {}
    {
      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "cancel-button";
      cancelButton.textContent = "Retirar";
      cancelButton.title = token ? "Retirar sua confirmação neste navegador" : "Retirar confirmação antiga";
      cancelButton.addEventListener("click", () => cancelParticipation(person.name, data.eventDate, key, cancelButton));
      row.appendChild(cancelButton);
    }

    li.appendChild(row);
    list.appendChild(li);
  });
}
async function loadParticipants() {
  try {
    const response = await fetch("/api/confirmacoes", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar a lista.");
    showParticipants(data);
  } catch (error) {
    count.textContent = "Não foi possível carregar as confirmações.";
    status.textContent = error.message;
  }
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  button.disabled = true;
  status.textContent = "Registrando sua confirmação...";
  try {
    const response = await fetch("/api/confirmacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input.value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível confirmar.");
    try {
      localStorage.setItem(cancellationKey(data.participant.name, data.eventDate), data.cancellationToken);
    } catch {}
    status.textContent = "Presença confirmada! Você poderá retirar sua confirmação neste navegador.";
    input.value = "";
    await loadParticipants();
  } catch (error) {
    status.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
loadParticipants();
loadSchedule();
</script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=UTF-8", "Cache-Control": "public, max-age=60, s-maxage=300", "X-Content-Type-Options": "nosniff" } });
}
