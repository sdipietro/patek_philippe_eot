import Link from 'next/link';
import clsx from 'clsx';
import styles from './Button.module.css';

type ButtonProps = {
  kind?: 'primary' | 'secondary' | 'text';
  onNavy?: boolean;
  trailingArrow?: boolean;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
};

export default function Button({
  kind = 'primary',
  onNavy,
  trailingArrow,
  href,
  onClick,
  children,
  className,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const cls = clsx(
    styles.btn,
    kind === 'primary' && styles.primary,
    kind === 'secondary' && styles.secondary,
    kind === 'text' && styles.text,
    onNavy && styles.onNavy,
    className,
  );

  const arrow = trailingArrow ? (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.arrow}
      aria-hidden="true"
    >
      <path d="M4 12h15" />
      <path d="M14 7l5 5-5 5" />
    </svg>
  ) : null;

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
        {arrow}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
      {arrow}
    </button>
  );
}
