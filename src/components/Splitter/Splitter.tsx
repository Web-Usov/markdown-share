import { PropsWithChildren, useEffect, useState } from "react";
import Split from "react-split";
import { cn, useCachedState } from "../../utils";
import "./splitter.css";

interface SplitterProps {
  className?: string;
}

export function Splitter({
  children,
  className,
}: PropsWithChildren<SplitterProps>) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [sizes, setSizes] = useCachedState<number[]>(
    "splitter:sizes",
    [50, 50]
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Split
      sizes={sizes}
      onDragEnd={(sizes) => {
        setSizes(sizes);
      }}
      minSize={100}
      direction={isMobile ? "vertical" : "horizontal"}
      //   className={`split ${
      //     isMobile ? "split-vertical" : "split-horizontal"
      //   } overflow-hidden`}
      className={cn(
        "split overflow-hidden h-full",
        {
          "split-vertical": isMobile,
          "split-horizontal": !isMobile,
        },
        className
      )}
    >
      {children}
    </Split>
  );
}
