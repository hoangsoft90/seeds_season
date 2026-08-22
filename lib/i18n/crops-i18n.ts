/**
 * Crop Names i18n — provides localized crop names.
 *
 * Strategy: Each crop has canonical_vi (always Vietnamese, matches crop_id).
 * This module maps crop_id → translations in all supported languages.
 *
 * When a language is selected, the UI pulls the translated name from here.
 * Falls back to canonical_vi if no translation exists.
 */

import { getCurrentLanguage, type LanguageCode } from "./index";

/** Localized name for a crop. All fields optional — fallback to canonical_vi. */
interface CropLocalName {
  en?: string;
  th?: string;
  id?: string;
  vi?: string; // same as canonical_vi, included for completeness
}

/**
 * Translation map: crop_id → localized names.
 * Only crops that have meaningful translations are listed.
 * Unlisted crops fall back to their canonical_vi name.
 */
const CROP_NAMES: Record<string, CropLocalName> = {
  // === Vietnam crops ===
  rau_muong: { en: "Water Spinach", th: "ผักบุ้ง", id: "Kangkung" },
  rau_den: { en: "Malabar Spinach", th: "ผักปัง", id: "Bayam Hutan" },
  rau_thom: { en: "Vietnamese Herbs", th: "สมุนไพรเวียดนาม", id: "Rempah Vietnam" },
  rau_mb: { en: "Morning Glory", th: "ผักบุ้งจีน", id: "Kangkung Tiongkok" },
  hat_giong_ot: { en: "Chili Seeds", th: "เม็ดพริก", id: "Biji Cabai" },
  hat_giong_ca_chua_bi: { en: "Cherry Tomato Seeds", th: "เม็ดมะเขือเทศ", id: "Biji Tomat Ceri" },
  hat_giong_dau_bap: { en: "Corn Seeds", th: "เม็ดข้าวโพด", id: "Biji Jagung" },
  hat_giong_cu_cai: { en: "Radish Seeds", th: "เม็ดหัวไชเท้า", id: "Biji Lobak" },
  hat_giong_su_hao: { en: "Kohlrabi Seeds", th: "เม็ดคะน้าเกาหลี", id: "Biji Kubis Jerman" },
  hat_giong_bap_cai: { en: "Cabbage Seeds", th: "เม็ดกะหล่ำปลี", id: "Biji Kubis" },
  hat_giong_ot_hung_yen: { en: "Hung Yen Chili Seeds", th: "เม็ดพริกฮั่งเยิน", id: "Biji Cabai Hung Yen" },
  hat_giong_ca_chua_bi_hai_phong: { en: "Hai Phong Cherry Tomato", th: "เม็ดมะเขือเทศไฮฟอง", id: "Tomat Ceri Hai Phong" },
  hat_giong_dau_bap_ngu_son: { en: "Ngu Son Corn", th: "ข้าวโพดงูซอน", id: "Jagung Ngu Son" },
  hat_giong_cu_cai_bac_giang: { en: "Bac Giang Radish", th: "หัวไชเท้าบั๊กซาง", id: "Lobak Bac Giang" },
  hat_giong_su_hao_da_lat: { en: "Da Lat Kohlrabi", th: "คะน้าเกาหลีดาลัด", id: "Kubis Jerman Da Lat" },

  // === Thailand crops ===
  kaphrao: { en: "Holy Basil", th: "กะเพรา", id: "Kemangi Suci" },
  bai_makrut: { en: "Kaffir Lime Leaf", th: "ใบมะกรูด", id: "Daun Jeruk Purut" },
  khai_bai: { en: "Cha-om Shoots", th: "ขาไก่", id: "Tunas Cha-om" },
  bon_khao: { en: "Thai Basil", th: "โหระพา", id: "Basil Thailand" },
  pak_bung: { en: "Water Morning Glory", th: "ผักบุ้ง", id: "Kangkung" },
  chaplu: { en: "Rice Paddy Herb", th: "ผักช้อน", id: "Daun Chaplu" },
  ta_khai: { en: "Praew Leaf", th: "ใบไผ่", id: "Daun Praew" },
  khmin: { en: "Thai Coriander", th: "ผักชีลาว", id: "Ketumbar Thailand" },
  makua_pro: { en: "Thai Eggplant", th: "มะเขือพวง", id: "Terong Thai" },
  prik_kii_noo: { en: "Bird's Eye Chili", th: "พริกขี้หนู", id: "Cabai Rawit" },

  // === Indonesia crops ===
  kangkung: { en: "Water Spinach", th: "ผักบุ้ง", id: "Kangkung" },
  kemangi: { en: "Lemon Basil", th: "โหระพาเลมอน", id: "Kemangi" },
  cabai_rawit: { en: "Bird's Eye Chili", th: "พริกขี้หนู", id: "Cabai Rawit" },
  terong: { en: "Eggplant", th: "มะเขือ", id: "Terong" },
  seledri: { en: "Celery", th: "เซเลอรี่", id: "Seledri" },
  daun_bawang: { en: "Green Onion", th: "ต้นหอม", id: "Daun Bawang" },
  kacang_panjang: { en: "Long Bean", th: "ถั่วฝักยาว", id: "Kacang Panjang" },
  bayam: { en: "Amaranth", th: "ผักโขม", id: "Bayam" },
  mentimun: { en: "Cucumber", th: "แตงกวา", id: "Mentimun" },
  cabai_merah: { en: "Red Chili", th: "พริกแดง", id: "Cabai Merah" },

  // === USA crops ===
  basil: { en: "Sweet Basil", th: "โหระพาหวาน", id: "Basil Manis" },
  cherry_tomato: { en: "Cherry Tomato", th: "มะเขือเทศเชอร์รี่", id: "Tomat Ceri" },
  jalapeno: { en: "Jalapeño Pepper", th: "พริกฮาลาเป뇨", id: "Cabai Jalapeño" },
  lettuce: { en: "Lettuce", th: "ผักกาดหอม", id: "Selada" },
  cilantro: { en: "Cilantro", th: "ผักชี", id: "Ketumbar Daun" },
  bell_pepper: { en: "Bell Pepper", th: "พริกหวาน", id: "Paprika" },
  green_onion: { en: "Green Onion", th: "ต้นหอม", id: "Daun Bawang" },
  parsley: { en: "Parsley", th: "พาสลีย์", id: "Peterseli" },
  radish: { en: "Radish", th: "หัวไชเท้า", id: "Lobak" },
  spinach: { en: "Spinach", th: "ผักโขม", id: "Bayam" },
  strawberry: { en: "Strawberry", th: "สตรอว์เบอร์รี่", id: "Stroberi" },
  mint: { en: "Mint", th: "สะระแหน่", id: "Mint" },

  // === UK crops ===
  runner_bean: { en: "Runner Bean", th: "ถั่วฝักยาวอังกฤษ", id: "Kacang Inggris" },
  courgette: { en: "Courgette (Zucchini)", th: "ซูกินี", id: "Zucchini" },
  tomato: { en: "Tomato", th: "มะเขือเทศ", id: "Tomat" },
  pea_shoots: { en: "Pea Shoots", th: "หน่อถั่วลันเตา", id: "Tunas Kacang Polong" },
  dwarf_bean: { en: "Dwarf French Bean", th: "ถั่วฝักสั้น", id: "Kacang Kerdil" },
  spring_onion: { en: "Spring Onion", th: "ต้นหอมอังกฤษ", id: "Bawang Musim Semi" },
  thyme: { en: "Thyme", th: "ไทม์", id: "Tyme" },
  sage: { en: "Sage", th: "เสจ", id: "Sage" },
  chard: { en: "Chard", th: "ผักโขมสวิส", id: "Bit Swiss" },
  strawberry_uk: { en: "Strawberry", th: "สตรอว์เบอร์รี่", id: "Stroberi" },
};

/**
 * Get localized name for a crop.
 * @param cropId - The crop ID (e.g., "rau_muong")
 * @param canonicalVi - The Vietnamese canonical name as fallback
 * @returns Localized name string
 */
export function getCropLocalName(cropId: string, canonicalVi: string): string {
  const lang = getCurrentLanguage();
  if (lang === "vi") return canonicalVi;

  const names = CROP_NAMES[cropId];
  if (names) {
    const localName = names[lang];
    if (localName) return localName;
  }

  // Fallback: return Vietnamese canonical name
  return canonicalVi;
}

/**
 * Get crop name for display, with local name in parentheses if different.
 * Example (EN): "Water Spinach (Rau muống)" or just "Basil" if no Vietnamese ambiguity.
 */
export function getCropDisplayName(cropId: string, canonicalVi: string): string {
  const lang = getCurrentLanguage();
  if (lang === "vi") return canonicalVi;

  const localName = getCropLocalName(cropId, canonicalVi);
  // If the local name is the same as canonical_vi, just return it
  if (localName === canonicalVi) return localName;
  return localName;
}
