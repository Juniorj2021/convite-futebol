export async function onRequest({ request }) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const names = ["Diego", "J Junior", "Junior Souza", "Lucas", "Matheus Welder", "miro", "Pedro"];
  const endpoint = "https://reminiscent-oyster-516.convex.site/confirmacoes";
  const results = [];
  for (const name of names) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ eventDate: "2026-11-28", name, notify: false })
    });
    const data = await response.json();
    results.push({ name, status: response.status, ok: response.ok, duplicate: !!data.duplicate });
    if (!response.ok && response.status !== 409) {
      return new Response(JSON.stringify({ error: "Falha ao restaurar", results, detail: data }), {
        status: 502, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
      });
    }
  }
  return new Response(JSON.stringify({ restored: results.filter(x => x.ok).length, results }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}
