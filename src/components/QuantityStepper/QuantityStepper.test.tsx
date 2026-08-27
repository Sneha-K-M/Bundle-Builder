import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import QuantityStepper from "./QuantityStepper";

describe("QuantityStepper", () => {
  it("disables decrement at the minimum quantity", async () => {
    const user = userEvent.setup();
    const onDecrement = vi.fn();
    const onIncrement = vi.fn();

    render(
      <QuantityStepper
        quantity={0}
        min={0}
        label="Camera"
        onDecrement={onDecrement}
        onIncrement={onIncrement}
      />
    );

    await user.click(screen.getByRole("button", { name: /decrease/i }));
    expect(onDecrement).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /increase/i }));
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });
});
