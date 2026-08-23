/**
 * Crop Notes i18n — translations for beginner_success_factors.notes
 * and regional_rules[region].regional_notes.
 *
 * Vietnamese is the canonical source in crops.json.
 * This module provides EN/TH/ID overrides keyed by cropId.
 */

import type { LanguageCode } from "./index";

/** Beginner notes translations per crop */
interface CropBeginnerNotes {
  en?: string;
  th?: string;
  id?: string;
}

/** Regional notes per crop per region */
interface CropRegionalNotes {
  en?: Record<string, string>;
  th?: Record<string, string>;
  id?: Record<string, string>;
}

/** All crop notes keyed by crop_id */
const BEGINNER_NOTES: Record<string, CropBeginnerNotes> = {
  // === Vietnam crops ===
  rau_muong: {
    en: "Grows fast, gives a clear sense of achievement.",
    th: "โตเร็ว ให้ความรู้สึกสำเร็จชัดเจน",
    id: "Tumbuh cepat, memberikan rasa pencapaian yang jelas.",
  },
  rau_den: {
    en: "Almost impossible to kill, ideal for absolute beginners.",
    th: "เกือบตายไม่ได้ เหมาะมากสำหรับมือใหม่",
    id: "Hampir mustahil mati, ideal untuk pemula.",
  },
  rau_thom: {
    en: "Tolerates heavy rain well, suitable for rainy weather warnings.",
    th: "ทนฝนหนักได้ดี เหมาะสำหรับแจ้งเตือนสภาพอากาศฝนตก",
    id: "Tahan hujan lebat, cocok untuk peringatan cuaca hujan.",
  },
  rau_mb: {
    en: "Needs consistent watering, can't tolerate even short drought.",
    th: "ต้องการน้ำสม่ำเสมอ ทนแล้งไม่ได้แม้สั้นๆ",
    id: "Perlu penyiraman konsisten, tidak tahan kekeringan singkat.",
  },
  hat_giong_ot: {
    en: "Can regrow from store-bought roots — a viral hook.",
    th: "ปลูกใหม่จากรากที่ซื้อจากตลาดได้ — hook สำหรับโพสต์ไวรัส",
    id: "Bisa tumbuh ulang dari akar beli di pasar — viral hook.",
  },
  hat_giong_ca_chua_bi: {
    en: "Needs enough sun to be fragrant, prone to root rot if overwatered.",
    th: "ต้องการแดดพอจึงจะหอม รากเน่าง่ายถ้ารดมากไป",
    id: "Perlu cukup sinar agar berbau harum, rentan busuk akar jika terlalu disiram.",
  },
  hat_giong_dau_bap: {
    en: "Similar to cabbage, grows fast with visible progress.",
    th: "คล้ายกะหล่ำปลี โตเร็วเห็นความคืบหน้าชัดเจน",
    id: "Mirip kubis, tumbuh cepat dengan kemajuan terlihat.",
  },
  hat_giong_cu_cai: {
    en: "Needs enough sun, easy to get root rot if overwatered.",
    th: "ต้องการแดดพอ รากเน่าง่ายถ้ารดมากไป",
    id: "Perlu cukup sinar, mudah busuk akar jika terlalu disiram.",
  },
  hat_giong_su_hao: {
    en: "Very easy, especially useful for extreme heat test cases.",
    th: "ง่ายมาก โดยเฉพาะมีประโยชน์สำหรับกรณีทดสอบอากาศร้อนจัด",
    id: "Sangat mudah, sangat berguna untuk kasus uji panas ekstrem.",
  },
  hat_giong_bap_cai: {
    en: "Harder than other leafy greens, actual difficulty should be 'medium' not 'easy'.",
    th: "ยากกว่าผักใบอื่น ความยากจริงควรเป็น 'ปานกลาง' ไม่ใช่ 'ง่าย'",
    id: "Lebih sulit dari sayuran daun lain, tingkat kesulitan sebenarnya 'sedang' bukan 'mudah'.",
  },
  hat_giong_ot_hung_yen: {
    en: "Needs loose soil and deep pot (≥18cm) for roots to develop properly.",
    th: "ต้องการดินร่วนซุยและกระถางลึก (≥18cm) เพื่อให้รากพัฒนาถูกต้อง",
    id: "Perlu tanah gembur dan pot dalam (≥18cm) agar akar berkembang benar.",
  },
  hat_giong_ca_chua_bi_hai_phong: {
    en: "Step-up crop: harder than leafy greens but grows real fruit — great motivation if successful.",
    th: "ต้นไม้ 'ก้าวข้าม' ยากกว่าผักใบแต่ให้ผลไม้จริง — สร้างแรงบันดาลใจถ้าสำเร็จ",
    id: "Tanaman 'langkah naik': lebih sulit dari sayuran daun tapi menghasilkan buah nyata.",
  },
  hat_giong_dau_bap_ngu_son: {
    en: "Step-up crop but harder than cherry tomato — needs trellis, more prone to pests/fungus.",
    th: "ต้นไม้ 'ก้าวข้าม' แต่ยากกว่ามะเขือเทศเชอร์รี่ — ต้องการค้ำยัน ง่ายต่อแมลง/เชื้อรา",
    id: "Tanaman langkah naik tapi lebih sulit dari tomat ceri — perlu ajiran, rentan hama/jamur.",
  },
  hat_giong_cu_cai_bac_giang: {
    en: "Long harvest time (75-100 days), not suitable for 'fastest harvest' goal.",
    th: "เวลาเก็บเกี่ยวนาน (75-100 วัน) ไม่เหมาะกับเป้าหมาย 'เก็บเกี่ยวเร็วที่สุด'",
    id: "Waktu panen lama (75-100 hari), tidak cocok untuk tujuan 'panen tercepat'.",
  },
  hat_giong_su_hao_da_lat: {
    en: "Most durable step-up crop — tolerates both intense sun and heavy rain.",
    th: "ต้นไม้ 'ก้าวข้าม' ที่ทนทานที่สุด — ทั้งแดดจัดและฝนหนัก",
    id: "Tanaman langkah naik paling tahan — tahan panas terik dan hujan lebat.",
  },
  // === Thailand crops ===
  kaphrao: {
    en: "Essential herb for Thai cooking (pad krapao). Very rewarding for beginners.",
    th: "สมุนไพรจำเป็นสำหรับอาหารไทย (ผัดกะเพรา) ให้ผลลัพธ์ที่ดีมากสำหรับมือใหม่",
    id: "Herb penting untuk masakan Thailand. Sangat memuaskan untuk pemula.",
  },
  bai_makrut: {
    en: "Almost impossible to kill. Can regrow from market cuttings.",
    th: "เกือบตายไม่ได้ ปลูกใหม่จากกิ่งที่ซื้อจากตลาดได้",
    id: "Hampir mustahil mati. Bisa tumbuh ulang dari stek pasar.",
  },
  khai_bai: {
    en: "Grows fast in water. Great for windowsill with a jar of water.",
    th: "โตเร็วในน้ำ เหมาะกับขอบหน้าต่างที่มีโหลน้ำ",
    id: "Tumbuh cepat di air. Cocok untuk jendela dengan toples air.",
  },
  bon_khao: {
    en: "Needs trellis but very rewarding — long beans grow fast and visibly.",
    th: "ต้องการค้ำยันแต่ให้ผลลัพธ์ดีมาก — ถั่วฝักยาวโตเร็วและเห็นชัดเจน",
    id: "Perlu ajiran tapi sangat memuaskan — kacang panjang tumbuh cepat dan terlihat.",
  },
  pak_bung: {
    en: "Staple Thai vegetable. Pad pak boong fai daeng is the classic dish.",
    th: "ผักหลักของไทย ผัดผักบุ้งไฟแดงคือเมนูคลาสสิก",
    id: "Sayuran pokok Thailand. Pad pak boong fai daeng adalah menu klasik.",
  },
  chaplu: {
    en: "Challenging in Thai heat. Best attempted in cool season or air-conditioned areas.",
    th: "ท้าทายในอากาศร้อนของไทย ลองปลูกในฤดูหนาวหรือในห้องแอร์ดีกว่า",
    id: "Tantangan di panas Thailand. Lebih baik coba di musim dingin atau ber-AC.",
  },
  ta_khai: {
    en: "Fragrant and easy. Essential for pad kra pao when mixed with holy basil.",
    th: "หอมและง่าย จำเป็นสำหรับผัดกะเพราเมื่อผสมกับกะเพรา",
    id: "Harum dan mudah. Penting untuk pad kra pao saat dicampur kemangi suci.",
  },
  khmin: {
    en: "Very slow but very hardy. One tree provides leaves for years.",
    th: "โตช้ามากแต่ทนทานมาก ต้นเดียวให้ใบหลายปี",
    id: "Sangat lambat tapi sangat tahan. Satu pohon memberi daun bertahun-tahun.",
  },
  makua_pro: {
    en: "Very slow but very hardy. One tree provides leaves for years.",
    th: "โตช้ามากแต่ทนทานมาก ต้นเดียวให้ใบหลายปี",
    id: "Sangat lambat tapi sangat tahan. Satu pohon memberi daun bertahun-tahun.",
  },
  prik_kii_noo: {
    en: "Challenging in Thai heat. Best for cool season or indoor growing.",
    th: "ท้าทายในอากาศร้อนของไทย ดีที่สุดสำหรับฤดูหนาวหรือปลูกในร่ม",
    id: "Tantangan di panas Thailand. Terbaik untuk musim dingin atau tumbuh dalam ruangan.",
  },
  // === Indonesia crops ===
  kangkung: {
    en: "Almost impossible to kill. Best starter plant for Indonesian beginners.",
    th: "เกือบตายไม่ได้ ต้นไม้เริ่มต้นที่ดีที่สุดสำหรับมือใหม่ชาวอินโดนีเซีย",
    id: "Hampir mustahil mati. Tanaman pemula terbaik untuk pemula Indonesia.",
  },
  kemangi: {
    en: "Essential for lalapan (raw vegetable side dish). Very rewarding.",
    th: "จำเป็นสำหรับลาลามปัน (เครื่องเคียงผักสด) ให้ผลลัพธ์ดีมาก",
    id: "Penting untuk lalapan (lauk sayuran mentah). Sangat memuaskan.",
  },
  cabai_rawit: {
    en: "Very rewarding if successful — fresh cabai is expensive in Indonesia.",
    th: "ให้ผลลัพธ์ดีมากถ้าสำเร็จ — พริกสดราคาแพงในอินโดนีเซีย",
    id: "Sangat memuaskan jika berhasil — cabai segar mahal di Indonesia.",
  },
  terong: {
    en: "Fastest harvest. Great for showing kids how plants grow.",
    th: "เก็บเกี่ยวเร็วที่สุด เหมาะสำหรับให้เด็กเห็นว่าต้นไม้โตอย่างไร",
    id: "Panen tercepat. Cocok untuk mengajarkan anak-anak tentang pertumbuhan tanaman.",
  },
  seledri: {
    en: "Challenging but very rewarding when it works.",
    th: "ท้าทายแต่ให้ผลลัพธ์ดีมากเมื่อสำเร็จ",
    id: "Tantangan tapi sangat memuaskan saat berhasil.",
  },
  daun_bawang: {
    en: "Important vegetable in Indonesian cuisine (balado, terong goreng).",
    th: "ผักสำคัญในอาหารอินโดนีเซีย (บลาโด มะเขือทอด)",
    id: "Sayuran penting dalam masakan Indonesia (balado, terong goreng).",
  },
  kacang_panjang: {
    en: "Needs trellis but grows fast and visibly.",
    th: "ต้องการค้ำยันแต่โตเร็วและเห็นชัดเจน",
    id: "Perlu ajiran tapi tumbuh cepat dan terlihat.",
  },
  bayam: {
    en: "Fast growing but needs consistent moisture.",
    th: "โตเร็วแต่ต้องการความชื้นสม่ำเสมอ",
    id: "Tumbuh cepat tapi perlu kelembapan konsisten.",
  },
  mentimun: {
    en: "Fast growing but demanding. Needs consistent care.",
    th: "โตเร็วแต่ต้องการความใส่ใจสม่ำเสมอ",
    id: "Tumbuh cepat tapi menuntut. Perlu perawatan konsisten.",
  },
  cabai_merah: {
    en: "Challenging in Indonesian heat. Best for highland areas.",
    th: "ท้าทายในอากาศร้อนของอินโดนีเซีย ดีที่สุดสำหรับพื้นที่สูง",
    id: "Tantangan di panas Indonesia. Terbaik untuk daerah pegunungan.",
  },
  // === USA crops ===
  basil: {
    en: "Classic step-up crop. Very rewarding when it works.",
    th: "ต้นไม้ 'ก้าวข้าม' คลาสสิก ให้ผลลัพธ์ดีมากเมื่อสำเร็จ",
    id: "Tanaman langkah naik klasik. Sangat memuaskan saat berhasil.",
  },
  cherry_tomato: {
    en: "Colorful harvest is very rewarding.",
    th: "การเก็บเกี่ยวสีสันสดใสให้ความพึงพอใจสูง",
    id: "Panen berwarna-warni sangat memuaskan.",
  },
  jalapeno: {
    en: "Essential for Italian cooking. Pinch flowers for continuous harvest.",
    th: "จำเป็นสำหรับอาหารอิตาเลี่ยน เด็ดดอกเพื่อเก็บเกี่ยวต่อเนื่อง",
    id: "Penting untuk masakan Italia. Pencet bunga untuk panen terus-menerus.",
  },
  lettuce: {
    en: "Fastest harvest. Great for salads.",
    th: "เก็บเกี่ยวเร็วที่สุด เหมาะสำหรับสลัด",
    id: "Panen tercepat. Cocok untuk salad.",
  },
  cilantro: {
    en: "Challenging — bolts fast in summer. Try succession planting.",
    th: "ท้าทาย — ดอกเร็วในฤดูร้อน ลองปลูกแบบต่อเนื่อง",
    id: "Tantangan — cepat berbunga di musim panas. Coba tanam bergantian.",
  },
  bell_pepper: {
    en: "Incredibly productive. You'll have more than you know what to do with!",
    th: "ผลผลิตมากจนน่าทึ่ง คุณจะมีมากกว่าที่จะรู้ว่าจะทำอะไร!",
    id: "Sangat produktif. Akan lebih banyak dari yang tahu harus diapakan!",
  },
  green_onion: {
    en: "Bush beans are very easy. Pick regularly for more production.",
    th: "ถั่วฝักสั้นง่ายมาก เก็บเป็นประจำเพื่อผลผลิตมากขึ้น",
    id: "Kacang kerdil sangat mudah. Panen rutin untuk hasil lebih.",
  },
  parsley: {
    en: "Perennial — comes back every year. First year is toughest.",
    th: "ไม้ยืนต้น — กลับมาทุกปี ปีแรกยากที่สุด",
    id: "Tanaman abadi — kembali setiap tahun. Tahun pertama paling sulit.",
  },
  radish: {
    en: "Almost impossible to kill. Grows aggressively — keep in pot!",
    th: "เกือบตายไม่ได้ โตอย่างดุดัน — ต้องใส่กระถาง!",
    id: "Hampir mustahil mati. Tumbuh agresif — taruh di pot!",
  },
  spinach: {
    en: "Easier than regular tomatoes. Prolific producer.",
    th: "ง่ายกว่ามะเขือเทศทั่วไป ให้ผลผลิตมาก",
    id: "Lebih mudah dari tomat biasa. Produsen produktif.",
  },
  strawberry: {
    en: "Slow to germinate but very hardy once established.",
    th: "งอกช้าแต่ทนทานมากเมื่อตั้งตัวได้แล้ว",
    id: "Lama berkecambah tapi sangat tahan setelah mapan.",
  },
  mint: {
    en: "Long wait but worth it. Great on sunny windowsill.",
    th: "รอนานแต่คุ้ม เหมาะกับขอบหน้าต่างที่มีแดด",
    id: "Lama menunggu tapi sepadan. Cocok untuk jendela cerah.",
  },
  // === UK crops ===
  runner_bean: {
    en: "Challenging in UK climate. Greenhouse recommended.",
    th: "ท้าทายในสภาพอากาศของอังกฤษ แนะนำปลูกในโรงเรือน",
    id: "Tantangan di iklim Inggris. Disarankan greenhouse.",
  },
  courgette: {
    en: "Perfect beginner crop. Harvest outer leaves for continuous supply.",
    th: "พืชสำหรับมือใหม่ที่สมบูรณ์แบบ เก็บใบด้านนอกเพื่อเก็บเกี่ยวต่อเนื่อง",
    id: "Tanaman pemula sempurna. Panen daun luar untuk pasokan terus-menerus.",
  },
  tomato: {
    en: "Worth growing from seed. Pinch flowers for more leaves.",
    th: "คุ้มค่าที่จะปลูกจากเมล็ด เด็ดดอกเพื่อใบมากขึ้น",
    id: "Layak tumbuh dari biji. Pencet bunga untuk daun lebih banyak.",
  },
  pea_shoots: {
    en: "Fastest root vegetable. Kids love pulling them up!",
    th: "ผักรากเร็วที่สุด เด็กๆ ชอบดึง!",
    id: "Sayuran akar tercepat. Anak-anak suka mencabutnya!",
  },
  dwarf_bean: {
    en: "Slow to germinate but very hardy. Lasts into autumn.",
    th: "งอกช้าแต่ทนทานมาก อึดจนถึงฤดูใบไม้ร่วง",
    id: "Lama berkecambah tapi sangat tahan. Bertahan hingga musim gugur.",
  },
  spring_onion: {
    en: "Invincible. Grows everywhere in UK. Keep in pot or it takes over!",
    th: "ไม่แพ้ โตได้ทุกที่ในอังกฤษ ใส่กระถางไม่งั้นจะรุกคืบ!",
    id: "Tak terkalahkan. Tumbuh di mana saja di Inggris. Taruh di pot atau akan menjalar!",
  },
  thyme: {
    en: "Traditional British crop. Very productive with proper support.",
    th: "พืชแบบดั้งเดิมของอังกฤษ ให้ผลผลิตมากเมื่อมีการสนับสนุนที่ถูกต้อง",
    id: "Tanaman tradisional Inggris. Sangat produktif dengan dukungan yang tepat.",
  },
  sage: {
    en: "Perennial, comes back every year. British classic.",
    th: "ไม้ยืนต้น กลับมาทุกปี คลาสสิกแบบอังกฤษ",
    id: "Tanaman abadi, kembali setiap tahun. Klasik Inggris.",
  },
  chard: {
    en: "Almost impossible to kill. Regrow from supermarket scraps!",
    th: "เกือบตายไม่ได้ ปลูกใหม่จากผักตลาดได้!",
    id: "Hampir mustahil mati. Tumbuh ulang dari sisa pasar!",
  },
  strawberry_uk: {
    en: "Long wait but rewarding. Great on sunny windowsill.",
    th: "รอนานแต่คุ้ม เหมาะกับขอบหน้าต่างที่มีแดด",
    id: "Lama menunggu tapi sepadan. Cocok untuk jendela cerah.",
  },
};

/** Regional notes per crop per region — EN/TH/ID overrides. */
const REGIONAL_NOTES: Record<string, CropRegionalNotes> = {
  // === Vietnam ===
  rau_muong: {
    en: {
      north_vietnam: "Avoid mid-summer planting in June-July.",
      south_vietnam: "Grow year-round, prefer dry season.",
    },
    th: {
      north_vietnam: "หลีกเลี่ยงปลูกกลางฤดูร้อนเดือนมิถุนายน-กรกฎาคม",
      south_vietnam: "ปลูกได้ตลอดปี ชอบฤดูแห้ง",
    },
    id: {
      north_vietnam: "Hindari tanam di tengah musim panas Juni-Juli.",
      south_vietnam: "Tanam sepanjang tahun, utamakan musim kering.",
    },
  },
  rau_den: {
    en: {
      north_vietnam: "Main summer crop in the North, tolerates heat and rain well.",
      south_vietnam: "Grow year-round, easiest plant for beginners in the South.",
    },
    th: {
      north_vietnam: "พืชหลักฤดูร้อนทางเหนือ ทนร้อนและฝนหนักได้ดี",
      south_vietnam: "ปลูกได้ตลอดปี พืชที่ง่ายที่สุดสำหรับมือใหม่ทางใต้",
    },
    id: {
      north_vietnam: "Tanaman utama musim panas di Utara, tahan panas dan hujan.",
      south_vietnam: "Tanam sepanjang tahun, tanaman termudah untuk pemula di Selatan.",
    },
  },
  rau_thom: {
    en: {
      north_vietnam: "Only grow in summer in the North.",
      south_vietnam: "Grow year-round.",
    },
    th: {
      north_vietnam: "ปลูกได้เฉพาะฤดูร้อนทางเหนือ",
      south_vietnam: "ปลูกได้ตลอดปี",
    },
    id: {
      north_vietnam: "Hanya tumbuh musim panas di Utara.",
      south_vietnam: "Tanam sepanjang tahun.",
    },
  },
  rau_mb: {
    en: {
      north_vietnam: "Typical winter-spring crop in the North.",
      south_vietnam: "Plant in dry season, avoid humid months.",
    },
    th: {
      north_vietnam: "พืชฤดูหนาว-ฤดูใบไม้ผลิทั่วไปทางเหนือ",
      south_vietnam: "ปลูกในฤดูแห้ง หลีกเลี่ยงเดือนชื้น",
    },
    id: {
      north_vietnam: "Tanaman musim dingin-musim semi khas Utara.",
      south_vietnam: "Tanam musim kering, hindari bulan lembab.",
    },
  },
  hat_giong_ot: {
    en: {
      north_vietnam: "Grow from spring to early autumn.",
      south_vietnam: "Grow year-round.",
    },
    th: {
      north_vietnam: "ปลูกได้จากฤดูใบไม้ผลิถึงต้นฤดูใบไม้ร่วง",
      south_vietnam: "ปลูกได้ตลอดปี",
    },
    id: {
      north_vietnam: "Tanam dari musim semi hingga awal musim gugur.",
      south_vietnam: "Tanam sepanjang tahun.",
    },
  },
  hat_giong_ca_chua_bi: {
    en: {
      north_vietnam: "Best from autumn-winter-spring.",
      south_vietnam: "Prefer cool dry season.",
    },
    th: {
      north_vietnam: "ดีที่สุดฤดูใบไม้ร่วง-ฤดูหนาว-ฤดูใบไม้ผลิ",
      south_vietnam: "ชอบฤดูแห้งเย็น",
    },
    id: {
      north_vietnam: "Terbaik dari musim gugur-dingin-m semi.",
      south_vietnam: "Lebih suka musim kering dingin.",
    },
  },
  hat_giong_dau_bap: {
    en: {
      north_vietnam: "Grows well spring through early autumn.",
      south_vietnam: "Grow year-round.",
    },
    th: {
      north_vietnam: "โตได้ดีจากฤดูใบไม้ผลิถึงต้นฤดูใบไม้ร่วง",
      south_vietnam: "ปลูกได้ตลอดปี",
    },
    id: {
      north_vietnam: "Tumbuh baik dari musim semi hingga awal musim gugur.",
      south_vietnam: "Tanam sepanjang tahun.",
    },
  },
  hat_giong_cu_cai: {
    en: {
      north_vietnam: "Best autumn-winter-spring.",
      south_vietnam: "Prefer cool dry season.",
    },
    th: {
      north_vietnam: "ดีที่สุดฤดูใบไม้ร่วง-ฤดูหนาว-ฤดูใบไม้ผลิ",
      south_vietnam: "ชอบฤดูแห้งเย็น",
    },
    id: {
      north_vietnam: "Terbaik musim gugur-dingin-m semi.",
      south_vietnam: "Lebih suka musim kering dingin.",
    },
  },
  hat_giong_su_hao: {
    en: {
      north_vietnam: "Ideal summer plant for the North — thrives in heat when others can't.",
      south_vietnam: "Grow year-round.",
    },
    th: {
      north_vietnam: "พืชฤดูร้อนที่เหมาะสำหรับทางเหนือ — โตดีในที่ร้อนเมื่อพืชอื่นไม่ทน",
      south_vietnam: "ปลูกได้ตลอดปี",
    },
    id: {
      north_vietnam: "Tanaman musim panas ideal di Utara — tumbuh baik saat yang lain tidak tahan.",
      south_vietnam: "Tanam sepanjang tahun.",
    },
  },
  hat_giong_bap_cai: {
    en: {
      north_vietnam: "Autumn-winter-spring crop.",
      south_vietnam: "Prefer dry cool season.",
    },
    th: {
      north_vietnam: "พืชฤดูใบไม้ร่วง-ฤดูหนาว-ฤดูใบไม้ผลิ",
      south_vietnam: "ชอบฤดูแห้งเย็น",
    },
    id: {
      north_vietnam: "Tanaman musim gugur-dingin-m semi.",
      south_vietnam: "Lebih suka musim kering dingin.",
    },
  },
  hat_giong_ot_hung_yen: {
    en: {
      north_vietnam: "Winter crop.",
      south_vietnam: "Grow year-round.",
    },
    th: {
      north_vietnam: "พืชฤดูหนาว",
      south_vietnam: "ปลูกได้ตลอดปี",
    },
    id: {
      north_vietnam: "Tanaman musim dingin.",
      south_vietnam: "Tanam sepanjang tahun.",
    },
  },
  hat_giong_ca_chua_bi_hai_phong: {
    en: {
      north_vietnam: "Plant in late summer to autumn.",
      south_vietnam: "Best in cool season.",
    },
    th: {
      north_vietnam: "ปลูกช่วงปลายฤดูร้อนถึงฤดูใบไม้ร่วง",
      south_vietnam: "ดีที่สุดในฤดูเย็น",
    },
    id: {
      north_vietnam: "Tanam akhir musim panas hingga musim gugur.",
      south_vietnam: "Terbaik di musim dingin.",
    },
  },
  hat_giong_dau_bap_ngu_son: {
    en: {
      north_vietnam: "Spring through early autumn.",
      south_vietnam: "Year-round.",
    },
    th: {
      north_vietnam: "จากฤดูใบไม้ผลิถึงต้นฤดูใบไม้ร่วง",
      south_vietnam: "ตลอดปี",
    },
    id: {
      north_vietnam: "Dari musim semi hingga awal musim gugur.",
      south_vietnam: "Sepanjang tahun.",
    },
  },
  hat_giong_cu_cai_bac_giang: {
    en: {
      north_vietnam: "Autumn through winter and spring.",
      south_vietnam: "Cool season crop.",
    },
    th: {
      north_vietnam: "ฤดูใบไม้ร่วงผ่านฤดูหนาวและฤดูใบไม้ผลิ",
      south_vietnam: "พืชฤดูเย็น",
    },
    id: {
      north_vietnam: "Musim gugur melewati dingin dan semi.",
      south_vietnam: "Tanaman musim dingin.",
    },
  },
  hat_giong_su_hao_da_lat: {
    en: {
      north_vietnam: "Best from spring to early autumn.",
      south_vietnam: "Grow year-round.",
    },
    th: {
      north_vietnam: "ดีที่สุดจากฤดูใบไม้ผลิถึงต้นฤดูใบไม้ร่วง",
      south_vietnam: "ปลูกได้ตลอดปี",
    },
    id: {
      north_vietnam: "Terbaik dari musim semi hingga awal musim gugur.",
      south_vietnam: "Tanam sepanjang tahun.",
    },
  },
};

/**
 * Get translated beginner notes for a crop.
 * Falls back to Vietnamese (canonical source in crops.json).
 */
export function getBeginnerNotes(cropId: string, lang: LanguageCode): string | undefined {
  if (lang === "vi") return undefined; // use canonical from JSON
  const notes = BEGINNER_NOTES[cropId]?.[lang];
  return notes;
}

/**
 * Get translated regional notes for a crop+region.
 * Falls back to Vietnamese (canonical source in crops.json).
 */
export function getRegionalNotes(
  cropId: string,
  region: string,
  lang: LanguageCode,
): string | undefined {
  if (lang === "vi") return undefined; // use canonical from JSON
  const regionNotes = REGIONAL_NOTES[cropId]?.[lang as "en" | "th" | "id"];
  return regionNotes?.[region];
}
