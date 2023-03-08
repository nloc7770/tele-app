import { motion } from 'framer-motion';
import React from 'react';

// interface to declare all our prop types
interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string, // default, primary, info, success, warning, danger, dark
    size?: string, // sm, md, lg
    disabled?: boolean;
    className?: string

}

const Button: React.FC<Props> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled,
    className,
    ...rest
}) => {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={`btn ${variant} ${size} ${className}` + (disabled ? ' disabled' : '')}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;