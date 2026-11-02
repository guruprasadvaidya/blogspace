function Button({
  children,
  type = "button",
  bgColor = "bg-[#7956A8]",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-medium transition duration-200 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#7956A8]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;