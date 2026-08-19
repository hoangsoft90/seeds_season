/**
 * First Aid — dữ liệu luật cứng (change deterministic-first-aid, plan mục 6).
 *
 * Thay thế Ask Community ở giai đoạn chưa đủ user density: checklist phân nhánh
 * dựa trên luật cứng (không AI đoán mò). Mỗi triệu chứng có cây hỏi (question)
 * phân nhánh theo câu trả lời, nhánh kết thúc ở diagnosis + remedy từng bước.
 *
 * Nguồn: kiến thức làm vườn phổ thông an toàn (viết lại bằng ngôn ngữ riêng,
 * không copy nguyên văn). Luôn kèm "khi nào cần tìm trợ giúp thêm".
 * Chạy client-side hoàn toàn — không login, không API.
 */

export interface FirstAidAnswer {
  id: string;
  label: string;
  next: string; // id của node tiếp theo (question hoặc diagnosis)
}

export interface FirstAidQuestion {
  id: string;
  question: string;
  answers: FirstAidAnswer[];
}

export interface FirstAidDiagnosis {
  id: string;
  diagnosis: string;
  /** Các bước xử lý cụ thể, theo thứ tự. */
  remedy: string[];
  /** Khi nào cần tìm trợ giúp thêm (luôn có — luật an toàn). */
  seekHelp: string;
}

export type FirstAidNode = FirstAidQuestion | FirstAidDiagnosis;

export interface FirstAidSymptom {
  id: string;
  label: string;
  icon: string;
  /** Mô tả ngắn 1 dòng cho màn hình chọn. */
  desc: string;
  startNodeId: string;
  nodes: Record<string, FirstAidNode>;
}

/** Dữ liệu luật cứng — 6 triệu chứng phổ biến với người mới trồng ban công. */
export const FIRST_AID_SYMPTOMS: FirstAidSymptom[] = [
  {
    id: "yellow_leaves",
    label: "Lá vàng",
    icon: "🍂",
    desc: "Lá chuyển vàng từ dưới hoặc trên ngọn",
    startNodeId: "q_water",
    nodes: {
      q_water: {
        id: "q_water",
        question: "Bạn tưới nước thế nào?",
        answers: [
          { id: "a_much", label: "Tưới nhiều (hơn 2 lần/ngày)", next: "d_root_rot" },
          { id: "a_little", label: "Tưới ít, hay quên", next: "d_underwater" },
          { id: "a_mid", label: "Tưới vừa phải", next: "q_soil" },
        ],
      },
      q_soil: {
        id: "q_soil",
        question: "Đất quanh gốc hiện tại ra sao?",
        answers: [
          { id: "a_wet", label: "Ẩm sũng, có mùi hôi", next: "d_root_rot" },
          { id: "a_dry", label: "Khô, nứt nẻ", next: "d_underwater" },
          { id: "a_ok", label: "Bình thường, hơi ẩm", next: "q_where" },
        ],
      },
      q_where: {
        id: "q_where",
        question: "Lá vàng kiểu nào?",
        answers: [
          { id: "a_bottom", label: "Vàng từ dưới gốc lên trước", next: "d_nutrient" },
          { id: "a_top", label: "Vàng trên ngọn, mép lá khô cháy", next: "d_heat" },
        ],
      },
      d_root_rot: {
        id: "d_root_rot",
        diagnosis: "Có thể úng rễ do tưới quá nhiều hoặc đất thoát nước kém.",
        remedy: [
          "Ngưng tưới 3 ngày cho đất se khô",
          "Xới nhẹ đất quanh gốc cho thoáng khí",
          "Kiểm tra chậu có lỗ thoát nước không — đục thêm nếu cần",
          "Chỉ tưới lại khi mặt đất se khô (ngón tay ấn xuống ~2cm thấy khô)",
        ],
        seekHelp: "Nếu sau 1 tuần vẫn không hồi phục, nhấc cây ra kiểm tra rễ — rễ đen nhũn là thối nặng, cần thay đất mới.",
      },
      d_underwater: {
        id: "d_underwater",
        diagnosis: "Thiếu nước — cây đang khát.",
        remedy: [
          "Tưới đẫm ngay cho đến khi nước thấm ra lỗ thoát dưới chậu",
          "Sau đó tưới 1 lần/ngày vào sáng sớm hoặc chiều mát",
          "Trời nắng gắt có thể tưới thêm 1 lần buổi chiều",
        ],
        seekHelp: "Nếu tưới đẫm mà lá vẫn héo vàng sau 2-3 ngày, có thể rễ đã hỏng — cần kiểm tra thêm.",
      },
      d_nutrient: {
        id: "d_nutrient",
        diagnosis: "Thiếu dinh dưỡng (thường là thiếu đạm) hoặc đất đã bạc màu.",
        remedy: [
          "Bón phân hữu cơ loãng (phân trùn quế, phân bò hoai) 1 lần/tuần",
          "Cắt bỏ lá vàng già để cây tập trung nuôi lá mới",
          "Đảm bảo đất tơi xốp, không bị nén chặt",
        ],
        seekHelp: "Nếu bón phân 2 tuần mà lá vẫn vàng, có thể do rễ bị tổn thương — nhờ người có kinh nghiệm xem giúp.",
      },
      d_heat: {
        id: "d_heat",
        diagnosis: "Nắng gắt làm lá mất nước và cháy mép.",
        remedy: [
          "Che bớt nắng buổi trưa (lưới che 50% hoặc chuyển chỗ mát)",
          "Tưới vào sáng sớm trước khi nắng lên",
          "Nếu nhiệt độ >35°C, chuyển chậu vào chỗ có bóng râm buổi trưa",
        ],
        seekHelp: "Lá cháy nắng nặng không hồi phục được — cắt bỏ phần cháy và theo dõi lá mới.",
      },
    },
  },
  {
    id: "wilting",
    label: "Héo rũ",
    icon: "🥀",
    desc: "Cây rũ xuống dù đã tưới",
    startNodeId: "q_when",
    nodes: {
      q_when: {
        id: "q_when",
        question: "Cây héo vào lúc nào trong ngày?",
        answers: [
          { id: "a_midday", label: "Héo giữa trưa nắng, chiều tối hồi lại", next: "d_heat_wilt" },
          { id: "a_always", label: "Héo cả ngày, không hồi lại", next: "q_soil_wilt" },
        ],
      },
      q_soil_wilt: {
        id: "q_soil_wilt",
        question: "Đất quanh gốc hiện tại?",
        answers: [
          { id: "a_dry", label: "Khô, nứt nẻ", next: "d_underwater_wilt" },
          { id: "a_wet", label: "Ẩm sũng", next: "d_root_rot_wilt" },
          { id: "a_ok", label: "Bình thường", next: "d_check_roots" },
        ],
      },
      d_heat_wilt: {
        id: "d_heat_wilt",
        diagnosis: "Héo do nắng nóng ban ngày — cây mất nước nhanh hơn khả năng hút nước.",
        remedy: [
          "Tưới đẫm vào sáng sớm và chiều mát",
          "Che bớt nắng buổi trưa bằng lưới hoặc chuyển chỗ râm mát",
          "Phủ thêm lớp rơm/lá khô lên mặt đất để giữ ẩm",
        ],
        seekHelp: "Đây là hiện tượng bình thường với cây ưa mát vào mùa nóng — chỉ cần theo dõi không để héo kéo dài.",
      },
      d_underwater_wilt: {
        id: "d_underwater_wilt",
        diagnosis: "Thiếu nước trầm trọng.",
        remedy: [
          "Tưới đẫm ngay, vài giờ sau tưới thêm một lần",
          "Ngâm cả chậu vào chậu nước 10 phút nếu đất quá khô cứng",
          "Từ đó tưới đều 1-2 lần/ngày tuỳ nắng",
        ],
        seekHelp: "Nếu tưới lại 1 ngày mà cây vẫn rũ, rễ có thể đã hỏng vì khô hạn kéo dài.",
      },
      d_root_rot_wilt: {
        id: "d_root_rot_wilt",
        diagnosis: "Đất quá ẩm làm úng rễ — cây héo dù có nước.",
        remedy: [
          "Ngưng tưới 3-4 ngày",
          "Xới nhẹ đất, kiểm tra lỗ thoát nước của chậu",
          "Nếu chậu không thoát nước, thay chậu có lỗ thoát",
        ],
        seekHelp: "Nếu rễ đã thối đen, cần cắt bỏ rễ hỏng và thay đất mới — xem triệu chứng 'Úng rễ'.",
      },
      d_check_roots: {
        id: "d_check_roots",
        diagnosis: "Đất bình thường nhưng cây vẫn héo — cần kiểm tra kỹ hơn.",
        remedy: [
          "Kiểm tra rễ: nhấc nhẹ cây xem rễ có đen, nhũn, mùi hôi không",
          "Kiểm tra sâu bọ ở gốc và mặt dưới lá",
          "Kiểm tra nhiệt độ — cây đặt cạnh tường/tôn hấp nhiệt có thể bị nóng rễ",
        ],
        seekHelp: "Nếu không tìm ra nguyên nhân trong vài ngày, chụp ảnh và hỏi người có kinh nghiệm — đừng tự ý tưới thêm phân.",
      },
    },
  },
  {
    id: "leaf_spots",
    label: "Đốm lá",
    icon: "🟤",
    desc: "Đốm nâu/đen/vàng trên lá",
    startNodeId: "q_color",
    nodes: {
      q_color: {
        id: "q_color",
        question: "Đốm trên lá có màu gì?",
        answers: [
          { id: "a_brown", label: "Nâu/đen, khô", next: "q_spread" },
          { id: "a_yellow", label: "Vàng loang quanh đốm nâu", next: "d_fungal" },
        ],
      },
      q_spread: {
        id: "q_spread",
        question: "Đốm có lan nhanh sang lá khác không?",
        answers: [
          { id: "a_fast", label: "Có, lan nhanh", next: "d_fungal_severe" },
          { id: "a_slow", label: "Không, đốm rải rác", next: "d_sun_scorch" },
        ],
      },
      d_fungal: {
        id: "d_fungal",
        diagnosis: "Có thể bệnh nấm (đốm lá) — thường do lá ẩm lâu, thoát gió kém.",
        remedy: [
          "Cắt bỏ lá bị đốm, bỏ xa chậu (không ủ gần cây)",
          "Tưới vào gốc, tránh tưới lên lá",
          "Tăng thoáng gió cho chỗ trồng",
          "Phun phòng dung dịch tỏi/ớt loãng hoặc neem 1 lần/tuần",
        ],
        seekHelp: "Nếu đốm lan nhanh dù đã xử lý, có thể cần thuốc trị nấm chuyên dụng — hỏi cửa hàng vật tư nông nghiệp.",
      },
      d_fungal_severe: {
        id: "d_fungal_severe",
        diagnosis: "Bệnh nấm đang lan — cần xử lý nhanh.",
        remedy: [
          "Cắt bỏ toàn bộ lá bệnh ngay hôm nay",
          "Cách ly cây bệnh khỏi cây khoẻ",
          "Ngưng tưới lên lá, chỉ tưới gốc",
          "Phun thuốc phòng nấm (theo hướng dẫn an toàn) 2 lần cách nhau 5-7 ngày",
        ],
        seekHelp: "Bệnh nấm lan nhanh có thể làm chết cả cây — nếu không tự tin, mang mẫu lá ra cửa hàng vật tư nhờ tư vấn.",
      },
      d_sun_scorch: {
        id: "d_sun_scorch",
        diagnosis: "Đốm do cháy nắng — thường khi tưới nước đọng trên lá giữa trưa nắng.",
        remedy: [
          "Tưới vào sáng sớm hoặc chiều mát, tránh tưới giữa trưa",
          "Tưới vào gốc thay vì phun lên lá",
          "Che bớt nắng gắt nếu lá non bị cháy nhiều",
        ],
        seekHelp: "Vết cháy nắng không hồi phục — cắt bỏ lá hỏng nặng, lá mới sẽ bình thường nếu tưới đúng cách.",
      },
    },
  },
  {
    id: "pests",
    label: "Sâu bọ",
    icon: "🐛",
    desc: "Thấy sâu, rệp hoặc lá bị ăn",
    startNodeId: "q_which",
    nodes: {
      q_which: {
        id: "q_which",
        question: "Bạn thấy loại nào trên cây?",
        answers: [
          { id: "a_aphids", label: "Rệp nhỏ xanh/đen bám đọt non", next: "d_aphids" },
          { id: "a_caterpillar", label: "Sâu xanh/lớn ăn lá", next: "d_caterpillar" },
          { id: "a_mite", label: "Nhện đỏ (mạng mỏng, lá lấm tấm vàng)", next: "d_spider_mite" },
          { id: "a_ants", label: "Kiến bò quanh gốc", next: "d_ants" },
        ],
      },
      d_aphids: {
        id: "d_aphids",
        diagnosis: "Rệp mềm hút nhựa đọt non — làm lá quăn, chậm lớn.",
        remedy: [
          "Xịt nước mạnh vào đọt để rửa trôi rệp (làm sáng sớm)",
          "Lau tay hoặc cắt bỏ đọt nhiễm nặng",
          "Phun dung dịch neem hoặc nước xà phòng loãng 1 lần/3 ngày",
        ],
        seekHelp: "Rệp kéo kiến đến — nếu kiến xuất hiện, xử lý cả kiến (xem nhánh 'Kiến').",
      },
      d_caterpillar: {
        id: "d_caterpillar",
        diagnosis: "Sâu ăn lá — thường sâu xanh, sâu khoang.",
        remedy: [
          "Bắt sâu bằng tay vào sáng sớm hoặc chiều tối (sâu thường ẩn mặt dưới lá)",
          "Kiểm tra và nhặt trứng sâu (chùm nhỏ dưới lá)",
          "Nếu nhiều, phun neem hoặc chế phẩm BT theo hướng dẫn",
        ],
        seekHelp: "Nếu sâu tái phát liên tục, kiểm tra xung quanh chậu — sâu có thể đang nhộng trong đất.",
      },
      d_spider_mite: {
        id: "d_spider_mite",
        diagnosis: "Nhện đỏ — thường xuất hiện khi trời nóng khô, thoát gió kém.",
        remedy: [
          "Tăng độ ẩm: phun sương lên lá mỗi sáng",
          "Rửa lá bằng nước, đặc biệt mặt dưới lá",
          "Phun neem 1 lần/3 ngày trong 2 tuần",
        ],
        seekHelp: "Nhện đỏ sinh sôi rất nhanh — nếu không cải thiện sau 2 tuần, cần thuốc đặc trị.",
      },
      d_ants: {
        id: "d_ants",
        diagnosis: "Kiến thường đi theo rệp (kiến nuôi rệp lấy mật) hoặc làm tổ trong chậu.",
        remedy: [
          "Kiểm tra có rệp không — nếu có, xử lý rệp trước, kiến sẽ tự rời",
          "Đặt chậu lên khay nước (chặn đường kiến)",
          "Rắc bột nghệ/ớt quanh miệng chậu để đuổi kiến",
        ],
        seekHelp: "Nếu kiến làm tổ trong chậu (đất đùn lên), thay đất và kiểm tra rễ có bị kiến phá không.",
      },
    },
  },
  {
    id: "root_rot",
    label: "Úng rễ",
    icon: "💧",
    desc: "Tưới quá nhiều, đất sũng nước",
    startNodeId: "q_drain",
    nodes: {
      q_drain: {
        id: "q_drain",
        question: "Chậu có lỗ thoát nước không?",
        answers: [
          { id: "a_no", label: "Không có lỗ thoát", next: "d_no_drain" },
          { id: "a_yes", label: "Có lỗ thoát", next: "q_puddle" },
        ],
      },
      q_puddle: {
        id: "q_puddle",
        question: "Tưới xong, nước có đọng lâu trên mặt đất không?",
        answers: [
          { id: "a_long", label: "Có, đọng cả ngày", next: "d_compacted" },
          { id: "a_fast", label: "Không, thấm nhanh", next: "q_smell" },
        ],
      },
      q_smell: {
        id: "q_smell",
        question: "Đất hoặc rễ có mùi hôi, rễ thấy đen nhũn không?",
        answers: [
          { id: "a_rot", label: "Có, rễ đen/mùi hôi", next: "d_rot_severe" },
          { id: "a_notsure", label: "Không rõ", next: "d_overwater_prevent" },
        ],
      },
      d_no_drain: {
        id: "d_no_drain",
        diagnosis: "Chậu không thoát nước — rễ ngâm nước lâu ngày sẽ thối.",
        remedy: [
          "Đục 3-5 lỗ thoát ở đáy chậu",
          "Kê chậu cao (gạch/gỗ) để nước thừa chảy ra",
          "Ngưng tưới vài ngày cho đất bớt sũng",
        ],
        seekHelp: "Nếu cây đã héo kèm đất sũng lâu ngày, nhấc ra kiểm tra rễ ngay.",
      },
      d_compacted: {
        id: "d_compacted",
        diagnosis: "Đất bị nén chặt, thoát nước kém.",
        remedy: [
          "Xới nhẹ bề mặt đất cho thoáng",
          "Trộn thêm xơ dừa/trấu hun vào đất mặt",
          "Tưới ít hơn, chờ đất se khô mới tưới tiếp",
        ],
        seekHelp: "Nếu đất nén quá cứng, nên thay đất mới tơi xốp (xem hướng dẫn trồng của cây).",
      },
      d_rot_severe: {
        id: "d_rot_severe",
        diagnosis: "Rễ đã thối — cần cứu cây ngay.",
        remedy: [
          "Nhấc cây khỏi chậu, rũ bớt đất cũ",
          "Cắt bỏ toàn bộ rễ đen nhũn bằng kéo sạch",
          "Nhúng gốc vào dung dịch thuốc tím loãng nếu có",
          "Trồng lại vào chậu có lỗ thoát, đất mới tơi xốp",
          "Ngưng tưới 2-3 ngày, để chỗ mát",
        ],
        seekHelp: "Cây mất nhiều rễ sẽ yếu — nếu cây không hồi phục sau 2 tuần, có thể phải trồng lại từ đầu.",
      },
      d_overwater_prevent: {
        id: "d_overwater_prevent",
        diagnosis: "Có nguy cơ úng rễ — phòng trước khi quá muộn.",
        remedy: [
          "Ngưng tưới 2-3 ngày cho đất se khô",
          "Sau đó chỉ tưới khi mặt đất khô (kiểm tra bằng ngón tay ~2cm)",
          "Quan sát lá — nếu lá vàng/héo thêm, xem nhánh 'Lá vàng' hoặc 'Héo rũ'",
        ],
        seekHelp: "Đa số cây ban công chết vì tưới nhiều hơn là tưới ít — khi nghi ngờ, hãy để đất khô hơn.",
      },
    },
  },
  {
    id: "slow_growth",
    label: "Chậm lớn",
    icon: "🐢",
    desc: "Cây mãi không lớn, lá nhỏ",
    startNodeId: "q_sun",
    nodes: {
      q_sun: {
        id: "q_sun",
        question: "Chỗ trồng có nắng không?",
        answers: [
          { id: "a_low", label: "Ít nắng (dưới 3h/ngày)", next: "d_low_sun" },
          { id: "a_enough", label: "Đủ nắng", next: "q_feed" },
        ],
      },
      q_feed: {
        id: "q_feed",
        question: "Bạn bón phân thế nào?",
        answers: [
          { id: "a_never", label: "Chưa bón phân bao giờ", next: "d_no_feed" },
          { id: "a_regular", label: "Bón đều đặn", next: "q_pot" },
        ],
      },
      q_pot: {
        id: "q_pot",
        question: "Chậu có vẻ quá nhỏ so với cây không (rễ tràn lỗ thoát)?",
        answers: [
          { id: "a_tight", label: "Có, rễ tràn ra ngoài", next: "d_rootbound" },
          { id: "a_ok", label: "Không, vừa", next: "d_patience" },
        ],
      },
      d_low_sun: {
        id: "d_low_sun",
        diagnosis: "Thiếu nắng — hầu hết rau củ quả cần ít nhất 4-6h nắng/ngày để lớn nhanh.",
        remedy: [
          "Chuyển cây ra chỗ nắng hơn (ban công hướng nam/đông)",
          "Nếu chỉ có cửa sổ ít nắng, chọn cây ưa bóng như rau muống, hành lá",
          "Cắt bớt cành yếu để cây tập trung nuôi thân chính",
        ],
        seekHelp: "Một số cây (cà chua, ớt) cần nắng gắt — nếu không đủ nắng, đổi sang cây phù hợp hơn.",
      },
      d_no_feed: {
        id: "d_no_feed",
        diagnosis: "Đất thiếu dinh dưỡng — cây không có \"thức ăn\" để lớn.",
        remedy: [
          "Bón phân hữu cơ loãng (trùn quế, phân bò hoai) 1 lần/tuần",
          "Pha loãng hơn hướng dẫn 50% cho cây non",
          "Bón vào lúc chiều mát, tránh lúc trời nắng gắt",
        ],
        seekHelp: "Bón quá đặc sẽ cháy rễ — luôn pha loãng khi mới bắt đầu.",
      },
      d_rootbound: {
        id: "d_rootbound",
        diagnosis: "Chậu quá nhỏ — rễ hết chỗ, cây không lớn thêm được.",
        remedy: [
          "Thay chậu lớn hơn (lớn hơn 2-3 số)",
          "Xới nhẹ rễ trước khi trồng vào chậu mới",
          "Sau khi thay, để chỗ mát 2-3 ngày rồi mới cho ra nắng",
        ],
        seekHelp: "Thay chậu vào lúc chiều mát và tưới nhẹ — tránh thay chậu giữa trưa nắng.",
      },
      d_patience: {
        id: "d_patience",
        diagnosis: "Mọi thứ ổn nhưng cây lớn chậm — có thể đang theo nhịp mùa hoặc giống chậm.",
        remedy: [
          "Kiểm tra thời vụ của cây — một số cây lớn chậm vào mùa lạnh/nóng",
          "Đảm bảo tưới đều, không để đất khô hẳn giữa các lần tưới",
          "Chụp ảnh mỗi tuần để so sánh — cây lớn chậm vẫn là bình thường nếu lá xanh khoẻ",
        ],
        seekHelp: "Nếu lá nhợt nhạt kèm chậm lớn, xem nhánh 'Lá vàng' (thiếu dinh dưỡng).",
      },
    },
  },
];
