import { render, screen, fireEvent } from "@testing-library/react";
import Dialog from "../../components/Dialog";

describe("Dialog", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  it("renders dialog with message", () => {
    render(<Dialog isOpen={true} message="测试消息" onClose={mockOnClose} />);

    expect(screen.getByText("测试消息")).toBeInTheDocument();
    expect(screen.getByText("确定")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<Dialog isOpen={true} message="测试消息" onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("确定"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows confirm and cancel buttons when onConfirm is provided", () => {
    render(
      <Dialog
        isOpen={true}
        message="测试消息"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText("取消")).toBeInTheDocument();
    expect(screen.getByText("确定")).toBeInTheDocument();
  });
});
