import { render, screen } from "@testing-library/react";
import PrizeList from "../../pages/PrizeList";
import { AppProvider } from "../../context/AppContext";

jest.mock("../../context/AppContext", () => ({
  useApp: () => ({
    prizes: [
      { id: "1", name: "一等奖", count: 1, level: 1 },
      { id: "2", name: "二等奖", count: 2, level: 2 },
    ],
  }),
  AppProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("PrizeList", () => {
  it("renders prize list correctly", () => {
    render(
      <AppProvider>
        <PrizeList />
      </AppProvider>
    );

    expect(screen.getByText("奖品列表")).toBeInTheDocument();
    expect(screen.getByText("总数量：3")).toBeInTheDocument();
    expect(screen.getByText("一等奖")).toBeInTheDocument();
    expect(screen.getByText("二等奖")).toBeInTheDocument();
  });
});
