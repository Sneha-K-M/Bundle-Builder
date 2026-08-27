import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { STORAGE_KEY } from "../utils/persistence";

afterEach(() => {
  cleanup();
  window.localStorage.removeItem(STORAGE_KEY);
});
