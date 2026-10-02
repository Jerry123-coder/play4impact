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
  // 20% community codes
  c677e1fa9cb612d930a831c12151dad7764e78d47cb22150b0a6eff8a41e588b: { percent: 20, community: 'SpaceX' },
  dc04efbaccb6cef649a3d70a4efbe26f418f31dc124c24f3f43e5dc321914192: { percent: 20, community: 'Accra Active Club' },
  '2fa55d6772e08fa24b72bf81b9a9fb33ad709b7483a62e6f7ba373ad11eb55bf': { percent: 20, community: '7even Sports' },
  '517aba72cfff23acb3d68dac4117f953e9ca2aa77520ad7303db1f6d60ac6b09': { percent: 20, community: 'Global Shapers Accra Hub' },
  dd00259d02af7328361590b29ff39f67dcfd8336961af26ac37a9b1468927880: { percent: 20, community: 'Because She Can' },
  e9acea25a7adbdd0cdbf0afafd3b0b6d06e86cb460e92c8c291ea6d135e52083: { percent: 20, community: 'Ladies In Design Network' },
  '16065cd7d3b5ea53986e005d5dca84a01f6903dfc6db5848d8759546bf9d19f1': { percent: 20, community: 'AWS Community' },
  '934ea7bcd515b1cf9ca833289b0d26dd02f42eb9b2868cf8b4721a7ff8ce1c32': { percent: 20, community: 'Valorcity Wellness Club' },
  c694bb6b4cb34a5123c4173b5bf4cdc80e43efb4c421b9d349f3cc07e4bf367e: { percent: 20, community: 'Developers In Vogue' },
  '2a831916e71024894615f1b5e66a7681e6b5586827ac54a3ebc3661d4243e132': { percent: 20, community: 'Tema Run Club' },
  '90656f63cfb947c5d547cc017a20ca981970fc10c1b89ace798cf47c473699fe': { percent: 20, community: 'Buro gh' },

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
