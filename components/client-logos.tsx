'use client'

import { useEffect, useState } from 'react'

// Lista estática de logos dos clientes
const staticLogos = [
  "/images/clients/ap-trading.png",
  "/images/clients/apbef.png",
  "/images/clients/amae.png",
  "/images/clients/alil.png",
  "/images/clients/afrochic.png",
  "/images/clients/wefa-natura.png",
  "/images/clients/wacomb-gb.png",
  "/images/clients/unido.png",
  "/images/clients/unicef.png",
  "/images/clients/undp.png",
  "/images/clients/sos.png",
  "/images/clients/rnep.png",
  "/images/clients/papaloca.png",
  "/images/clients/nha-guinendadi.png",
  "/images/clients/mtn.png",
  "/images/clients/mobiss.png",
  "/images/clients/mindjer-i-futuru.png",
  "/images/clients/hotel-uaque.png",
  "/images/clients/guine-bissau-digital.png",
  "/images/clients/governo.png",
  "/images/clients/fogao-de-ouro.png",
  "/images/clients/darling.png",
  "/images/clients/convenção-cidadã.png",
  "/images/clients/cica.png",
  "/images/clients/bioguinea.png",
  "/images/clients/barbershop-aos.png",
  "/images/clients/arn.png",
  "/images/clients/ucb.png",
  "/images/clients/tchico-te.png",
  "/images/clients/onagb.png",
  "/images/clients/no-firmanta.png",
  "/images/clients/ligcca.png",
  "/images/clients/genesis.png",
  "/images/clients/kaucriar.png",
  "/images/clients/fundei.png",
  "/images/clients/gamela.png",
  "/images/clients/ens.png",
  "/images/clients/ena.png",
  "/images/clients/apgb.png",
  "/images/clients/bissau-rising.png"
];

export function ClientLogos() {
  const [logos, setLogos] = useState<string[]>([]);

  useEffect(() => {
    // Ensure logos are unique to prevent issues if staticLogos has duplicates by mistake
    setLogos(staticLogos.filter((logo, index, self) => self.indexOf(logo) === index));
  }, []);

  const duplicatedLogos = [...logos, ...logos];

  if (logos.length === 0) {
    return <div className="text-center text-gray-500">Carregando logos...</div>;
  }

  const animationDuration = logos.length * 1; // Each logo gets ~1 second
  
  // Define a fixed width for each logo slot (content area + padding + margin)
  // Content area for image: 120px
  // p-4 (1rem padding each side): 2 * 16px = 32px (assuming 1rem = 16px)
  // mx-2 (0.5rem margin each side): 2 * 8px = 16px
  // Total slot width: 120 + 32 + 16 = 168px. 
  // The padding and margin are part of the item's fixed width.
  const logoSlotWidth = 168;

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div
        className="flex animate-scroll"
        style={{
          width: `${duplicatedLogos.length * logoSlotWidth}px`, // Total width of the track
          animationDuration: `${animationDuration}s`,
        }}
      >
        {duplicatedLogos.map((logoSrc, index) => (
          <div
            key={index}
            // Each item has fixed width. Tailwind classes p-4 and mx-2 define padding/margin *within* this fixed width.
            className="flex items-center justify-center p-4 mx-2"
            style={{ 
              flex: `0 0 ${logoSlotWidth}px`, // flex-grow, flex-shrink, flex-basis
              width: `${logoSlotWidth}px` 
            }}
          >
            <img
              alt={`Cliente ${index % logos.length + 1}`}
              className="max-h-12 md:max-h-16 w-auto object-contain" // Image will fit within the content box (120px wide after padding)
              src={logoSrc}
              onError={(e) => {
                // Option 1: Hide broken image icon (browser default)
                // e.currentTarget.style.display = 'none';
                // Option 2: Replace with a placeholder or specific style if needed
                console.error(`Failed to load logo: ${logoSrc}`);
                (e.target as HTMLImageElement).style.visibility = 'hidden'; // Keeps space, hides icon
              }}
            />
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%); /* Scroll by the width of the original set of logos */
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
      `}</style>
    </div>
  );
}

// NOTE FOR THE USER:
// 1. The above code implements a client-side scrolling carousel.
// 2. Reading the file system directly with 'fs' in a 'use client' component is not feasible
//    for Next.js App Router. I've used a static list (staticLogos) for now.
//    To make this dynamic based on the 'public/images/clients' folder:
//    a. Create an API route (e.g., 'app/api/logos/route.ts') that reads the directory and returns the list of image paths.
//    b. Fetch this list in the 'ClientLogos' component using 'useEffect' and 'fetch'.
//    OR
//    c. If 'app/page.tsx' can be a Server Component (or parts of it), read the logos there and pass them as a prop to 'ClientLogos'.
// 3. The animation speed is set so each original logo effectively gets about 1 second of prominence before the loop continues.
//    The 'animationDuration' is set to the total number of unique logos in seconds.
// 4. The width of each logo slot is now fixed at 'logoSlotWidth' (168px). This includes space for padding and margins.
//    The image inside will use 'object-contain' to fit within the content area (120px wide) and defined max-height.
// 5. I've added a fallback for 'getClientLogos' and then switched to 'staticLogos' because 'fs' won't work as expected in 'use client'.
//    The 'staticLogos' array includes all logos found in the directory previously. Please ensure this list is accurate.
// 6. I added 'use client' at the top because this component uses React hooks (useState, useEffect).
// 7. Included 'filter((logo, index, self) => self.indexOf(logo) === index)' to prevent issues if logos are accidentally duplicated in the static list.
// 8. Added a basic 'onError' handler for images to hide them if they fail to load, and log an error.
