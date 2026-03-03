import React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-8",
        className
      )}
    >
      <InfiniteSlider gap={42} reverse duration={80} durationOnHover={25}>
        {logos.map((logo) => (
          <img
            alt={logo.alt}
            className="h-8 md:h-12 w-auto max-w-[150px] object-contain select-none logo-filter"
            height={logo.height || "auto"}
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width={logo.width || "auto"}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}
