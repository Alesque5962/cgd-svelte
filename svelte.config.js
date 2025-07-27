import adapterNode from "@sveltejs/adapter-node";
import adapterStatic from "@sveltejs/adapter-static";

const isRender = process.env.RENDER === "true";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: isRender
      ? adapterNode()
      : adapterStatic({
          pages: "build",
          assets: "build",
          fallback: "index.html",
          precompress: false,
          strict: false,
        }),
    paths: {
      base: "",
    },
    // Ajout de la configuration pour ignorer les erreurs de prérendu
    prerender: {
      handleHttpError: "warn",
    },
  },
};

export default config;
