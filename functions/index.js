const OG_IMAGE = "https://alquilatucancha-public.s3.sa-east-1.amazonaws.com/production/public/clubs/bg/bg_default.jpeg";

function nextEvent() {
  const zone = "America/Sao_Paulo";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  const today = new Date(Date.UTC(+p.year, +p.month - 1, +p.day));
  const nowMinutes = Number(p.hour) * 60 + Number(p.minute);
  const schedules = [{ day: 4, minutes: 19 * 60, time: "19:00" }, { day: 6, minutes: 6 * 60, time: "06:00" }];
  for (let offset = 0; offset <= 7; offset++) {
    const candidate = new Date(today);
    candidate.setUTCDate(candidate.getUTCDate() + offset);
    const schedule = schedules.find(item => item.day === candidate.getUTCDay());
    if (!schedule) continue;
    if (offset === 0 && nowMinutes > schedule.minutes) continue;
    const eventDate = candidate.toISOString().slice(0, 10);
    const label = offset === 0 ? "É HOJE!" : offset === 1 ? "É AMANHÃ!" : "PRÓXIMO FUTEBOL";
    const date = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC", weekday: "long", day: "2-digit", month: "long", year: "numeric"
    }).format(candidate);
    return { eventDate, time: schedule.time, label, date };
  }
  throw new Error("Não foi possível calcular o próximo futebol.");
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
export async function onRequest(context) {
  const event = nextEvent();
  const date = event.date;
  const desc = `${event.label} ${date}, às ${event.time}, no Campo do Corujão. Futebol oficial: quinta à noite e sábado pela manhã. Obrigatório o uso do colete ou de camisas nas cores do colete.`;
  const canonical = new URL(context.request.url).origin + "/";
  const html = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2"><link rel="icon" type="image/png" sizes="180x180" href="/apple-touch-icon.png?v=5"><meta name="theme-color" content="#071a33"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Futebol">
<title>PRÓXIMO FUTEBOL | Campo do Corujão</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Futebol no Campo do Corujão">
<meta property="og:title" content="PRÓXIMO FUTEBOL"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1000"><meta property="og:image:height" content="667"><meta property="og:image:alt" content="Campo de futebol com gramado verde e arquibancadas">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="PRÓXIMO FUTEBOL">
<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${OG_IMAGE}">
<meta name="theme-color" content="#071a33">
<style>
*{box-sizing:border-box}body{margin:0;background:#071a33;color:#fff;font-family:Arial,Helvetica,sans-serif;min-height:100vh;display:grid;place-items:center;padding:24px}
main{width:min(100%,620px);overflow:hidden;border-radius:22px;background:#102b4d;box-shadow:0 20px 60px #0006}
.hero{position:relative;min-height:250px;background:linear-gradient(0deg,#071a33ee,#071a3330);display:flex;align-items:end;padding:28px;isolation:isolate;overflow:hidden}.hero-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:-1}
.tag{display:inline-block;background:#b8f34a;color:#102b13;font-size:12px;font-weight:800;letter-spacing:1.5px;padding:8px 12px;border-radius:30px;margin-bottom:12px}
h1{font-size:clamp(34px,8vw,54px);line-height:.98;margin:0;font-weight:900;letter-spacing:-1.5px}.weekly-schedule{margin:10px 0 0;color:#fff;font-size:12px;font-weight:800;letter-spacing:.8px;text-shadow:0 2px 8px #000}
.content{padding:28px}.date{color:#b8f34a;font-weight:800;font-size:18px;text-transform:capitalize;margin:0 0 22px}
.details{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px 22px;align-items:center;margin-bottom:12px}.detail{display:flex;gap:10px;align-items:center;font-size:16px;min-width:0}.detail .time-line{min-width:0;flex-wrap:wrap}.detail strong{white-space:nowrap}.event-status[hidden]{display:none}.event-status{margin:0 0 24px;padding:11px 14px;border-radius:10px;background:#ffffff0d;border:1px solid #ffffff26;text-align:center;font-weight:900;letter-spacing:.3px;color:#ffd2ca}.event-status.confirmed{color:#b8f34a;border-color:#b8f34a66;background:#b8f34a12}.time-line{display:flex;flex-direction:column;align-items:flex-start;gap:5px;min-width:0}.detail-value{display:flex;align-items:center;gap:8px;min-width:0;overflow-wrap:anywhere}.edit-time{flex:0 0 30px;min-width:30px;width:30px;height:30px;margin:0;padding:0;border:1px solid #7890aa;border-radius:8px;background:#ffffff16;color:#b8f34a;font-size:16px;line-height:1}.symbol{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#ffffff14;font-size:19px;flex:none}
.notice{border-left:4px solid #b8f34a;background:#ffffff0d;padding:15px 16px;border-radius:0 12px 12px 0;line-height:1.5;margin:22px 0 26px}
.form-title{font-size:20px;margin:0 0 12px}.name-input{width:100%;padding:16px;border:1px solid #68809b;border-radius:12px;background:#fff;color:#102b4d;font-size:17px;outline:none}.name-input:focus{border-color:#b8f34a;box-shadow:0 0 0 3px #b8f34a33}
button{width:100%;border:0;cursor:pointer;text-align:center;background:#b8f34a;color:#102b13;font-weight:900;font-size:17px;padding:17px 20px;border-radius:12px;margin-top:12px}
button:disabled{opacity:.65;cursor:wait}.status{min-height:22px;color:#d7e6f6;font-size:14px;margin:10px 0 0}
.participants{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 22px;padding:14px 16px;background:#0b2340;border:1px solid #ffffff26;border-radius:12px}.count{color:#b8f34a;font-weight:800;margin:0}.participants-toggle{width:auto;flex:none;margin:0;background:#ffffff16;color:#fff;border:1px solid #7890aa;padding:11px 14px;font-size:13px}.participants-screen{position:fixed;inset:0;z-index:20;background:#041225f2;display:flex;justify-content:center;align-items:flex-start;padding:24px 16px;overflow-y:auto}.participants-screen[hidden]{display:none}.participants-panel{width:min(100%,580px);max-height:calc(100vh - 48px);overflow-y:auto;padding:20px;background:#102b4d;border:1px solid #7890aa;border-radius:18px;box-shadow:0 20px 60px #0009}.participants-panel h2{font-size:22px;margin:0}.participants-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.participants-close{width:auto;margin:0;padding:9px 12px;background:#ffffff16;color:#fff;border:1px solid #7890aa;font-size:13px}.names{list-style:decimal;margin:0;padding-left:28px;display:grid;gap:8px}.names li{padding:0 0 0 4px;overflow-wrap:anywhere}.participant-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;background:#ffffff0d;border-radius:9px}.person-name{overflow-wrap:anywhere}.cancel-button{width:auto;flex:none;margin:0;padding:8px 10px;border:1px solid #ffb4a8;background:transparent;color:#ffd2ca;font-size:12px;border-radius:8px}.empty{color:#c4d2e1;font-size:14px}.cancel-status{min-height:18px;color:#ffd2ca;font-size:13px;margin:12px 0 0}
.schedule-editor{margin:-8px 0 22px;padding:14px;background:#0b2340;border:1px solid #ffffff26;border-radius:12px}.schedule-editor[hidden]{display:none}.schedule-title{font-weight:800;color:#b8f34a;margin:0 0 10px}.schedule-controls{display:flex;gap:8px;align-items:center}.schedule-controls input{min-width:0;flex:1;padding:11px;border:1px solid #68809b;border-radius:9px;font-size:16px}.schedule-controls button{width:auto;margin:0;padding:11px 14px;font-size:13px}.schedule-status{font-size:13px;color:#d7e6f6;margin:8px 0 0}.foot{text-align:center;color:#b7c6d8;font-size:12px;margin-top:18px}

/* Refinamento visual: painel principal e lista de participantes */
.details{gap:14px;margin-bottom:16px}
.detail{padding:12px;background:linear-gradient(135deg,#ffffff12,#ffffff08);border:1px solid #ffffff20;border-radius:14px;min-height:66px}
.detail .time-line{gap:6px}
.detail strong{color:#b8c8d9;font-size:12px;letter-spacing:.35px;text-transform:uppercase}
.detail-value{font-weight:800;color:#fff}
.symbol{background:#b8f34a1c;color:#b8f34a;border:1px solid #b8f34a35}
.event-status{box-shadow:inset 0 1px #ffffff0c}
.participants{background:linear-gradient(135deg,#17385e,#0b2340);border:1px solid #ffffff30;box-shadow:0 8px 20px #0002}
.count{font-size:15px;letter-spacing:.1px}
.participants-toggle{font-weight:800;letter-spacing:.35px;transition:background .15s ease,border-color .15s ease}
.participants-toggle:hover{background:#ffffff25;border-color:#b8f34a}
.participants-panel{background:linear-gradient(160deg,#15385f,#102b4d 55%);border-color:#ffffff35}
.participants-panel h2{font-weight:900;letter-spacing:-.35px}
.names{gap:9px;padding-left:30px}
.names li{padding-left:5px}
.names li::marker{color:#b8f34a;font-weight:900}
.participant-row{min-height:48px;padding:10px 12px;background:#ffffff12;border:1px solid #ffffff12;border-radius:11px;transition:background .15s ease}
.participant-row:hover{background:#ffffff19}
.person-name{font-weight:700;line-height:1.3}
.cancel-button{font-weight:800;letter-spacing:.15px;transition:background .15s ease,border-color .15s ease}
.cancel-button:hover{background:#ffb4a81a;border-color:#ffd2ca}
@media (max-width:600px){
  body{padding:0;place-items:start center;min-height:100svh}
  .details{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px 12px}.detail{min-width:0;gap:6px}.detail .time-line{min-width:0}.detail-value{white-space:nowrap;font-size:clamp(11px,3.1vw,14px);gap:3px}.symbol{width:29px;height:29px;flex:0 0 29px}.edit-time{flex:0 0 25px;min-width:25px;width:25px;height:25px}
  .detail{font-size:15px}
  main{width:100%;border-radius:0;min-height:100svh}
  .hero{min-height:clamp(135px,21svh,175px);padding:18px}
  .content{padding:16px 18px}
  .date{font-size:16px;margin:0 0 13px}
  .details{gap:9px;margin-bottom:12px}
  .detail{font-size:clamp(13px,3.5vw,15px);align-items:center;gap:7px;padding:9px 8px;min-height:58px}.detail .time-line{gap:4px;flex-wrap:nowrap}.detail strong{font-size:10px;white-space:normal}.detail-value{gap:3px;font-size:clamp(11px,3.1vw,14px)}.edit-time{flex:0 0 25px;min-width:25px;width:25px}
  .symbol{width:29px;height:29px;border-radius:9px;font-size:15px;flex:0 0 29px}.edit-time{width:25px;height:25px;font-size:13px}.event-status{font-size:13px;padding:9px 11px;margin:0 0 13px}
  .count{font-size:13px}
  .participant-row{min-height:45px;padding:9px 10px}
  .notice{padding:12px 14px;margin:13px 0 16px;font-size:13px;line-height:1.45}.participants{align-items:center;padding:10px 12px;gap:10px;margin:0 0 14px}
  .count{font-size:13px;line-height:1.35}
  .participants-toggle{padding:9px 11px;font-size:12px}.form-title{font-size:18px;margin:0 0 9px}.name-input{font-size:16px;padding:13px}button{font-size:14px;padding:13px 14px;margin-top:10px}.status{font-size:13px;min-height:18px;margin:8px 0 0}.foot{font-size:11px;margin-top:12px}
  .participants-screen{padding:12px}
  .participants-panel{max-height:calc(100dvh - 24px);padding:16px}
  .participants-header{align-items:flex-start}
  .participants-panel h2{font-size:19px}
  .schedule-controls{flex-wrap:wrap}
  .schedule-controls input{flex:1 1 150px}
}
@media (max-width:380px){
  body{padding:0}
  main{border-radius:0;min-height:100svh}
  .hero{min-height:130px;padding:16px}
  .content{padding:13px 15px}
  .participants{flex-wrap:nowrap}
  .count{flex:1 1 auto}
  .participants-toggle{width:auto}
  .detail{gap:5px;padding:8px 6px}
  .edit-time{flex:0 0 23px;min-width:23px;width:23px;height:23px}
  .participant-row{padding:8px;gap:6px}
  .cancel-button{padding:8px;font-size:11px}
}

/* Correções de encaixe no celular: evita transbordamento do lápis e reduz a altura do painel */
.detail-value{flex:1 1 auto;min-width:0}
.detail-value>span:first-child{min-width:0;overflow-wrap:anywhere}
.edit-time{flex:0 0 25px}
@media (max-width:600px){
  .detail-value{white-space:normal}
  .detail-value>span:first-child{flex:1 1 auto;line-height:1.2}
  .edit-time{flex:0 0 23px;min-width:23px;width:23px;height:23px}
  .hero{min-height:clamp(180px,28svh,225px);padding:18px}
  .content{padding:11px 16px}
  .date{font-size:15px;margin:0 0 9px}
  .details{gap:8px;margin-bottom:9px}
  .detail{min-height:50px;padding:7px 7px;gap:5px}
  .detail .time-line{gap:3px}
  .detail strong{font-size:9px}
  .detail-value{font-size:clamp(10px,2.9vw,13px);gap:3px}
  .symbol{width:26px;height:26px;flex:0 0 26px;font-size:14px}
  .event-status{padding:7px 9px;margin-bottom:9px;font-size:12px}
  .notice{padding:9px 11px;margin:9px 0 11px;font-size:12px;line-height:1.35}
  .participants{padding:8px 10px;margin-bottom:10px}
  .participants-toggle{padding:8px 10px;font-size:11px}
  .form-title{font-size:16px;margin-bottom:7px}
  .name-input{padding:10px;font-size:15px}
  #submit-button{padding:10px 12px;margin-top:7px}
  .status{min-height:15px;margin-top:5px;font-size:12px}
  .foot{margin-top:7px;font-size:10px}
}
@media (max-width:600px) and (max-height:720px){
  .hero{min-height:clamp(155px,24svh,185px)}
  .content{padding-top:9px;padding-bottom:8px}
  .date{margin-bottom:7px}
  .notice{margin-top:7px;margin-bottom:8px}
  .participants{margin-bottom:8px}
  .foot{margin-top:5px}
}
@media (max-width:600px) and (orientation:landscape){
  body{padding:10px}
  .hero{min-height:160px}
}

/* Lista de participantes: visual de lista simples, organizada e compacta */
.names{display:block;list-style:decimal;padding-left:30px;margin:0}
.names li{padding:0;border-bottom:1px solid #ffffff20}
.names li:last-child{border-bottom:0}
.names li::marker{color:#b8f34a;font-weight:900}
.participant-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;padding:8px 4px;background:transparent;border:0;border-radius:0}
.person-name{flex:1 1 auto;min-width:0;font-size:15px;font-weight:700;line-height:1.35}
.cancel-button{padding:7px 10px;font-size:11px}
@media(max-width:600px){
  .participants-panel{padding:15px}
  .names{padding-left:26px}
  .participant-row{min-height:43px;padding:7px 3px;gap:8px}
  .person-name{font-size:14px}
}
</style></head><body><main>
<section class="hero"><img class="hero-photo" src="${OG_IMAGE}" alt="" onerror="this.onerror=null;this.src=&#39;https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&amp;fit=crop&amp;w=1200&amp;h=630&amp;q=85&#39;"><div><span class="tag">${esc(event.label)}</span><h1>FUTEBOL</h1><p class="weekly-schedule">QUINTAS ÀS 19H&nbsp; • &nbsp;SÁBADOS ÀS 6H</p></div></section>
<section class="content"><p class="date">${esc(date)}</p>
<div class="details"><div class="detail"><span class="symbol">⏰</span><span class="time-line"><strong>Horário:</strong><span class="detail-value"><span id="event-time">${esc(event.time)}</span><button class="edit-time" id="edit-time" type="button" aria-label="Editar horário" title="Editar horário">✎</button></span></span></div>
<div class="detail"><span class="symbol">📍</span><span class="time-line"><strong>Local:</strong><span class="detail-value"><span id="event-location">Campo do Corujão</span><button class="edit-time" id="edit-location" type="button" aria-label="Editar local" title="Editar local">✎</button></span></span></div></div>
<p class="event-status" id="event-status" role="status" aria-live="polite" hidden></p>
<section class="schedule-editor" id="location-editor" hidden><p class="schedule-title">Editar local</p><div class="schedule-controls"><input id="location-input" type="text" maxlength="100" placeholder="Informe o local" aria-label="Novo local"><button id="location-save" type="button">SALVAR</button></div><p class="schedule-status" id="location-status" role="status"></p></section>
<section class="schedule-editor" id="schedule-editor" hidden><p class="schedule-title">Editar horário</p><div class="schedule-controls"><input id="schedule-input" type="text" inputmode="numeric" maxlength="5" pattern="(?:[01][0-9]|2[0-3]):[0-5][0-9]" placeholder="HH:MM" value="06:00" aria-label="Novo horário no formato 24 horas"><button id="schedule-save" type="button">SALVAR</button></div><p class="schedule-status" id="schedule-status" role="status"></p></section>
<div class="notice"><strong>ATENÇÃO!</strong><br>Obrigatório o uso do colete ou de camisas nas cores do colete.</div>
<section class="participants" aria-live="polite">
<p class="count" id="participant-count">Carregando confirmações...</p>
<button class="participants-toggle" id="participants-toggle" type="button" aria-expanded="false" aria-controls="participants-screen">VER NOMES</button>
</section>
<div class="participants-screen" id="participants-screen" hidden>
<div class="participants-panel" role="dialog" aria-modal="true" aria-labelledby="participants-title">
<div class="participants-header"><h2 id="participants-title">Participantes confirmados</h2><button class="participants-close" id="participants-close" type="button" aria-label="Fechar">✕</button></div>
<ol class="names" id="participant-list"></ol><p class="cancel-status" id="cancel-status" role="status" aria-live="polite"></p>
</div>
</div>
<form id="confirm-form">
<h2 class="form-title">Confirme sua participação</h2>
<input class="name-input" id="participant-name" name="name" type="text" minlength="2" maxlength="70" autocomplete="name" placeholder="Digite seu nome" required>
<button id="submit-button" type="submit">CONFIRMAR MINHA PARTICIPAÇÃO</button>
<p class="status" id="form-status" role="status" aria-live="polite"></p>
</form>
<p class="foot">Sua confirmação ficará visível para os demais participantes.</p></section></main>
<script>
window.NEXT_EVENT_DATE = "${event.eventDate}";
const form = document.getElementById("confirm-form");
const input = document.getElementById("participant-name");
const button = document.getElementById("submit-button");
const status = document.getElementById("form-status");
const count = document.getElementById("participant-count");
const eventStatus = document.getElementById("event-status");
const list = document.getElementById("participant-list");
const cancelStatus = document.getElementById("cancel-status");
const participantsToggle = document.getElementById("participants-toggle");
const participantsScreen = document.getElementById("participants-screen");
const participantsClose = document.getElementById("participants-close");
const eventTime = document.getElementById("event-time");
const scheduleEditor = document.getElementById("schedule-editor");
const editTime = document.getElementById("edit-time");
const scheduleInput = document.getElementById("schedule-input");
const scheduleSave = document.getElementById("schedule-save");
const scheduleStatus = document.getElementById("schedule-status");
const eventLocation = document.getElementById("event-location");
const locationEditor = document.getElementById("location-editor");
const editLocation = document.getElementById("edit-location");
const locationInput = document.getElementById("location-input");
const locationSave = document.getElementById("location-save");
const locationStatus = document.getElementById("location-status");
function closeParticipants() {
  participantsScreen.hidden = true;
  participantsToggle.setAttribute("aria-expanded", "false");
}
participantsToggle.addEventListener("click", () => {
  participantsScreen.hidden = false;
  participantsToggle.setAttribute("aria-expanded", "true");
});
participantsClose.addEventListener("click", closeParticipants);
participantsScreen.addEventListener("click", event => {
  if (event.target === participantsScreen) closeParticipants();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !participantsScreen.hidden) closeParticipants();
});

let scheduleDigits = "";
function renderScheduleDigits() {
  const digits = scheduleDigits.padStart(4, "0");
  scheduleInput.value = digits.slice(0, 2) + ":" + digits.slice(2);
}
scheduleInput.addEventListener("keydown", event => {
  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    scheduleDigits = (scheduleDigits + event.key).slice(-4);
    renderScheduleDigits();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    scheduleDigits = scheduleDigits.slice(0, -1);
    renderScheduleDigits();
  } else if (event.key === "Delete") {
    event.preventDefault();
    scheduleDigits = "";
    renderScheduleDigits();
  } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
  }
});
scheduleInput.addEventListener("paste", event => {
  event.preventDefault();
  const pasted = (event.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(-4);
  scheduleDigits = pasted;
  renderScheduleDigits();
});
editLocation.addEventListener("click", () => {
  locationInput.value = eventLocation.textContent.trim();
  locationStatus.textContent = "";
  locationEditor.hidden = false;
  locationInput.focus();
  locationInput.select();
});
async function loadLocation() {
  try {
    const response = await fetch("/api/local", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar o local.");
    eventLocation.textContent = data.location;
    locationInput.value = data.location;
  } catch (error) { locationStatus.textContent = error.message; }
}
locationSave.addEventListener("click", async () => {
  const location = locationInput.value.trim();
  if (location.length < 2) { locationStatus.textContent = "Informe um local válido."; return; }
  locationSave.disabled = true;
  locationStatus.textContent = "Salvando local...";
  try {
    const response = await fetch("/api/local", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível salvar o local.");
    eventLocation.textContent = data.location;
    locationInput.value = data.location;
    locationEditor.hidden = true;
    locationStatus.textContent = "";
  } catch (error) { locationStatus.textContent = error.message; }
  finally { locationSave.disabled = false; }
});
editTime.addEventListener("click", () => {
  scheduleDigits = "";
  scheduleInput.value = "00:00";
  scheduleStatus.textContent = "Digite os números da direita para a esquerda. Ex.: 1 = 00:01; 1234 = 12:34.";
  scheduleEditor.hidden = false;
  scheduleInput.focus();
});
async function loadSchedule() {
  try {
    const response = await fetch("/api/horario?eventDate=" + encodeURIComponent(window.NEXT_EVENT_DATE), { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar o horário.");
    eventTime.textContent = data.time;
    scheduleInput.value = data.time;
  } catch (error) { scheduleStatus.textContent = error.message; }
}
scheduleSave.addEventListener("click", async () => {
  const time = scheduleInput.value.trim();
  if (!/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    scheduleStatus.textContent = "Informe um horário válido.";
    return;
  }
  scheduleSave.disabled = true;
  scheduleStatus.textContent = "Salvando horário...";
  try {
    const response = await fetch("/api/horario", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time, eventDate: window.NEXT_EVENT_DATE })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível salvar.");
    eventTime.textContent = data.time;
    scheduleInput.value = data.time;
    scheduleEditor.hidden = true;
    scheduleStatus.textContent = "";
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
  cancelStatus.textContent = "Cancelando sua participação...";
  status.textContent = "";
  try {
    const response = await fetch("/api/confirmacoes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, eventDate })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível cancelar.");
    localStorage.removeItem(key);
    status.textContent = "Sua confirmação foi retirada com sucesso.";
    closeParticipants();
    await loadParticipants();
  } catch (error) {
    cancelStatus.textContent = error.message;
    cancelButton.disabled = false;
  }
}
function showParticipants(data) {
  list.replaceChildren();
  cancelStatus.textContent = "";
  count.textContent = data.total + (data.total === 1 ? " pessoa confirmou presença" : " pessoas confirmaram presença");
  const confirmed = data.total >= 10;
  eventStatus.hidden = data.total === 0;
  eventStatus.textContent = confirmed ? "FUTEBOL CONFIRMADO!" : "FUTEBOL AINDA NÃO CONFIRMADO";
  eventStatus.classList.toggle("confirmed", confirmed);
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
let participantsRefreshInProgress = false;
async function loadParticipants() {
  if (participantsRefreshInProgress) return;
  participantsRefreshInProgress = true;
  try {
    const response = await fetch("/api/confirmacoes", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar a lista.");
    showParticipants(data);
  } catch (error) {
    count.textContent = "Não foi possível carregar as confirmações.";
    status.textContent = error.message;
  } finally {
    participantsRefreshInProgress = false;
  }
}

// Sincroniza automaticamente todas as telas abertas, mesmo se a conexão
// de atualização em tempo real do navegador não estiver disponível.
loadParticipants();
setInterval(loadParticipants, 2500);
window.addEventListener("focus", loadParticipants);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) loadParticipants();
});
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
    status.textContent = "Presença confirmada!";
    input.value = "";
    await loadParticipants();
  } catch (error) {
    status.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
loadSchedule();
loadLocation();
</script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=UTF-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
