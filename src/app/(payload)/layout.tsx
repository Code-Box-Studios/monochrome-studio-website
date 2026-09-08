/* Payload's own root layout. This route group renders its own <html>, which is
   why the site's layout lives in the (frontend) group — Next allows multiple
   root layouts only when there is no src/app/layout.tsx above them. */
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import config from "@payload-config";
import type { ReactNode } from "react";

/* The admin's compiled stylesheet. Without it the component CSS still loads but
   every --theme-elevation-* variable it references is undefined, so the admin
   renders as unstyled serif text on a transparent background. */
import "@payloadcms/next/css";

import { importMap } from "./admin/importMap.js";
import "./custom.scss";

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
