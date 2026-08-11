export interface Env {
	// If you set another name in the Wrangler config file for the value for 'binding',
	// replace "DB" with the variable name you defined.
	sou_db: D1Database;
}

export default {
	async fetch(request, env): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (pathname === "/api/beverages") {
			// If you did not use `DB` as your binding name, change it here
			const { results } = await env.sou_db.prepare(
				"SELECT * FROM Members WHERE Email = ? AND Firstname = ? AND Surname = ?",
			)
				.bind("example@example.com", 1)
				.bind("Tester", 2)
				.bind("Testson", 3)
				.run();
			return Response.json(results);
		}

		return new Response(
			"Call /api/beverages to see everyone who works at Bs Beverages",
		);
	},
} satisfies ExportedHandler<Env>;