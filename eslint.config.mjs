import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
export default defineConfig([...tseslint.configs.recommended, { files: ["**/*.{ts,tsx}"], plugins: { "react-hooks": hooks }, rules: { "react-hooks/rules-of-hooks": "error", "react-hooks/exhaustive-deps": "warn" } }, globalIgnores(["dist/**", ".wrangler/**", ".next/**", ".superpowers/**", "worker-configuration.d.ts", "next-env.d.ts", "playwright-report/**", "test-results/**", "*.cjs"])]);
