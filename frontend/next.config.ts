import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El monorepo tiene un package-lock en la raíz; fija el contexto en esta app.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
