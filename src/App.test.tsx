import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";
import { STORAGE_KEY } from "./utils/persistence";

describe("Bundle Builder", () => {
  it("seeds the design state and keeps builder and review quantities in sync", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: /choose your cameras/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /your security system/i })).toBeInTheDocument();
    expect(screen.getByText("Wyze Cam v4", { selector: "div" })).toBeInTheDocument();
    expect(screen.getByText("Wyze Cam Pan v3", { selector: "div" })).toBeInTheDocument();

    const cardStepper = screen.getByRole("group", { name: "Quantity of Wyze Cam v4" });
    const reviewStepper = screen.getByRole("group", { name: "Quantity of Wyze Cam v4 in review" });
    expect(within(cardStepper).getByText("1")).toBeInTheDocument();
    expect(within(reviewStepper).getByText("1")).toBeInTheDocument();

    await user.click(within(cardStepper).getByRole("button", { name: /increase/i }));
    expect(within(cardStepper).getByText("2")).toBeInTheDocument();
    expect(within(reviewStepper).getByText("2")).toBeInTheDocument();

    await user.click(within(reviewStepper).getByRole("button", { name: /decrease/i }));
    expect(within(cardStepper).getByText("1")).toBeInTheDocument();
    expect(within(reviewStepper).getByText("1")).toBeInTheDocument();
  });

  it("tracks each variant quantity independently in the review panel", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("radio", { name: "Grey" }));

    const cardStepper = screen.getByRole("group", { name: "Quantity of Wyze Cam v4" });
    expect(within(cardStepper).getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Wyze Cam v4", { selector: "div" })).toBeInTheDocument();
    expect(screen.queryByText("Wyze Cam v4 — Grey")).not.toBeInTheDocument();

    await user.click(within(cardStepper).getByRole("button", { name: /increase/i }));
    await user.click(within(cardStepper).getByRole("button", { name: /increase/i }));

    expect(screen.getByText("Wyze Cam v4 — White")).toBeInTheDocument();
    expect(screen.getByText("Wyze Cam v4 — Grey")).toBeInTheDocument();
    expect(
      within(screen.getByRole("group", { name: "Quantity of Wyze Cam v4 — Grey in review" })).getByText(
        "2"
      )
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("group", { name: "Quantity of Wyze Cam v4 — White in review" })).getByText(
        "1"
      )
    ).toBeInTheDocument();
  });

  it("advances the accordion with Next", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /next: choose your plan/i }));
    expect(screen.getByRole("button", { name: /next: choose your sensors/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /select plan/i })).toBeInTheDocument();
  });

  it("restores a saved bundle after reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    const cardStepper = screen.getByRole("group", { name: "Quantity of Wyze Cam v4" });
    await user.click(within(cardStepper).getByRole("button", { name: /increase/i }));
    await user.click(screen.getByRole("button", { name: /save my system for later/i }));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeTruthy();

    unmount();
    render(<App />);

    expect(
      within(screen.getByRole("group", { name: "Quantity of Wyze Cam v4" })).getByText("2")
    ).toBeInTheDocument();
    expect(screen.getByText(/restored your saved system/i)).toBeInTheDocument();
  });
});
