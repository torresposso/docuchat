import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import sessionPlugin from "@/plugins/session.ts";

export default defineConfig({
  plugins: [sessionPlugin, tailwind()],
});
