import React from 'react';

const Card = ({ children, className = "", ...props }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`} {...props}>
        {children}
    </div>
);

export default Card;
