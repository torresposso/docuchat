import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html data-theme="winter">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>docuchat</title>
        <link rel="stylesheet" href="/styles.css" />
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@4.5.0/dist/full.min.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
