import { createServerClient } from "npm:@supabase/ssr";

import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";

export function createSupabaseClient(
  context: {
    req: Request;
    resHeaders?: Headers;
  },
) {
  return createServerClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_KEY")!,
    {
      cookies: {
        get: (name) => {
          const cookies = getCookies(context.req.headers);
          const cookie = cookies[name] ?? "";
          return decodeURIComponent(cookie);
        },
        set: (name, value, options) => {
          if (!context.resHeaders) return;
          setCookie(context.resHeaders, {
            name,
            value: encodeURIComponent(value),
            ...options,
            sameSite: "Lax",
            httpOnly: false,
          });
        },
        remove: (name) => {
          if (!context.resHeaders) return;
          deleteCookie(context.resHeaders, name);
        },
      },
    },
  );
}
