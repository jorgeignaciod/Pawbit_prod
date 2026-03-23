import Image from "next/image";

import { getInitials } from "@/lib/utils";

export function AvatarPet({
  name,
  src,
  size = 56
}: {
  name: string;
  src?: string;
  size?: number;
}) {
  if (!src) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-pawbit-chip-active text-sm font-semibold text-pawbit-text"
        style={{ width: size, height: size }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover"
    />
  );
}
