import { expect, test } from "vitest";

test("vitest runs in a browser-like environment", () => {
  const element = document.createElement("div");
  element.textContent = "InfoRadar";

  expect(element).toHaveTextContent("InfoRadar");
});
