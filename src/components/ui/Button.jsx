import React from 'react';

export const BRAND_COLOR = "bg-[#eb671b]";
export const BRAND_COLOR_HOVER = "hover:bg-[#d35a15]"; // Un poco más oscuro
export const BRAND_SHADOW = "shadow-[#eb671b]/30";

const Button = ({ children, variant = "primary", className = "", onClick, icon: Icon }) => {
    const baseStyle = "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer";
    const variants = {
        primary: `${BRAND_COLOR} ${BRAND_COLOR_HOVER} text-white shadow-lg ${BRAND_SHADOW}`,
        secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
        ghost: `text-slate-500 hover:text-[#eb671b] hover:bg-orange-50 dark:hover:bg-orange-900/20`,
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

export default Button;
