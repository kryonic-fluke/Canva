import React from "react";

interface SpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "light";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  text,
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-16 w-16 border-4",
  }[size];

  const variantClasses = {
    primary: "border-blue-500 border-t-transparent",
    light: "border-white border-t-transparent",
  }[variant];

  const textClasses = {
    primary: "text-gray-700",
    light: "text-white",
  }[variant];

  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-4 ${className}`} >
     
      <div className={`rounded-full ${sizeClasses} ${variantClasses} animate-spin`} />
      {text && (
        <span className={`text-lg font-medium ${textClasses}`}>{text}</span>
      )}
    </div>
  );
};
