export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase"],
  supabase: {
    redirect: false,
    types: "./app/types/database.types.ts",
  },
});
