import type React from "react";
import type { ButtonHTMLAttributes } from "react";

export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`rounded border px-2 py-0.5 transition hover:bg-gray-100 active:bg-gray-200 ${className}`}
      {...props}
    >
      {props.children}
    </button>
  );
};
