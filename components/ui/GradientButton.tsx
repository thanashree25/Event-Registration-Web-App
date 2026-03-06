import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function GradientButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: GradientButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center
        rounded-full px-10 py-4
        bg-gradient-to-r from-red-600 to-rose-800
        font-semibold text-white text-base
        border-0 outline-none

        shadow-lg shadow-red-900/30

        transition-all duration-300 ease-out cursor-pointer

        hover:scale-105
        hover:shadow-[0_0_32px_rgba(159,18,57,0.45)]

        active:scale-[0.97]

        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:scale-100 disabled:hover:shadow-none

        ${className}
      `}
    >
      {children}
    </button>
  );
}
