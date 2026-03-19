'use client';

import { useEffect } from 'react';

/**
 * Hook to handle browser extension interference that can cause hydration mismatches.
 * Browser extensions like Bitwarden, LastPass, etc. often add attributes like
 * bis_skin_checked, data-lastpass-icon-root, etc. to DOM elements.
 */
export function useBrowserExtensionProtection() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Known attributes added by browser extensions
    const extensionAttributes = [
      'bis_skin_checked',  // Bitwarden
      'data-lastpass-icon-root',  // LastPass
      'data-1password-candidate',  // 1Password
      'data-dashlane-rid',  // Dashlane
      'data-kwift-detected',  // Keeper
      'autocapitalize',  // Various extensions
      'autocomplete',  // Various password managers
    ];

    // Function to clean extension attributes from an element
    const cleanExtensionAttributes = (element: Element) => {
      try {
        extensionAttributes.forEach(attr => {
          if (element.hasAttribute && element.hasAttribute(attr)) {
            element.removeAttribute(attr);
          }
        });
      } catch (error) {
        // Silently ignore errors to prevent breaking the app
        console.warn('Extension attribute cleanup failed:', error);
      }
    };

    let observer: MutationObserver | null = null;

    try {
      // Clean all existing elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(cleanExtensionAttributes);

      // Set up mutation observer to clean attributes as they're added
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          try {
            if (mutation.type === 'attributes') {
              const target = mutation.target as Element;
              if (extensionAttributes.includes(mutation.attributeName || '')) {
                target.removeAttribute(mutation.attributeName!);
              }
            } else if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  cleanExtensionAttributes(node as Element);
                  // Clean all child elements too
                  const childElements = (node as Element).querySelectorAll('*');
                  childElements.forEach(cleanExtensionAttributes);
                }
              });
            }
          } catch (error) {
            // Silently ignore mutation observer errors
            console.warn('Mutation observer error:', error);
          }
        });
      });

      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: extensionAttributes,
      });
    } catch (error) {
      // If anything fails, just log it and continue
      console.warn('Browser extension protection setup failed:', error);
    }

    // Cleanup on unmount
    return () => {
      if (observer) {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn('Failed to disconnect mutation observer:', error);
        }
      }
    };
  }, []);
}

export default useBrowserExtensionProtection;