import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <button
      className="bg-blue-500 rounded-md px-4 py-2 shadow-md cursor-pointer text-white"
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";

export { Button };
