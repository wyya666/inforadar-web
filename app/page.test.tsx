import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("introduces the product and exposes the primary actions", () => {
    render(<Home />);

    expect(screen.getByText("InfoRadar")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "让重要信息主动找到你" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "开始创建雷达" })).toHaveAttribute(
      "href",
      "/register",
    );
    expect(screen.getByRole("link", { name: "登录" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
