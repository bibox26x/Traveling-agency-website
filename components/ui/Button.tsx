import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'next-i18next';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation('common');

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200',
          {
            'bg-primary-600 text-white hover:bg-primary-500 shadow-md hover:shadow-lg active:shadow-sm active:transform active:scale-95':
              variant === 'primary',
            'bg-secondary-500 text-white hover:bg-secondary-400 shadow-md hover:shadow-lg active:shadow-sm active:transform active:scale-95':
              variant === 'secondary',
            'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:shadow-md active:bg-primary-100 active:transform active:scale-95':
              variant === 'outline',
            'text-primary-600 hover:bg-primary-50 hover:shadow-sm active:bg-primary-100 active:transform active:scale-95':
              variant === 'ghost',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'w-full': fullWidth,
            'opacity-50 cursor-not-allowed hover:shadow-none active:transform-none': disabled || isLoading,
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{t('common.loading')}</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 