export interface Env {
  SUM_OF_US_DB: D1Database;
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/dbTest") {
      const { results } = await env.SUM_OF_US_DB.prepare(
        "SELECT * FROM Members WHERE Id = ?"
      )
        .bind(1)
        .all();
      return Response.json(results);
    }

    return new Response("Testing DB function");
  }
} satisfies ExportedHandler<Env>;