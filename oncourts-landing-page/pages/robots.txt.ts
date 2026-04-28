import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const isLocalEnv = process.env.NEXT_PUBLIC_ENV === "local";

  const body = isLocalEnv
    ? [
        "User-agent: *",
        "Disallow: /",
      ].join("\n")
    : [
        "User-agent: *",
        "Allow: /",
      ].join("\n");

  res.setHeader("Content-Type", "text/plain");
  res.send(body);
}
