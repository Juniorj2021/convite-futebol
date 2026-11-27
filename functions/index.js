function getTomorrowDate() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const tomorrow = new Date(Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day) + 1
  ));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(tomorrow);
}

export async function onRequest({ request }) {
  const date = getTomorrowDate();
  const url = new URL(request.url);
  const canonical = url.origin + "/";
  const image = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=85";
  const form = "https://docs.google.com/forms/d/e/1FAIpQLSfqI61hldeVto7ooqm6kZnhChei0pvuGS4ZwPwdmWl8Tmxqhg/viewform";
  const description = `Amanhã, ${date}, às 6h, no Campo do Corujão. Obrigatório o uso do colete ou de camisas nas cores do colete.`;

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FUTEBOL AMANHÃ | Campo do Corujão</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Futebol no Campo do Corujão">
  <meta property="og:title" content="FUTEBOL AMANHÃ">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="FUTEBOL AMANHÃ">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta name="theme-color" content="#071a33">
  <style>
    *{box-sizing:border-box}body{margin:0;background:#071a33;color:#fff;font-family:Arial,Helvetica,sans-serif;min-height:100vh;display:grid;place-items:center;padding:24px}
    main{width:min(100%,620px);overflow:hidden;border-radius:22px;background:#102b4d;box-shadow:0 20px 60px #0006}
    .hero{min-height:250px;background:linear-gradient(0deg,#071a33eF,#071a3330),url('${image}') center/cover;display:flex;align-items:end;padding:28px}
    .tag{display:inline-block;background:#b8f34a;color:#102b13;font-size:12px;font-weight:800;letter-spacing:1.5px;padding:8px 12px;border-radius:30px;margin-bottom:12px}
    h1{font-size:clamp(34px,8vw,54px);line-height:.98;margin:0;font-weight:900;letter-spacing:-1.5px}
    .content{padding:28px}.date{color:#b8f34a;font-weight:800;font-size:18px;text-transform:capitalize;margin:0 0 22px}
    .details{display:grid;gap:14px;margin-bottom:24px}.detail{display:flex;gap:12px;align-items:center;font-size:17px}.symbol{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#ffffff14;font-size:19px;flex:none}
    .notice{border-left:4px solid #b8f34a;background:#ffffff0d;padding:15px 16px;border-radius:0 12px 12px 0;line-height:1.5;margin:22px 0 26px}
    a.cta{display:block;text-align:center;background:#b8f34a;color:#102b13;text-decoration:none;font-weight:900;font-size:17px;padding:17px 20px;border-radius:12px}
    .foot{text-align:center;color:#b7c6d8;font-size:12px;margin-top:18px}
  </style>
</head>
<body>
  <main>
    <section class="hero"><div><span class="tag">É AMANHÃ!</span><h1>FUTEBOL<br>AMANHÃ</h1></div></section>
    <section class="content">
      <p class="date">${date}</p>
      <div class="details">
        <div class="detail"><span class="symbol">⏰</span><span><strong>Horário:</strong> 6h</span></div>
        <div class="detail"><span class="symbol">📍</span><span><strong>Local:</strong> Campo do Corujão</span></div>
      </div>
      <div class="notice"><strong>ATENÇÃO!</strong><br>Obrigatório o uso do colete ou de camisas nas cores do colete.</div>
      <a class="cta" href="${form}" target="_blank" rel="noopener noreferrer">CONFIRMAR MINHA PARTICIPAÇÃO</a>
      <p class="foot">Confirme sua presença pelo formulário.</p>
    </section>
  </main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "public, max-age=300, s-maxage=300"
    }
  });
}
