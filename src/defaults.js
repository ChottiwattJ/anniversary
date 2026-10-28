// Default content. Everything here can be changed later in /admin.
// Lines marked [แก้เอง] are placeholders to rewrite in your own words.

export const DEFAULT_CONTENT = {
  her: { name: "จ๊ะจ๋า", short: "จจ" },
  me: "เช้งน้อย",

  gate: {
    title: "สำหรับ จจ",
    hint: "คำที่เช้งน้อยพูดบ่อยที่สุด",
    // Thai vowels and tone marks are ignored when checking, and ช counts as ฉ.
    answers: ["ปังฉึกฉึก"],
  },

  // Tap-through story shown before the full page. Order:
  // intro → chat game → one page per timeline moment → distance → this or that →
  // photo zoom → two truths one lie → quiz → letter → scratch ticket → outro.
  story: {
    show: true,
    intro: {
      title: "สวัสดี จจ",
      text: "วันนี้เช้งน้อยมีเรื่องจะเล่าให้ฟัง ค่อยๆ แตะไปทีละหน้านะ",
      button: "เริ่มเลย",
    },
    distance: { title: "ตอนนี้เราอยู่กันคนละซีกโลก" },

    // Intro page shown right before each game. Set show: false to skip one.
    intros: {
      chat: {
        show: true,
        eyebrow: "บทแรก",
        title: "ย้อนกลับไปตอนนั้น",
        text: "หน้าต่อไปเป็นแชทจำลอง ตอนที่เช้งน้อยเพิ่งกลับมาทัก จจ อีกครั้ง\n\nเช้งน้อยจะพิมพ์มาเอง จจ แค่แตะเลือกคำตอบที่อยู่ด้านล่าง\n\nบางคำตอบจะพาไปฉากจบแบบอื่น กดลองใหม่ได้เรื่อยๆ จนกว่าจะเจอฉากจบจริง",
        button: "เริ่มแชท",
      },
      thisOrThat: {
        show: true,
        eyebrow: "เกม",
        title: "แบบไหนดี",
        text: "จะมีให้เลือกทีละสองอย่าง แตะอันที่ จจ ชอบมากกว่า\n\nจบแล้วมาดูกันว่าตรงกับที่เช้งน้อยเลือกไว้กี่ข้อ",
        button: "เริ่มเลย",
      },
      photoZoom: {
        show: true,
        eyebrow: "เกม",
        title: "ที่ไหนเอ่ย",
        text: "รูปจะเริ่มจากซูมเข้าไปใกล้มาก ลองทายว่าเป็นรูปจากที่ไหน\n\nตอบผิด รูปจะค่อยๆ ซูมออกให้เห็นมากขึ้น",
        button: "เริ่มเลย",
      },
      twoTruths: {
        show: true,
        eyebrow: "เกม",
        title: "จริงสอง โกหกหนึ่ง",
        text: "แต่ละรอบมีเรื่องจริงสองเรื่อง กับเรื่องโกหกหนึ่งเรื่อง\n\nแตะข้อที่คิดว่าเป็นเรื่องโกหก",
        button: "เริ่มเลย",
      },
      quiz: {
        show: true,
        eyebrow: "เกม",
        title: "ทดสอบความจำ",
        text: "คำถามสั้นๆ เกี่ยวกับเรา\n\nตอบผิดได้ ลองใหม่จนกว่าจะถูก",
        button: "เริ่มเลย",
      },
    },

    // Extra pages you add yourself. at = where it goes:
    // start, chat, timeline, distance, thisOrThat, photoZoom, twoTruths, quiz, letter, ticket (= after that part)
    extraPages: [],

    thisOrThat: {
      show: true,
      title: "แบบไหนดี",
      // mine: your own pick, 1 = left, 2 = right
      items: [
        { a: "หมูกระทะ", b: "ชาบู", mine: 1 },
        { a: "ทะเล", b: "ภูเขา", mine: 1 },
        { a: "ชานม", b: "กาแฟ", mine: 2 },
        { a: "โทรคุย", b: "พิมพ์แชท", mine: 1 },
        { a: "นอนดึก", b: "ตื่นเช้า", mine: 1 },
        { a: "อยู่บ้าน", b: "ออกไปเที่ยว", mine: 2 },
      ],
      results: {
        all: "ตรงกันทุกข้อ",
        most: "ตรงกันเยอะเลย",
        few: "ไม่ค่อยตรงกัน แต่ก็มาด้วยกันได้ถึงสองปี",
      },
    },

    // Each round: a photo starts zoomed in on one spot and zooms out with each wrong guess.
    // items: [{ photo, x, y, q, choices, answer, right }]  (x, y = zoom point in %)
    photoZoom: { show: true, title: "ที่ไหนเอ่ย", items: [] },

    twoTruths: {
      show: true,
      title: "จริงสอง โกหกหนึ่ง",
      question: "ข้อไหนโกหก",
      // lie = number of the false statement (1 = first)
      items: [
        {
          statements: ["เราเป็นเพื่อนกันมาตั้งแต่สมัยมัธยม", "เช้งน้อยย้ายไปอเมริกาเดือนสิงหาคม 2026", "เราเริ่มคบกันเดือนพฤศจิกายน 2024"],
          lie: 3,
          reveal: "เราเริ่มกันวันที่ 28 ตุลาคม 2024 วันนี้เมื่อสองปีก่อน",
        },
        {
          statements: ["[แก้เอง: เรื่องจริง]", "[แก้เอง: เรื่องจริง]", "[แก้เอง: เรื่องโกหก]"],
          lie: 3,
          reveal: "[แก้เอง]",
        },
      ],
    },
    quiz: {
      show: true,
      title: "ทดสอบความจำ",
      // answer = number of the correct choice (1 = first)
      items: [
        {
          q: "เช้งน้อยย้ายไปอยู่เมืองไหน",
          choices: ["ชิคาโก", "West Lafayette", "นิวยอร์ก"],
          answer: 2,
          right: "ใช่แล้ว เมืองเล็กๆ ที่เงียบมาก ซัมเมอร์หน้ามาดูด้วยกันนะ",
        },
        {
          q: "จจ บินไปหาเช้งน้อยที่ฮ่องกงกี่ครั้ง",
          choices: ["2 ครั้ง", "3 ครั้ง", "4 ครั้ง"],
          answer: 2,
          right: "3 ครั้ง ครั้งหน้าเปลี่ยนเป็นที่อเมริกาบ้าง",
        },
        {
          q: "คำที่เช้งน้อยพูดบ่อยที่สุด",
          choices: ["ง่วงแล้ว", "ปังฉึกฉึก", "หิวข้าว"],
          answer: 2,
          right: "ปังฉึกฉึก เดาถูกด้วย",
        },
      ],
    },
    letter: { teaser: "มีจดหมายถึง จจ", hint: "แตะซองเพื่อเปิด" },
    ticket: { teaser: "ยังมีอีกอย่าง", hint: "ขูดเพื่อดูว่าคืออะไร" },
    outro: {
      title: "ทั้งหมดนี้เก็บไว้ให้ จจ แล้ว",
      text: "ต่อจากนี้เลื่อนดูได้ทุกอย่าง มีจดหมายที่ยังไม่ได้เปิด กับที่ฝากข้อความถึงเช้งน้อยรออยู่",
      button: "ดูทั้งหมด",
    },
  },

  hero: {
    show: true,
    date: "28 ตุลาคม",
    title: "สุขสันต์วันครบรอบ 2 ปีนะ จจ",
    subtitle: "หน้านี้ทำไว้ให้ จจ คนเดียว ค่อยๆ เลื่อนดูนะ",
  },

  // Labels on the full page (opening and clocks). {n} {km} {h} are filled in.
  // dateLang: "en" or "th" for the day names under the clocks.
  labels: {
    days: "Together for {n} days",
    distance: "{km} km",
    diff: "{h} hours apart",
    dateLang: "en",
    replayChat: "Play the chat again",
    replayStory: "Watch our story again",
    back: "Back",
    skip: "Skip to everything",
  },

  // Set as YYYY-MM-DD to show "together N days". Leave empty to hide.
  togetherSince: "2024-10-28",

  clocks: {
    show: true,
    distanceKm: 13942,
    hereLabel: "กรุงเทพฯ",
    thereLabel: "West Lafayette",
    // Hours are West Lafayette (Indiana) time, 0–24.
    statuses: [
      { from: 0, to: 7, text: "เช้งน้อยน่าจะหลับอยู่ ฝากข้อความไว้ได้นะ" },
      { from: 7, to: 9, text: "เช้งน้อยเพิ่งตื่น" },
      { from: 9, to: 17, text: "เช้งน้อยอยู่ที่มหาลัย" },
      { from: 17, to: 24, text: "เช้งน้อยว่างแล้ว ทักมาได้เลย" },
    ],
  },

  letter: {
    show: true,
    title: "ถึง จจ",
    body:
      "จากเพื่อนสมัยมัธยม มาเจอกันอีกครั้ง แล้วก็มาถึงวันนี้\n\n" +
      "ปีนี้เราอยู่ไกลกันที่สุดตั้งแต่รู้จักกันมา เวลา จจ ตื่น เค้ากำลังจะนอน เวลาเค้าตื่น จจ ก็เพิ่งออกเวร แต่ทุกครั้งที่ได้คุยกัน ก็ยังรู้สึกเหมือนเดิม\n\n" +
      "ขอบคุณที่ยังอยู่ตรงนี้ด้วยกันนะ\n\n" +
      "[แก้เอง: เขียนเรื่องที่อยากบอก จจ จริงๆ ตรงนี้]",
    signoff: "รักนะ\nเช้งน้อย",
  },

  timeline: {
    show: true,
    title: "เรื่องของเรา",
    items: [
      { date: "สมัยมัธยม", title: "เริ่มจากเป็นเพื่อนกัน", text: "" },
      { date: "2024", title: "กลับมาเจอกันอีกครั้ง", text: "[แก้เอง: เจอกันอีกทีได้ยังไง]" },
      { date: "[วันที่]", title: "นัดเจอกันครั้งแรก", text: "ไม่ได้เรียกว่าเดตหรอก แค่นั่งคุยกันสองคน" },
      { date: "28 ตุลาคม 2024", title: "วันที่เราเริ่มต้น", text: "" },
      { date: "[เดือน ปี]", title: "จจ บินมาหาที่ฮ่องกง ครั้งที่ 1", text: "" },
      { date: "[เดือน ปี]", title: "ฮ่องกง ครั้งที่ 2", text: "" },
      { date: "[เดือน ปี]", title: "ฮ่องกง ครั้งที่ 3", text: "" },
      { date: "สิงหาคม 2026", title: "เช้งน้อยย้ายไปเรียนที่อเมริกา", text: "ไกลกว่าเดิมอีก แต่ไม่นานหรอก" },
    ],
  },

  // Chat game: replay the early chats. She picks her replies.
  // Each node: him = his messages (one per line), choices lead to another node.
  // A node with an ending stops the chat: "funny" lets her retry, "true" continues the story.
  chat: {
    show: true,
    title: "ย้อนกลับไปตอนนั้น",
    intro: "ย้อนกลับไปตอนที่เช้งน้อยเพิ่งทัก จจ อีกครั้ง ลองตอบดูนะ เลือกผิดก็ไม่เป็นไร เล่นใหม่ได้",
    start: "start",
    nodes: [
      {
        id: "start", divider: "2024",
        him: ["ว่าไง จจ", "ไม่ได้คุยกันนานเลย ยังจำกันได้ไหม"],
        choices: [{ text: "จำได้สิ เช้งน้อยนี่", next: "n2" }, { text: "ใครอะ", next: "end_who" }],
        ending: "", endingTitle: "", endingText: "",
      },
      {
        id: "end_who", divider: "",
        him: ["...", "ขอโทษครับ ทักผิดคน 🙂"],
        choices: [],
        ending: "funny", endingTitle: "คนแปลกหน้า", endingText: "เช้งน้อยกลับไปเรียนต่อเงียบๆ ไม่กล้าทักใครอีกเลย",
      },
      {
        id: "n2", divider: "",
        him: ["ดีใจจัง", "ตอนนี้ทำอะไรอยู่"],
        choices: [{ text: "เพิ่งออกเวร เหนื่อยมาก", next: "n3" }, { text: "กำลังจะนอน ฝันดีนะ", next: "end_sleep" }],
        ending: "", endingTitle: "", endingText: "",
      },
      {
        id: "end_sleep", divider: "",
        him: ["ฝันดีครับ"],
        choices: [],
        ending: "funny", endingTitle: "ฝันดีตลอดกาล", endingText: "บทสนทนาจบตรงนั้น แล้วก็ไม่มีใครทักกลับอีกเลย",
      },
      {
        id: "n3", divider: "",
        him: ["งั้นไปกินข้าวก่อนนะ", "ว่างๆ เจอกันไหม แค่นั่งคุยกันเฉยๆ"],
        choices: [{ text: "ได้สิ", next: "end_true" }, { text: "ขอคิดดูก่อน 5 ปี", next: "end_wait" }],
        ending: "", endingTitle: "", endingText: "",
      },
      {
        id: "end_wait", divider: "",
        him: ["โอเค เดี๋ยวรอ"],
        choices: [],
        ending: "funny", endingTitle: "รอ 5 ปี", endingText: "เช้งน้อยเรียนจบปริญญาเอกพอดี แต่ก็ยังรออยู่",
      },
      {
        id: "end_true", divider: "",
        him: ["เย้", "งั้นเจอกันนะ"],
        choices: [],
        ending: "true", endingTitle: "ฉากจบจริง", endingText: "แล้วทุกอย่างก็เริ่มจากตรงนั้น",
      },
    ],
  },

  photos: { show: true, title: "รูปของเรา", items: [] }, // items: [{ key, caption }]

  video: {
    enabled: false,
    key: "",
    title: "วิดีโอที่ดูได้ครั้งเดียว",
    intro: "เค้าอัดไว้ให้ จจ ดูได้แค่ครั้งเดียว หาที่เงียบๆ ใส่หูฟัง แล้วค่อยกดนะ",
    windowMinutes: 20,
    afterText: "ดูไปแล้วนะ ช่วงเวลานี้เป็นของ จจ คนเดียว",
  },

  openWhen: {
    show: true,
    title: "เปิดเมื่อ...",
    intro: "เก็บไว้เปิดตอนที่ต้องการ ไม่ต้องเปิดหมดวันนี้ก็ได้",
    items: [
      {
        title: "คิดถึง แต่เช้งน้อยยังหลับอยู่",
        body: "ตอนนี้ฝั่งนี้น่าจะดึกแล้ว เค้าคงหลับอยู่ ไม่ต้องรอนะ ส่งข้อความทิ้งไว้ได้เลย ตื่นมาเค้าจะอ่านเป็นอย่างแรก\n\n[แก้เอง]",
        unlockDate: "",
      },
      {
        title: "เพิ่งออกเวร เหนื่อยมาก",
        body: "วันนี้ทำงานหนักมาทั้งวันแล้ว ไม่ต้องทำอะไรต่อแล้วนะ กินข้าว อาบน้ำ แล้วไปนอน เก่งมากแล้ววันนี้\n\n[แก้เอง]",
        unlockDate: "",
      },
      {
        title: "นอนไม่หลับ",
        body: "ตอน จจ นอนไม่หลับ ฝั่งนี้เป็นตอนกลางวันพอดี โทรมาได้เลยนะ ถ้าเค้าติดเรียนอยู่ เดี๋ยวโทรกลับ\n\n[แก้เอง]",
        unlockDate: "",
      },
      {
        title: "วันนี้แย่",
        body: "วันแย่ๆ ก็มีได้ ไม่ต้องเข้มแข็งตลอดเวลาก็ได้ เล่าให้ฟังได้ทุกเรื่อง\n\n[แก้เอง]",
        unlockDate: "",
      },
      {
        title: "เรางอนกันอยู่",
        body: "ถ้าเปิดอันนี้อยู่ แปลว่าเรากำลังงอนกัน ขอโทษก่อนนะ แล้วค่อยคุยกันดีๆ\n\n[แก้เอง]",
        unlockDate: "",
      },
      {
        title: "นับวันรอซัมเมอร์",
        body: "อีกไม่นานแล้ว ระหว่างนี้เค้าวางแผนทริปไว้รอแล้วนะ\n\n[แก้เอง]",
        unlockDate: "",
      },
    ],
  },

  trip: {
    show: true,
    title: "ซัมเมอร์ 2027",
    intro: "ครั้งนี้เปลี่ยนให้ จจ เป็นฝ่ายบินมาบ้าง เช้งน้อยกำลังวางแผนทริปไว้ให้แล้ว",
    from: { code: "BKK", city: "กรุงเทพฯ" },
    to: { code: "ORD", city: "ชิคาโก" },
    passengerLabel: "Passenger Name:",
    passenger: "Jajaa",
    dateLabel: "Date:",
    dateText: "Summer 2027",
    stops: [
      { name: "ชิคาโก", text: "เมืองแรกที่ จจ จะได้เห็น" },
      { name: "Purdue", text: "มาดูว่าเช้งน้อยใช้ชีวิตยังไงที่นี่" },
      { name: "อีกที่หนึ่ง", text: "ยังเป็นความลับ" },
    ],
  },

  reply: {
    show: true,
    title: "ฝากข้อความถึงเช้งน้อย",
    intro: "เขียนทิ้งไว้ได้ตลอด ถึงเค้าจะหลับอยู่ ตื่นมาก็จะได้อ่าน",
    placeholder: "พิมพ์ตรงนี้...",
  },

  ending: {
    show: true,
    title: "เจอกันในวิดีโอคอลนะ",
    body: "[แก้เอง: นัดเวลาโทรหากัน]",
    callLabel: "",
    callLink: "",
  },

  music: { key: "", title: "We Fell in Love in October" },
};
