import { IconProps } from "./types";

export function ChevronRightIcon({
  size = 24,
  className = "",
  ...props
}: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 5L16 12L9 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
