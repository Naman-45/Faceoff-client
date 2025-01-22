import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary"
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseClasses = "py-3 px-6 rounded-lg font-semibold text-center transition-all duration-300 ease-in-out"
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    secondary: "bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl",
    tertiary: "bg-purple-500 text-white hover:bg-purple-600 shadow-lg hover:shadow-xl",
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

