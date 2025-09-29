export default function TempEnvCheck() {
  return (
    <pre style={{whiteSpace: "pre-wrap", fontSize: 12}}>
      {`VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY (first 12): ${(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").slice(0,12)}
NODE_ENV: ${import.meta.env.MODE}
`}
    </pre>
  );
}
