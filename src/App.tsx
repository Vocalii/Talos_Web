/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { ParallaxExperience } from './components/ParallaxExperience';

const ProductStorySection = lazy(() =>
  import('./components/product-story/ProductStorySection').then((m) => ({
    default: m.ProductStorySection,
  }))
);

// Opt-in preview for the (not yet mounted) product showcase: /?preview=product-story
// Remove this flag once the section has a home in the page flow.
const isProductStoryPreview =
  new URLSearchParams(window.location.search).get('preview') === 'product-story';

export default function App() {
  return (
    <main className="w-full min-h-screen bg-[#050505] text-white selection:bg-white/20 selection:text-white">
      {isProductStoryPreview ? (
        <Suspense fallback={null}>
          <ProductStorySection />
        </Suspense>
      ) : (
        <ParallaxExperience />
      )}
    </main>
  );
}
