import clsx from "clsx";
import React from "react";

type InputProps = {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  name: string;

  // Controlled
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // Uncontrolled
  defaultValue?: string;
};

export default function Input({
  label,
  id,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
  name,
  value,
  onChange,
  defaultValue,
}: InputProps) {
  const isControlled = value !== undefined;

  return (
    <>
      <label
        className="block text-sm font-medium leading-7 text-card-foreground"
        htmlFor={id}
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        autoComplete={id}
        disabled={disabled}

        // ✅ Core Fix: Controlled vs Uncontrolled handling
        {...(isControlled
          ? {
              value,
              onChange:
                onChange ||
                (() => {
                  console.warn(
                    `Input "${name}" is controlled but missing onChange handler`
                  );
                }),
            }
          : {
              defaultValue,
            })}

        className={clsx(
          "block w-full rounded-md border-0 py-1.5 px-3 mb-2 text-card-foreground shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 outline-sky-300",
          disabled && "opacity-100 cursor-default"
        )}
      />
    </>
  );
}