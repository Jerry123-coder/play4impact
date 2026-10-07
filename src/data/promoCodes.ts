export interface PromoCode {
  percent: number;
  community: string;
}

// Promo codes are stored only as salted SHA-256 hashes, so the readable codes never
// appear in this public repo or in the site's JavaScript. To add a code, hash it with:
//   node -e 'console.log(require("crypto").createHash("sha256").update("p4i:" + "YOURCODE").digest("hex"))'
// (code in UPPERCASE). Keep the readable list somewhere private.
const PROMO_SALT = 'p4i:';

const promoCodeHashes: Record<string, PromoCode> = {
  // Community codes (12%)
  '1edd1b779cc4bbde4af89f2885ff2993ea0646ac68bf5bf5c8521e076ba4deae': { percent: 12, community: 'SpaceX' },
  'f6900b05fa52c097b85b9d993a2c1c52babf2b1772773b365a4bdd29979a125f': { percent: 12, community: 'Active Accra Club' },
  '64084060b24f4eeb00ce9a372340bd467ee4544e6b0265fd31c2b539845c5390': { percent: 12, community: '7even Sports' },
  '61a87988254acb3db08603de2b5848db9f449020b4ef54fa863d88f3bf3b3b99': { percent: 12, community: 'Global Shapers Accra Hub' },
  '6ee94a4fdb34966b7e04a94bc1ef389c5c6dc5c2332cd266f2b1e9de5cfa7389': { percent: 12, community: 'Because She Can' },
  '0b0a1a8d251f866f337ac236cdf378bc42e7356b1ac8b88e9a13b354535925d0': { percent: 12, community: 'Ladies In Design Network' },
  '702ba0653a5c002b186cb737457700d0e1da2d53f1ad8a7da544c815ef874bf5': { percent: 12, community: 'AWS Community' },
  '436b23c516dcb22f3770a980ad809c401a8f6184746c934b920e6d9924e85dcf': { percent: 12, community: 'Valorcity Wellness Club' },
  '973bd9ab819e9b17195ce69ae4b5cc1fbe105c7efc1e26c568ef50b5604fa077': { percent: 12, community: 'Developers In Vogue' },
  '5f6becf8d193a8f5143b72c82417f96f1dbebf25e9e8041c28cb2d351dd3d0f3': { percent: 12, community: 'Tema Run Club' },
  '3abf80a0bea6c3c162e3382258f9c755f53e6abe06caece7abafede1a9f59ac3': { percent: 12, community: 'Buro gh' },
  '659c850bc30e74913a87db3733e9eda0174b72601a955ac22d6ae16f660eb4c7': { percent: 12, community: 'Runner Alliance' },

  // 12% general code for other partners and Wellness Run participants
  'b6fc7ca0cc2aea5ab68ce2c9e5a7233a535174c722e0787fbcaa6044aa2d754e': { percent: 12, community: 'Partners & Wellness Run' },

  // Earlier 12% community partner codes
  '2e8b875aa9637e5691470e8a64212ac90c8df2b0877cba30e6bf4551202381a6': { percent: 12, community: 'Community Partner' },
  '86be1849ceb20f005653d0b5e6cadcac7b6e9abd064bfb8e572dac98e45df231': { percent: 12, community: 'Community Partner' },
  '4d1df8fef6891b8617579124986fcd79b3e27bad1f51194e8074ad0555873f47': { percent: 12, community: 'Community Partner' },
  '30f13c0af7068213c4957836bb722e20bcfb253d7e45b9eae2abc74fe465ac94': { percent: 12, community: 'Community Partner' },
};

const sha256Hex = async (text: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
};

export const findPromoCode = async (code: string): Promise<PromoCode | null> => {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  return promoCodeHashes[await sha256Hex(PROMO_SALT + normalized)] ?? null;
};
