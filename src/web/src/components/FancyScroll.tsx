import React from 'react';

import { styled } from '@mui/material';

const Scrollbar = styled('div')`
  /* width */
  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: none;
    padding: 0.5rem 0;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.palette.primary.main};
    border: 0;
    border-radius: 0;
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.palette.primary.main};
  }
`;

export type IntersectionTransform = (
  element: HTMLElement,
  overlap: IntersectionObserverEntry
) => void;

type Props = React.PropsWithChildren<Record<string, unknown>> & {
  transform: IntersectionTransform;
  overlapThreshold?: number;
  className?: string;
};

// overlap thresholds determine when the IntersectionObserver calls the callback
// This sets up the callback to be called every 2% change in overlap
const DEFAULT_OVERLAP_THRESHOLD = 2;

/**
 * Returns Threshold array for ue in IntersectionObserver
 * @param percent number between 0 and 100 representing the amount of overlap change that should trigger the callback
 * @returns Array for use in the IntersectionObserver of values between 0 and 1 separated by percent
 */
function getOverlapThresholds(percent: number) {
  const count = 100 / percent;
  return Array.from({ length: 1 + count }).map((_, i) => i / count);
}

/**
 * Attatches the transform action to the result of IntersectionObserver changes to children to the given element -
 * that is, changes the elements children when they scroll in and out of view
 *
 * @param element The parent element which has an overflow scroll property meaning its children scroll in and out of view (and will be directly modified)
 * @param threshold The Threshold array passed to the IntersectionObserver determining when the transform is applied
 * @param transform The transform that changes elements that are partially scrolled out of view
 * @returns a callback to be called when the listener should be disconnected
 */
function scrollWatch(
  element: HTMLElement,
  threshold: number[],
  transform: IntersectionTransform
) {
  const intersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.intersectionRatio > 0) {
          transform(entry.target as HTMLElement, entry);
        }
      }
    },
    { root: element, threshold }
  );

  // Listen for any changes to the child list of element, and observer
  const mutationObserver = new MutationObserver(
    (mutationList: MutationRecord[]) => {
      mutationList.forEach((mutation: MutationRecord) => {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType) {
              intersectionObserver.observe(node as Element);
            }
          }
          // Documentation is not entirely clear about whether it is necessary to stop watching elements that are removed
          for (const node of mutation.removedNodes) {
            if (node.nodeType) {
              intersectionObserver.unobserve(node as Element);
            }
          }
        }
      });
    }
  );

  mutationObserver.observe(element, { childList: true });

  for (const child of element.children) {
    intersectionObserver.observe(child);
  }

  return () => {
    intersectionObserver.disconnect();
    mutationObserver.disconnect();
  };
}

export const FadeAndShrink = (factor = 30): IntersectionTransform => {
  return (element: HTMLElement, overlap: IntersectionObserverEntry) => {
    const { intersectionRatio } = overlap;
    element.style.opacity = `${intersectionRatio}`;
    element.style.width = `${intersectionRatio * factor + 70}%`;
  };
};

/**
 * FancyScroll enables transforming its children's elements based on the degree to which there is an
 * overlap between the children and the container - that is, enabling things such as fading out as things
 * are scrolled out of view
 * I tried to get this to work more with React with managing Refs...but the tooling there does not scale very
 * easily to many refs, and working with the elements themselves seemed more straightforward
 *
 * @param transform the transform to apply to an element as it is partially visible
 * @param overlapThreshold The percentage overlap change which will trigger the transform being reapplied
 * @param children The children!
 * @returns a div wrapping the children
 */
function FancyScroll({
  transform,
  overlapThreshold,
  className,
  children,
}: Props) {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref !== null) {
      const threshold = getOverlapThresholds(
        overlapThreshold || DEFAULT_OVERLAP_THRESHOLD
      );
      return scrollWatch(ref, threshold, transform);
    }
    return () => {
      /* Don't need to do anything on disconnect if ref is null */
    };
  }, [ref, overlapThreshold, transform]);

  return (
    <Scrollbar className={ className } ref={ setRef }>
      {children}
    </Scrollbar>
  );
}

export default FancyScroll;