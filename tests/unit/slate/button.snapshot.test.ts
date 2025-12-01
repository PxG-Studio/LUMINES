import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Button } from "@/design-system/primitives/Button";

describe("Button Component Snapshots", () => {
  test("Button renders default", () => {
    const { container } = render(<Button>Click Me</Button>);
    expect(container).toMatchSnapshot();
  });

  test("Button renders primary variant", () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    expect(container).toMatchSnapshot();
  });

  test("Button renders secondary variant", () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    expect(container).toMatchSnapshot();
  });

  test("Button renders disabled state", () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(container).toMatchSnapshot();
  });

  test("Button renders loading state", () => {
    const { container } = render(<Button loading>Loading</Button>);
    expect(container).toMatchSnapshot();
  });
});

