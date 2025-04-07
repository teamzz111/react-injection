import React, { JSX } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge = ({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps): JSX.Element => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-purple-100 text-purple-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800",
    outline: "bg-transparent border border-gray-200 text-gray-800",
  };

  const badgeClasses = [
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    variantClasses[variant],
    className,
  ].join(" ");

  return (
    <div className={badgeClasses} {...props}>
      {children}
    </div>
  );
};

export default Badge;
