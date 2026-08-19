# Plan1 Final v2 — Execution Blueprint (READY FOR IMPLEMENTATION)
### App gợi ý trồng rau/củ/quả theo mùa & vị trí

> Bản này thay thế `plan1_final.md`, khóa toàn bộ các điểm P0 đã được 6 vòng review đồng thuận, cộng thêm các quyết định giải quyết mâu thuẫn giữa các review và bổ sung mới. Đây là bản dùng để giao Agent/Developer bắt tay code.

---

## 0. Nguyên tắc chỉ đạo (giữ nguyên, không đổi)

1. Validate rẻ trước khi build đắt.
2. Một persona rõ ràng cho V1, không phục vụ tất cả ngay từ đầu.
3. Global Architecture, Local Data-Dense Launch.
4. AI chỉ là lớp giải thích, không phải core recommendation.
5. Monetize bằng convenience, không phải nội dung miễn phí sẵn có.
6. **[Mới]** Đừng xây app để trả lời "Cây nào phù hợp khí hậu của tôi?" — hãy xây app để trả lời **"Cây nào tôi có khả năng trồng THÀNH CÔNG nhất ngay bây giờ?"**. Câu đầu là gardening database. Câu sau là personal gardening assistant.

---

## 1. Persona (tinh chỉnh)

**Đã chốt, refine thêm độ hẹp:**

> **Beginner urban grower who wants to successfully grow their first edible plant.**
> Mục tiêu không phải "làm vườn" — mục tiêu là **"Tôi muốn trồng được một thứ gì đó và không làm nó chết."**

Điều này quyết định: North Star không phải "số lượt xem gợi ý", mà là **First Successful Grow**.

---

## 2. North Star & Metrics

| Metric | Định nghĩa | Mục tiêu |
|---|---|---|
| **First Successful Grow** | User báo cáo thu hoạch lần đầu (dù chỉ 1 lá) | North Star chính |
| **Time to First Recommendation** | Mở app → biết nên trồng gì | < 5 phút |
| **Time to First Planting Action** | Install → đánh dấu "Đã gieo" | < 24-48 giờ |
| **Fail/Abandon Rate** (metric gián tiếp, không bias thiên thành công) | % user báo "cây chết"/bỏ theo dõi trước ngày X | Theo dõi theo vùng + mùa để tinh chỉnh engine |

---

## 3. Phase 0.5 — Validation (2 tuần, TRƯỚC Data Ontology đầy đủ)

### 3.1. Phương pháp: Concierge Validation qua Zalo OA Bot (thay landing page tĩnh)

**Lý do đổi:** landing page + form email chỉ đo "tò mò" (curiosity), không đo "sẵn sàng hành động". Zalo OA bot rẻ, gần như miễn phí, đo được intent thật, và validate luôn kênh notification sẽ dùng ở Phase 1.5.

**Cách làm:**
1. Tạo Zalo OA (miễn phí) tên đơn giản (VD: "Trồng Gì Hôm Nay").
2. User chat tên thành phố (hoặc chọn nút "Hà Nội" / "TP.HCM" / "Đà Lạt").
3. Bot trả lời bằng nội dung viết tay: *"Tháng 8 ở Hà Nội bạn có thể trồng: Cải xanh, Rau muống, Húng quế. Bạn muốn mình nhắc gieo hạt vào thứ 2 tuần sau không?"*
4. Nếu user bấm "Có" → ghi nhận là **Strong Intent Signal**.

### 3.2. Khung KPI 3 tầng (không dùng một con số duy nhất 15-20% để quyết định sống-chết dự án)

| Tầng | Đo gì | Tín hiệu mạnh | Tín hiệu yếu | Tín hiệu tiêu cực |
|---|---|---|---|---|
| **Interest** | Traffic → tương tác với bot/gợi ý | CTR cao vào từng loại cây | Đọc nhưng không bấm gì | Bounce ngay |
| **Intent** | Bấm "Nhắc tôi gieo hạt" | Tỷ lệ bấm cao, hỏi thêm câu hỏi | Xem xong không phản hồi | Từ chối rõ ràng |
| **Retention Intent** | Quay lại tuần sau khi được nhắc, hoặc tự nhắn lại | Có phản hồi tích cực khi được nhắc | Im lặng | Unfollow/block bot |

**Quyết định tiếp tục:** cần tín hiệu mạnh ở cả tầng Intent lẫn ít nhất một phần Retention Intent. Chỉ có Interest cao không đủ để tiến sang Phase 0.

---

## 4. Phase 0 — Data Ontology & Core Engine (4-6 tuần)

### 4.1. Danh sách cây ưu tiên (30-40 loại — giữ nguyên từ v1)

Rau ăn lá ưu tiên cao nhất: cải xanh, cải ngọt, cải thìa, rau muống, xà lách, mồng tơi, rau dền, cải cúc.
Gia vị: hành lá, húng quế, húng lủi, tía tô, ngò rí, rau răm.
Củ/quả dễ: củ cải, su hào, cà chua bi, dưa leo, ớt, đậu bắp.
Nhóm quốc tế (mở rộng sau): carrot, kale, spinach, basil, radish, lettuce.

### 4.2. Data Schema v2 — Tách logic, gộp lưu trữ

**Nguyên tắc:** lưu 1 document/record trong DB (Firestore/Postgres JSON column), nhưng **bắt buộc tách Class/Type trong code** thành `CropBase`, `HardConstraints`, `GrowingRules` (có `regional_rules` theo vùng), và `BeginnerSuccessFactors`. Tránh Agent code vô tình ghi đè metadata tĩnh khi cập nhật quy tắc vùng miền.

```json
{
  "crop_base": {
    "id": "cai_xanh",
    "names": {
      "canonical_vi": "Cải xanh",
      "canonical_en": "Mustard Greens",
      "scientific": "Brassica juncea",
      "synonyms_vi": ["Cải bẹ", "Cải lá", "Rau cải"],
      "search_aliases": ["cai xanh", "cai la", "rau cai"]
    },
    "category": "leafy_green",
    "base_difficulty": "easy",
    "tags": ["fast_harvest", "partial_shade_tolerant", "cool_season"],
    "timeline_base": {
      "germination_days": [3, 7],
      "days_to_harvest": [25, 35],
      "growth_stages": [
        {"stage": "germination", "day_range": [0, 7]},
        {"stage": "seedling", "day_range": [7, 15]},
        {"stage": "vegetative", "day_range": [15, 30]},
        {"stage": "harvest", "day_range": [25, 35]}
      ]
    },
    "data_provenance": {
      "created_at": "2026-08-17",
      "last_verified_at": "2026-08-17",
      "reviewed_by": "pending_expert_review"
    }
  },

  "hard_constraints": {
    "temp_death_max_c": {
      "value": 35,
      "reason": "Nhiệt độ liên tục >35°C gây bolting (ra hoa sớm) và đắng lá.",
      "source": {"name": "Vietnam National University of Agriculture", "confidence": "high"}
    },
    "temp_death_min_c": {
      "value": -2,
      "reason": "Rễ bị thối nếu sương muối kéo dài.",
      "source": {"name": "University Extension reference", "confidence": "medium"}
    },
    "min_sunlight_hours": 3,
    "min_pot_depth_cm": 12
  },

  "growing_rules": {
    "optimal_conditions": {
      "temperature_c": {"min": 15, "optimal_min": 18, "optimal_max": 28, "max": 32},
      "sunlight_hours": {"min": 3, "optimal": 6},
      "water": "consistent_moist",
      "soil": "well_draining_loamy_rich"
    },
    "regional_rules": {
      "north_vietnam": {
        "planting_windows": [
          {"months": [8, 9, 10, 11, 2, 3], "type": "primary"},
          {"months": [4, 5], "type": "late_spring_risky"}
        ],
        "local_anomaly_flags": {
          "june_july_heatwave": "Avoid. Bolting risk cao. Expected Success giảm mạnh."
        },
        "regional_notes": "Tránh gieo giữa hè nắng gắt tháng 6-7. Tốt nhất đầu thu hoặc xuân.",
        "source": {"name": "Urban Gardening Hanoi Community Summary", "confidence": "medium"}
      },
      "south_vietnam": {
        "planting_windows": [{"months": [11, 12, 1, 2], "type": "primary_dry_season"}],
        "local_anomaly_flags": {"rainy_season": "Fungal disease risk cao, cần che/kê cao."},
        "regional_notes": "Trồng quanh năm nhưng ưu tiên mùa khô để hạn chế sâu bệnh.",
        "source": {"name": "HCMC Urban Farm Network", "confidence": "low"}
      }
    }
  },

  "beginner_success_factors": {
    "forgiveness_overwatering": "medium",
    "forgiveness_underwatering": "low",
    "disease_resistance": "medium",
    "visibility_of_success": "high",
    "notes": "Lớn nhanh, tạo cảm giác thành tựu rõ ràng cho người mới."
  }
}
```

**Vì sao schema này là moat thực sự:**
- `hard_constraints` tách biệt → Agent chỉ cần loop qua để loại trừ, không để weighted average "cứu" một cây đang trong vùng chết.
- `regional_rules` có cấu trúc `planting_windows` + `local_anomaly_flags` rõ ràng, code kiểm tra được (`if month==6 and region==north → flag heatwave → giảm mạnh Expected Success`).
- Provenance ở cấp field: nếu `confidence: low`, UI tự hiển thị "Gợi ý này dựa trên ít dữ liệu địa phương, bạn có thể báo cáo kết quả để giúp app tốt hơn" → tự động hóa thu thập data moat.

### 4.3. Kiến trúc Recommendation (chốt cuối)

```
Location (GPS/city, không bắt buộc chính xác tuyệt đối)
        │
        ▼
Climate + Season + Weather (optional, interface có sẵn từ đầu)
        │
        ▼
HARD CONSTRAINTS FILTER
  - temp vượt ngưỡng chết → EXCLUDE
  - pot_depth < min_root_depth (nếu đã biết) → EXCLUDE
  - season hoàn toàn không phù hợp → EXCLUDE
        │
        ▼
CANDIDATE CROPS
        │
        ▼
EXPECTED SUCCESS SCORE (không phải Suitability Score thuần nông học)
  = Season_Fit * 0.30
  + Temp_Optimal_Fit * 0.25
  + Beginner_Ease * 0.20
  + Fast_Harvest_Bonus * 0.15
  + Sunlight/Space_Fit * 0.10   (mặc định 50 nếu chưa có dữ liệu cá nhân hóa)
        │
        ▼
CONTROLLED DIVERSITY SELECTION
  - Top 2: Expected Success cao nhất (dễ nhất, nhanh nhất)
  - Top 3: "Step-up Crop" — 1 cây thử thách nhẹ (VD: cà chua bi), có ghi chú
    "Khó hơn rau lá một chút, nhưng nếu thành công bạn sẽ có quả ăn!"
        │
        ▼
UI: hiển thị Top 3 + "Why" (template có sẵn, AI diễn giải tự nhiên hóa sau)
```

**Pseudo-code cho Agent:**

```python
def get_recommendations(user_context, crops_db):
    # STEP 1: HARD CONSTRAINTS — bắt buộc
    candidates = []
    for crop in crops_db:
        if user_context.temp_max > crop.hard_constraints.temp_death_max_c:
            continue
        if user_context.temp_min < crop.hard_constraints.temp_death_min_c:
            continue
        if user_context.pot_depth and user_context.pot_depth < crop.hard_constraints.min_pot_depth_cm:
            continue
        candidates.append(crop)

    # STEP 2: EXPECTED SUCCESS SCORING
    for crop in candidates:
        season_fit = calc_season_score(crop, user_context.month, user_context.region)
        temp_optimal = calc_temp_optimal_score(crop, user_context.forecast_7d)
        beginner_ease = 100 if crop.base_difficulty == "easy" else 50
        fast_harvest = calc_decay_score(crop.timeline_base.days_to_harvest, ideal=30)
        space_sun_fit = user_context.space_sun_fit or 50  # proxy mặc định nếu chưa khai báo

        crop.score = (season_fit * 0.30 + temp_optimal * 0.25 +
                      beginner_ease * 0.20 + fast_harvest * 0.15 +
                      space_sun_fit * 0.10)

    # STEP 3: CONTROLLED DIVERSITY
    ranked = sort_by_score(candidates)
    top_2 = ranked[:2]
    step_up = find_best_step_up_crop(candidates)  # category == fruit_vegetable, vẫn dễ nhất trong nhóm

    if not candidates:
        return NO_MATCH_STATE  # xem mục 5.4

    return format_top_3(top_2, step_up)
```

### 4.4. Golden Test Cases (bắt buộc trước khi code engine)

Viết tối thiểu **15-20 test case cứng**, chạy như regression suite trong CI — mỗi lần Agent sửa engine, chạy lại toàn bộ để tránh "silently sai".

Mẫu 5 case đầu (đầy đủ bộ 15-20 case sẽ nằm trong file test riêng `golden_test_cases.json`):

| # | Input | Phải loại trừ | Kỳ vọng Top 3 |
|---|---|---|---|
| 1 | Hà Nội, T8, Ban công, 3h nắng | — | Rau muống, Mồng tơi, (step-up: Đậu bắp) |
| 2 | Hà Nội, T12, Ban công, 3h nắng (rét đậm) | Dưa leo, Bí ngòi (chết rét) | Hành lá, Củ cải, (step-up: Su hào) |
| 3 | Hà Nội, T1, Cửa sổ, 2h nắng | Mọi cây quả, Cải xanh (cần >3h nắng) | Hành lá, Ngò rí, (alt: Nấm mộc nhĩ) |
| 4 | Hà Nội, T9, Ban công, 4h nắng, chậu 10cm | Su hào, Cà rốt (cần chậu sâu hơn) | Húng quế, Xà lách, (step-up: Củ cải — edge case) |
| 5 | Hà Nội, T11, Cửa sổ, 1h nắng, chậu 8cm | Hầu hết cây | **No-match state** (xem 5.4) |

### 4.5. Expert review nhẹ cho 30-40 crop đầu

Thay vì thuê chuyên gia nông học chính thức (chi phí cao, chậm), ưu tiên 2 nguồn rẻ hơn:
- Hợp tác sinh viên năm cuối ngành nông nghiệp (đổi lấy case study/tín chỉ thực tập).
- Liên hệ 2-3 KOL làm vườn đô thị trên TikTok/Facebook đã có uy tín sẵn, mời review nhanh danh sách 30-40 crop profile (có thể trả phí nhỏ hoặc đổi bằng credit/feature trong app).

---

## 5. Phase 1 — MVP (4-6 tuần)

### 5.1. Onboarding — Zero-friction, không ép đăng nhập

1. Lấy location (GPS hoặc chọn thành phố thủ công — luôn cho phép chọn tay, không ép GPS).
2. Câu hỏi Goal siêu ngắn (3 lựa chọn, tùy chọn không bắt buộc):
   - ⚡ Thu hoạch nhanh nhất
   - 🌿 Dễ sống, ít công chăm
   - 🍅 Rau củ quả ăn hàng ngày
3. **Micro-climate Proxy** — 1 bước chọn icon (thay vì hỏi chi tiết hướng ban công/giờ nắng/chậu):
   - 🏢 Cửa sổ ban công (ít nắng, ít gió)
   - 🏠 Sân thượng/ban công rộng (nắng nhiều, gió lớn)
   - 🌳 Sân vườn đất (nắng toàn phần, rễ sâu)
   → App tự gán `Sunlight_Score`/`Space_Score` mặc định để chạy Level 2 ngay, user có thể chỉnh sửa chi tiết sau nếu muốn.
4. Hiển thị gợi ý ngay — **không yêu cầu tạo tài khoản để xem gợi ý.** Chỉ yêu cầu đăng nhập khi user bấm "Thêm vào vườn của tôi".

### 5.2. Hai tầng Recommendation (UI phải nói rõ, không giả vờ personalized)

- **🌍 Level 1 — Good for your area:** dựa trên location + climate + season, hiển thị ngay sau bước 1.
- **🪴 Level 2 — Best for your balcony:** sau khi có Micro-climate Proxy (bước 3), tái tính điểm với Sunlight_Score/Space_Score thực tế hơn.

### 5.3. Trong phạm vi MVP

- Trang chủ Top 3 (2 dễ + 1 step-up) kèm giải thích "Why".
- Crop detail page dạng tutorial thực dụng (khi nào trồng / ở đâu / đất / độ sâu / nước / khoảng cách / thu hoạch / vấn đề thường gặp / growth timeline).
- **Regrow from kitchen scraps** — đặt ở tab riêng **"Mẹo vặt"**, không làm lu mờ USP chính "What to grow now".
- Favorites.
- **Weather abstraction:** `RecommendationContext` nhận `weather: optional` với dummy provider trả giá trị trung bình theo mùa ngay từ đầu — Phase 2 chỉ swap provider thật, không cần refactor engine.

### 5.4. "No strong match" state (bắt buộc)

Nếu sau Hard Constraints không còn cây nào đạt ngưỡng:
> ⚠️ "Điều kiện hiện tại khá khắc nghiệt. Gợi ý chờ 1-2 tuần hoặc thử trồng trong nhà/nấm/mầm hạt."

Không được ép trả về danh sách gượng ép.

### 5.5. Cố tình loại khỏi MVP (đẩy sang 1.5)

My Garden tracking đầy đủ, Widget, Ask Community/Plant Doctor, affiliate/marketplace.

### 5.6. Recommendation Audit Mode (nội bộ, dev-only)

Không hiển thị cho user, nhưng bắt buộc có để debug:
```
Crop: Cải xanh
Season Score: 95 | Temperature: 88 | Sunlight: 90 | Space: 100 | Difficulty: 100
Final Score: 92
Reasons: ✓ planting window open ✓ temperature favorable ✓ beginner friendly
Excluded: ✗ Cà chua — heat risk | ✗ Cà rốt — insufficient pot depth
```

---

## 6. Phase 1.5 — Retention (3-4 tuần)

- **My Garden cơ bản + trạng thái "Ghost Plant":** khi cây "chết"/bỏ theo dõi, KHÔNG xóa — chuyển sang trạng thái Ghost lưu `died_at`, `cause` (chọn nhanh: ☀️ Nắng gắt/héo · 🐛 Sâu bệnh · 🌊 Úng nước · ❓ Không rõ). Đây là nguồn Data Moat quan trọng nhất: *"Lần trước bạn trồng Cải xanh tháng 7 và thất bại vì nắng gắt. Tháng này thử Mồng tơi nhé!"* — mức cá nhân hóa đối thủ khó copy.
- **Passive Tracker qua Widget** (ưu tiên hơn push notification hàng ngày).
- **Emotional milestone notification** (không phải reminder khô khan): nảy mầm, ra hoa, sắp thu hoạch (còn 3-5 ngày).
- **Harvest Brag Card:** dùng **"Giá trị sản lượng quy đổi"** (không gọi "tiết kiệm tiền" để tránh tranh cãi số liệu), kèm chú thích nhỏ "theo giá rau sạch trung bình thị trường". Có thể ẩn số tiền mặc định, chỉ hiện khi user chủ động bật.
- **Deterministic First Aid** (thay Ask Community — tránh cold-start problem khi chưa có cộng đồng): checklist phân nhánh dựa trên luật cứng.
  > VD: "Cây bị vàng lá? Bạn tưới bao nhiêu lần/ngày? > 2 lần → có thể úng rễ. Cách xử lý: ngưng tưới 3 ngày, xới đất."
  Zero-cost, chính xác hơn AI đoán mò ở giai đoạn chưa có dữ liệu.
- **Programmatic SEO có kiểm soát chất lượng:** ưu tiên pillar pages chất lượng cao cho từng loại cây ("Hướng dẫn trồng cải xanh từ A-Z") + một số trang high-intent (Hà Nội tháng 8, ban công dễ trồng). Chỉ generate hàng loạt trang `[city]/[month]` khi đã có dữ liệu local khác biệt thực sự (feedback + weather history riêng từng vùng) — canonical/noindex các trang gần giống nhau để tránh thin content.

---

## 7. Phase 2 — Intelligence & Premium

- Tích hợp weather API thật (swap dummy provider đã chuẩn bị từ Phase 1).
- AI explanation layer (không phải AI recommendation).
- **Ask Community** mở ở giai đoạn này (khi đã có đủ user density để tránh cold-start).
- Plant Doctor AI chỉ xây khi đã tích lũy đủ dữ liệu ảnh từ Deterministic First Aid + Ask Community.
- **Monetization — Hybrid Freemium:**
  - Miễn phí: theo dõi tối đa 3 cây trong My Garden, xem gợi ý không giới hạn.
  - Trả phí một lần (~50-100k VNĐ, tích hợp Momo/ZaloPay): mở "Vườn không giới hạn" + Local Calendar Premium (lịch tiết khí chi tiết) + Garden Planner layout.
  - Lý do chọn hybrid thay vì thuần one-time hay thuần subscription: tạo động lực nâng cấp tự nhiên (giới hạn 3 cây), tránh subscription fatigue ở thị trường VN, vẫn có thể mở gói định kỳ sau cho tính năng cần cập nhật liên tục (VD: Local Calendar theo dữ liệu thời tiết mới).

---

## 8. Phase 3 — Commerce

- Test đăng ký affiliate Shopee/Lazada/TikTok Shop thực tế trước khi thiết kế UI mua sắm — không giả định.
- **Seed/supply link phải location-aware**, giống recommendation engine — không hard-code một nguồn mua toàn cầu (VN → Shopee/Lazada/cửa hàng local; US → Amazon/Home Depot; UK → local retailer).
- Core metric ưu tiên trước khi phụ thuộc affiliate: **user trồng thành công**, sau đó mới **user mua hạt giống**. Không lấy affiliate làm bằng chứng business model ban đầu.

---

## 9. Rủi ro & cách xử lý (cập nhật)

| Rủi ro | Cách giảm thiểu |
|---|---|
| Dữ liệu nông học sai cho vùng nhiệt đới/vi khí hậu | Provenance cấp field + expert review rẻ (mục 4.5) |
| Weighted average "cứu" cây trong vùng chết | Hard Constraints filter bắt buộc trước scoring |
| Zero-click mâu thuẫn với dữ liệu cá nhân hóa | Micro-climate Proxy 1-click + 2 tầng recommendation |
| Cold-start khi mở Ask Community quá sớm | Deterministic First Aid trước, Ask Community chờ đủ user density |
| Subscription khó bán ở VN | Hybrid freemium + local payment (Momo/ZaloPay) |
| Affiliate không khả thi ở SEA | Test thực tế trước khi thiết kế commerce UI |
| Agent code refactor engine gây sai lệch âm thầm | Golden Test Cases chạy trong CI như regression suite |
| Rủi ro pháp lý dữ liệu cá nhân (GPS, thông tin vườn) | Tuân thủ Nghị định 13/2023 VN — không lưu tọa độ chính xác dài hạn, chỉ lưu cấp thành phố/quận sau khi xác định vùng khí hậu |
| Nội dung tutorial trùng lặp/vi phạm bản quyền nguồn tổng hợp | Viết lại hoàn toàn bằng ngôn ngữ riêng, không copy nguyên văn từ nguồn online |
| Build engine phức tạp trước khi có ai dùng | Bắt buộc qua Phase 0.5 (Concierge Zalo Bot) trước Phase 0 |

---

## 10. Việc cần làm ngay (tuần này)

1. **Setup Zalo OA Bot** cho Phase 0.5 — nội dung viết tay cho Hà Nội/TP.HCM/Đà Lạt tháng hiện tại, đo theo khung KPI 3 tầng ở mục 3.2.
2. **Viết đủ 15-20 Golden Test Cases** thành file `golden_test_cases.json` — chuẩn bị làm regression suite cho Agent.
3. **Chốt Data Schema v2** cho 1-2 cây mẫu (cải xanh, rau muống) theo cấu trúc mục 4.2, làm chuẩn cho các cây tiếp theo.
4. **Liên hệ nguồn expert review rẻ** (sinh viên nông nghiệp hoặc KOL làm vườn) để review batch đầu 30-40 crop.
5. Sau khi có tín hiệu Intent + Retention Intent mạnh từ Phase 0.5 → giao Agent prompt sau để bắt đầu code:

> **Prompt cho Agent:**
> "Khởi tạo dự án Recommendation Engine. Ngôn ngữ: Typescript/Python.
> 1. Xây dựng Data Model theo Schema v2 (CropBase/HardConstraints/GrowingRules/BeginnerSuccessFactors).
> 2. Implement `getRecommendations(context)`: Hard Constraints Filter → Expected Success Score → Controlled Diversity (2 easy + 1 step-up) → No-match state nếu rỗng.
> 3. Viết Unit Test phủ kín toàn bộ Golden Test Cases trong `golden_test_cases.json`.
> 4. Implement Recommendation Audit Mode (dev-only) để log điểm từng thành phần và lý do exclude.
> 5. Thiết kế `RecommendationContext` với `weather: optional` dùng dummy provider ngay từ đầu.
> Bắt đầu với việc setup project structure và chạy pass cho Test Case #1."