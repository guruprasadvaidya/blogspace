import React, { forwardRef, useId } from "react";

const Select = forwardRef(function Select(
  {
    options = [],
    label,
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

      <select
        id={id}
        ref={ref}
        {...props}
        className={`w-full rounded-xl border border-[#EAE7E2] bg-white px-3 py-3 text-sm text-[#211D25] outline-none transition focus:border-[#7956A8] focus:ring-2 focus:ring-[#7956A8]/10 ${className}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;