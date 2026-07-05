import { useState } from "react";

type AvatarProps = {
  src?: string;
  name: string;
  className?: string;
};

export default function UserAvatar({ src, name, className = "h-10 w-10" }: AvatarProps) {

  const [hasError, setHasError] = useState(false);

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const bgColors = [
    "bg-emerald-600",
    "bg-blue-600",
    "bg-indigo-600",
    "bg-purple-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-teal-600",
  ];

  const colorIndex = name 
    ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % bgColors.length 
    : 0;

  const selectedBgColor = bgColors[colorIndex];

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className={`${className} rounded-full object-cover border border-slate-700`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center rounded-full border border-slate-700/50 shadow-inner ${selectedBgColor}`}
    >
      <span className="font-bold text-white tracking-wider text-sm drop-shadow-md">
        {initial}
      </span>
    </div>
  );
}