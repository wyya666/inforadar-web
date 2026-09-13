import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RadarCreationFlow } from "./radar-creation-flow";

describe("RadarCreationFlow", () => {
  it("allows creating a radar without checking platform credits", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><RadarCreationFlow /></QueryClientProvider>);
    expect(await screen.findByLabelText("你想长期关注什么？")).toBeInTheDocument();
    expect(screen.queryByText("本月搜索额度已用完")).not.toBeInTheDocument();
  });
});
