"use client";

interface ComingSoonTagProps {
  size?: "sm" | "md" | "lg";
}

export default function ComingSoonTag({ size = "md" }: ComingSoonTagProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-block bg-orange-500 text-white font-semibold rounded-full ${sizeClasses[size]} uppercase tracking-wider select-none`}
    >
      Coming Soon
    </span>
  );
}
