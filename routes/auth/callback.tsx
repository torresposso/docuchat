import type { Handlers } from "$fresh/server.ts";
import { State } from "@/plugins/session.ts";
import { redirect } from "@/utils/http.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code")!;

    const { data, error } = await ctx.state.supabaseClient!.auth
      .exchangeCodeForSession(
        code,
      );

    return redirect("/", 303);
  },
};
