import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrivacyPage from "./privacy/page";
import TermsPage from "./terms/page";

describe("legal pages", () => {
  it("explains how user credentials and monitoring data are handled", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: "隐私政策" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/DeepSeek API Key/)).toHaveLength(2);
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("states the MVP service boundaries", () => {
    render(<TermsPage />);

    expect(
      screen.getByRole("heading", { name: "服务条款" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/不保证互联网信息完整/)).toBeInTheDocument();
  });
});
