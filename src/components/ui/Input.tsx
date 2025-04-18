"use client";

import React, { forwardRef } from "react";

type InputProps = {
  type?: string;
  placeholder?: string;
  error?: string;
  label?: string;
  fullWidth?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      placeholder,
      error,
      label,
      fullWidth = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputClasses = `px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    } ${fullWidth ? "w-full" : ""} ${className}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
        {label && (
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
