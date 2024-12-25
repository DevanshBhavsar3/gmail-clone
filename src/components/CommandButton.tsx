import React, { forwardRef } from "react";

interface CommandButtonProps {
  onClick: () => void;
  icon: React.ReactElement;
}

const CommandButton = forwardRef<HTMLButtonElement, CommandButtonProps>(
  ({ onClick, icon }, ref) => {
    return (
      <button onClick={onClick} ref={ref}>
        {icon}
      </button>
    );
  }
);

export default CommandButton;
