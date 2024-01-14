// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from "$fresh/server.ts";
import type { Provider } from "npm:@supabase/supabase-js";
import { redirect } from "@/utils/http.ts";
import { State } from "@/plugins/session.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const provider = form.get("provider") as Provider;

    if (typeof provider !== "string") {
      return new Response(null, { status: 400 });
    }

    const { origin } = new URL(req.url);

    const { data, error } = await ctx.state.supabaseClient.auth
      .signInWithOAuth(
        {
          provider,
          options: {
            redirectTo: origin + "/auth/callback",
            scopes: "profile email",
          },
        },
      );

    if (error) throw error;

    return redirect(data.url);
  },
};
