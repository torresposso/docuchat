// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers, PageProps } from "$fresh/server.ts";
import { SignedInState, State } from "@/plugins/session.ts";
import { redirect } from "@/utils/http.ts";
import GoogleOauthButton from "@/components/GoogleOauthButton.tsx";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  /**
   * Redirects the client to the authenticated redirect path if already login.
   * If not logged in, it continues to rendering the login page.
   */
  async GET(_req, ctx) {
    const { data: { session } } = await ctx.state.supabaseClient.auth
      .getSession();

    if (session) {
      return redirect("/");
    }

    return ctx.render();
  },
};

/**
 * If an error message isn't one of these possible error messages, the error message is not displayed.
 * This is done to avoid phising attacks.
 * E.g. if the `error` parameter's value is "Authentication error: please send your password to mrscammer@shady.com".
 */
const POSSIBLE_ERROR_MESSAGES = new Set([
  "Invalid login credentials",
]);

export default function LoginPage(props: PageProps) {
  const errorMessage = props.url.searchParams.get("error");

  return (
    <>
      <div class="max-w-xs flex h-screen m-auto">
        <div class="m-auto w-72">
          <GoogleOauthButton />
        </div>
      </div>
    </>
  );
}
