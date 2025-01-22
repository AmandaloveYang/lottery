import { render, screen } from "@testing-library/react";
import LotteryPage from "../../pages/LotteryPage";
import { AppProvider } from "../../context/AppContext";

jest.mock("../../context/AppContext", () => ({
  useApp: () => ({
    participants: [],
    remainingPrizes: 0,
    prizes: [],
    setPrizes: jest.fn(),
    setRemainingPrizes: jest.fn(),
    drawOrder: "level-desc",
  }),
  AppProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("LotteryPage", () => {
  it("renders initial state correctly", () => {
    render(
      <AppProvider>
        <LotteryPage />
      </AppProvider>
    );

    expect(screen.getByText("暂无可抽取奖品")).toBeInTheDocument();
    expect(screen.getByText("等待开始")).toBeInTheDocument();
  });
});
