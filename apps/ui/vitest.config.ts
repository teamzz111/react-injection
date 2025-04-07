import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./.storybook/vitest.setup.ts"], // si usas mocks u otras configuraciones globales
    include: ["src/__test__/**/*.test.ts?(x)"],
    exclude: ["**/*.stories.tsx", "**/node_modules/**"],
  },
});
