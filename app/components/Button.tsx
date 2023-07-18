'use client';

import clsx from "clsx";
import { type } from "os";

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    secondary?: boolean;
    danger?: boolean;
    disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({
    type,
    fullWidth,
    children,
    onClick,
    secondary,
    danger,
    disabled

}) => {
    return (
    <div>
        <button
           onClick={onClick}
           type={type}
           disabled={disabled}
           className={clsx(`
            flex justify-center 
            rounded-md
            px-3
            py-2
            text-sm
            font-semibold
            focus:visible:outline
            focus:visible:outline-2
            focus:visible:outline-offset-2`,
            disabled && 'opacity-50 cursor-default', 
            fullWidth && 'w-full',
            secondary ? 'bg-sky-300'  :'text-white',
            danger && "bg-red-500 hover:bg-red-700 focus-visible:outline-red-600",
            !secondary && !danger &&"bg-gray-500 hover:bg-gray-600 focus-visible:outline-gray-600",
           
           )}
            >
                {children}
        </button>
    </div>
  )
}

export default Button