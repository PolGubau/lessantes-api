/**
 * Worker bindings & env variables.
 * Secrets are injected by Wrangler at runtime.
 */
export type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  FESTIVAL_ID: string;
  API_VERSION: string;
  DATA_LICENSE_URL: string;
};

export type AppEnv = {
  Bindings: Bindings;
};
