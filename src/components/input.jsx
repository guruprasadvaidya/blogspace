import React, { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  {
    label,
    type = "text",
    className = "",
    ...props
  },
  ref
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-[#211D25]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        ref={ref}
        {...props}
        className={`w-full rounded-xl border border-[#EAE7E2] bg-white px-3 py-2.5 text-sm text-[#211D25] outline-none transition placeholder:text-[#A49DA8] focus:border-[#7956A8] focus:ring-2 focus:ring-[#7956A8]/10 disabled:cursor-not-allowed disabled:bg-[#F5F3F6] ${className}`}
      />
    </div>
  );
});

export default Input;