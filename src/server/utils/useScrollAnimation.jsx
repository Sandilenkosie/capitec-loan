
import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const observedElements = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    const observeElements = () => {
      const hiddenElements = document.querySelectorAll('.animate-on-scroll');
      hiddenElements.forEach((el) => {
        if (!observedElements.has(el)) {
          observedElements.add(el);
          observer.observe(el);
        }
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);
};

export default useScrollAnimation;