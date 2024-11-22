import { createClient } from "@supabase/supabase-js";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || "";
const SUPABASE_GRAPH_URL = process.env.REACT_APP_SUPABASE_GRAPH_URL || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const client = new ApolloClient({
  uri: SUPABASE_GRAPH_URL,
  headers: {
    apiKey: SUPABASE_KEY,
  },
  cache: new InMemoryCache(),
});
