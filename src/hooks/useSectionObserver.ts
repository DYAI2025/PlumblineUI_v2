import { useEffect, useState, useRef } from "react";

/**
 * Custom hook to track active section in the viewport using IntersectionObserver.
 * Stabilizes performance to prevent expensive re-evaluations and allows optional callbacks.
 */
export function useSectionObserver(
  sectionIds: string[],
  options?: IntersectionObserverInit,
  onSectionActive?: (id: string) => void
) {
  const [activeSection, setActiveSection] = useState<string>("");
  const activeSectionRef = useRef<string>("");
  const onSectionActiveRef = useRef(onSectionActive);

  // Sync callbacks to avoid ref-dependency effect recreation
  useEffect(() => {
    onSectionActiveRef.current = onSectionActive;
  }, [onSectionActive]);

  // Transform array into static string key to bypass literal array reference recreation cycle
  const serializedIds = sectionIds.join(",");

  useEffect(() => {
    const ids = serializedIds.split(",").filter(Boolean);
    if (ids.length === 0) return;

    // Track detailed intersection ratios of visible sections
    const intersectionMap = new Map<string, number>();

    const observerOptions = options || {
      root: null,
      rootMargin: "-20% 0px -20% 0px", // Trigger when elements occupy comfort reading middle field
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Granular tracking of visibility
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && entry.intersectionRatio > 0.02) {
          intersectionMap.set(id, entry.intersectionRatio);
        } else {
          intersectionMap.delete(id);
        }
      });

      // Elect the section that is most prominent in viewport
      let maxRatio = -1;
      let mostVisibleId = "";

      intersectionMap.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleId = id;
        }
      });

      if (mostVisibleId && mostVisibleId !== activeSectionRef.current) {
        activeSectionRef.current = mostVisibleId;
        setActiveSection(mostVisibleId);
        if (onSectionActiveRef.current) {
          onSectionActiveRef.current(mostVisibleId);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
      observer.disconnect();
    };
  }, [serializedIds, options]);

  return activeSection;
}

