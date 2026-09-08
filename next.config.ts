import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// withPayload wires the admin's bundling and server-external packages.
export default withPayload(nextConfig, { devBundleServerPackages: false });
