type IconProps = {
  id: string;
  size?: number;
  className?: string;
};

export default function Icon({ id, size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ display: 'inline-block', verticalAlign: '-0.125em', fill: 'none' }}
    >
      <use href={`/icons.svg#${id}`} />
    </svg>
  );
}
