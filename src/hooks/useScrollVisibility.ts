import { RefObject, useEffect, useRef, useState } from "react";

interface UseScrollVisibilityOptions {
  hideThreshold?: number;
}

export function useScrollVisibility(
  scrollableRef: RefObject<HTMLElement | null>,
  options: UseScrollVisibilityOptions = {},
): boolean {
  const { hideThreshold = 50 } = options;
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const scrollElement = scrollableRef.current;
    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      const currentScrollTop = scrollElement.scrollTop;

      if (currentScrollTop > lastScrollTopRef.current && currentScrollTop > hideThreshold) {
        setIsHidden(true);
      } else if (currentScrollTop < lastScrollTopRef.current) {
        setIsHidden(false);
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [hideThreshold, scrollableRef]);

  return isHidden;
}
