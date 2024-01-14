// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import { Plugin } from "$fresh/server.ts";
import type { FreshContext } from "$fresh/server.ts";
import { UnauthorizedError } from "@/utils/http.ts";
import { createSupabaseClient } from "@/utils/supabase.ts";
import type { Session } from "npm:@supabase/supabase-js";

export interface State {
  session?: Session;
  supabaseClient: ReturnType<typeof createSupabaseClient>;
}

export type SignedInState = Required<State>;

export function assertSignedIn(
  ctx: { state: State },
): asserts ctx is { state: SignedInState } {
  if (ctx.state.session === undefined) {
    throw new UnauthorizedError("User must be signed in");
  }
}

async function setSessionState(
  req: Request,
  ctx: FreshContext<State>,
) {
  if (ctx.destination !== "route") return await ctx.next();

  if (ctx.state.supabaseClient) {
    console.log("client already set");
    return await ctx.next();
  }

  // Initial state

  const headers = new Headers();

  const supabaseClient = createSupabaseClient({ req, resHeaders: headers });

  const { data: { session } } = await supabaseClient.auth.getSession();

  if (session) {
    console.log("session..:", session);
    ctx.state.session = session;
  }
  ctx.state.supabaseClient = supabaseClient;

  const response = await ctx.next();
  /**
   * Note: ensure that a `new Response()` with a `location` header is used when performing server-side redirects.
   * Using `Response.redirect()` will throw as its headers are immutable.
   */
  headers.forEach((value, key) => response.headers.append(key, value));
  return response;
}

async function ensureSignedIn(
  _req: Request,
  ctx: FreshContext<State>,
) {
  assertSignedIn(ctx);
  return await ctx.next();
}

/**
 * Adds middleware to the defined routes that ensures the client is signed-in
 * before proceeding. The {@linkcode ensureSignedIn} middleware throws an error
 * equivalent to the
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401|HTTP 401 Unauthorized}
 * error if `ctx.state.session` is `undefined`.
 *
 * The thrown error is then handled by {@linkcode handleWebPageErrors}, or
 * {@linkcode handleRestApiErrors}, if the request is made to a REST API
 * endpoint.
 *
 * @see {@link https://fresh.deno.dev/docs/concepts/plugins|Plugins documentation}
 * for more information on Fresh's plugin functionality.
 */
export default {
  name: "session",
  middlewares: [
    {
      path: "/",
      middleware: { handler: setSessionState },
    },

    {
      path: "/me",
      middleware: { handler: ensureSignedIn },
    },
    {
      path: "/api",
      middleware: { handler: ensureSignedIn },
    },
  ],
} as Plugin<State>;
