export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  slug: 'foydalanish-shartlari' | 'maxfiylik-siyosati';
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  contactNote: string;
};

export const TERMS_OF_USE: LegalDoc = {
  slug: 'foydalanish-shartlari',
  eyebrow: 'Huquqiy hujjat',
  title: 'Foydalanish shartlari',
  updated: '2026-yil 27-oktabr',
  intro:
    'Ushbu Foydalanish shartlari («Shartlar») PROOPEX HR platformasi («Platforma», «xizmat») dan foydalanish tartibini belgilaydi. Platformaga kirish, ro‘yxatdan o‘tish yoki xizmatdan foydalanish orqali siz ushbu Shartlarga rozilik bildirgan hisoblanasiz.',
  sections: [
    {
      title: '1. Umumiy qoidalar',
      paragraphs: [
        'PROOPEX — xodimlar, davomat, vazifalar, KPI, hisob-kitob, filiallar va bog‘liq operatsion jarayonlarni yagona raqamli muhitda boshqarish uchun mo‘ljallangan korporativ platforma.',
        'Shartlar barcha foydalanuvchilarga (tashkilot admini, rahbar, xodim, stajyor va boshqa rollar) bir xil darajada tatbiq etiladi. Tashkilot o‘z xodimlarining Platformadan foydalanishi uchun ichki tartib-qoidalarni belgilashi mumkin, lekin ular ushbu Shartlarga zid kelmasligi kerak.',
      ],
    },
    {
      title: '2. Hisob va kirish',
      paragraphs: [
        'Platformaga kirish uchun tashkilot yoki vakolatli shaxs tomonidan berilgan hisob ma’lumotlari talab qilinadi. Siz login, parol va boshqa autentifikatsiya vositalarining maxfiyligini saqlashga majbursiz.',
        'Hisobingiz orqali amalga oshirilgan harakatlar uchun javobgarlik sizga (yoki sizning tashkilotingizga) yuklatiladi. Shubhali faoliyatni aniqlasangiz, darhol tashkilot adminiga yoki PROOPEX qo‘llab-quvvatlashiga murojaat qiling.',
      ],
      bullets: [
        'Boshqa shaxsning hisobidan ruxsatsiz foydalanish taqiqlanadi.',
        'Parolni uchinchi shaxslarga berish yoki ommaviy joylarda saqlash tavsiya etilmaydi.',
        'Tashkilot admini foydalanuvchi ruxsatlarini cheklashi, o‘zgartirishi yoki bekor qilishi mumkin.',
      ],
    },
    {
      title: '3. Xizmatdan foydalanish maqsadi',
      paragraphs: [
        'Platforma faqat qonuniy biznes va HR jarayonlari uchun mo‘ljallangan. Quyidagilar taqiqlanadi:',
      ],
      bullets: [
        'Qonunga zid maqsadlarda foydalanish.',
        'Tizim xavfsizligini buzish, ruxsatsiz kirish, zararli dastur yuborish.',
        'Boshqa foydalanuvchilar ma’lumotlarini o‘g‘irlash yoki suiiste’mol qilish.',
        'Platforma ishini buzadigan avtomatlashtirilgan hujumlar, skanerlash yoki yuklama yaratish.',
        'Mualliflik huquqi, tijorat belgilari yoki boshqa intellektual mulk huquqlarini buzish.',
      ],
    },
    {
      title: '4. Kontent va ma’lumotlar',
      paragraphs: [
        'Tashkilot Platformaga yuklagan xodim, davomat, vazifa, KPI va boshqa operatsion ma’lumotlar o‘sha tashkilotning javobgarligidadir. Siz faqat haqiqiy, qonuniy va vakolat doirasidagi ma’lumotlarni kiritishingiz kerak.',
        'PROOPEX Platforma dasturiy ta’minoti, dizayni, brendi va tegishli materiallarga bo‘lgan huquqlarni saqlab qoladi. Foydalanuvchiga berilgan litsenziya — cheklangan, qaytarib olinadigan va tijoriy emas (agar alohida shartnomada boshqacha ko‘rsatilmagan bo‘lsa).',
      ],
    },
    {
      title: '5. Tariflar va to‘lov',
      paragraphs: [
        'Pullik tariflar saytdagi Tariflar bo‘limida yoki alohida tijoriy taklifda ko‘rsatiladi. Narx odatda xodimlar soni va tanlangan tarifga bog‘liq bo‘lishi mumkin.',
        'To‘lov muddatlari, chegirmalar (masalan, yillik to‘lov) va maxsus kelishuvlar shartnomada yoki hisob-fakturada belgilanishi mumkin. To‘lov kechiktirilganda xizmat cheklanishi yoki to‘xtatilishi mumkin.',
      ],
    },
    {
      title: '6. Mavjudlik va o‘zgarishlar',
      paragraphs: [
        'Biz Platformani barqaror ishlashi uchun harakat qilamiz, biroq uzluksiz 100% mavjudlikni kafolatlamaymiz. Texnik xizmat, yangilanishlar yoki fors-major holatlari tufayli vaqtincha uzilishlar bo‘lishi mumkin.',
        'PROOPEX funksiyalarni yaxshilashi, o‘zgartirishi yoki ba’zi imkoniyatlarni to‘xtatishi mumkin. Muhim o‘zgarishlar haqida mumkin qadar oldindan xabar beriladi.',
      ],
    },
    {
      title: '7. Javobgarlik chegarasi',
      paragraphs: [
        'Qonun ruxsat etgan doirada PROOPEX bilvosita, tasodifiy yoki natijaviy zararlar (foyda yo‘qotilishi, ma’lumot yo‘qolishi va hokazo) uchun javobgar emas.',
        'Platforma «boricha» taqdim etiladi. Biz tijoriy moslik yoki aniq maqsadga moslik bo‘yicha ochiq yoki yashirin kafolatlarni, qonun ruxsat etgan doirada, cheklaymiz.',
      ],
    },
    {
      title: '8. Bekor qilish',
      paragraphs: [
        'Siz istalgan vaqtda Platformadan foydalanishni to‘xtatishingiz mumkin. Tashkilot admini yoki PROOPEX Shartlar buzilganda hisobni cheklashi yoki yopishi mumkin.',
        'Shartnoma muddati tugashi yoki to‘lov to‘xtashi bilan pullik funksiyalarga kirish cheklanishi mumkin. Ma’lumotlarni eksport qilish imkoniyati mavjud bo‘lsa, uni muddat ichida amalga oshirish tavsiya etiladi.',
      ],
    },
    {
      title: '9. Amaldagi qonun',
      paragraphs: [
        'Ushbu Shartlar O‘zbekiston Respublikasi qonun hujjatlariga muvofiq talqin etiladi, agar alohida yozma shartnomada boshqacha kelishilmagan bo‘lsa.',
        'Nizolarni birinchi navbatda muzokaralar orqali hal qilishga harakat qilinadi.',
      ],
    },
    {
      title: '10. Shartlarning o‘zgarishi',
      paragraphs: [
        'Biz ushbu Shartlarni yangilashimiz mumkin. Yangilangan versiya ushbu sahifada e’lon qilinadi va «Yangilangan» sanasi o‘zgartiriladi. Davom etib foydalanish yangilangan Shartlarga rozilik deb hisoblanadi.',
      ],
    },
  ],
  contactNote:
    'Savollar bo‘yicha: Platformadagi qo‘llab-quvvatlash kanallari yoki tashkilot admini orqali murojaat qiling. Maxfiylik masalalari uchun «Maxfiylik siyosati» sahifasini ham ko‘rib chiqing.',
};

export const PRIVACY_POLICY: LegalDoc = {
  slug: 'maxfiylik-siyosati',
  eyebrow: 'Huquqiy hujjat',
  title: 'Maxfiylik siyosati',
  updated: '2026-yil 27-oktabr',
  intro:
    'Ushbu Maxfiylik siyosati PROOPEX Platformasida shaxsiy va korporativ ma’lumotlar qanday yig‘ilishi, ishlatilishi, saqlanishi va himoya qilinishini tushuntiradi. Biz ma’lumotlarning maxfiyligiga jiddiy yondashamiz.',
  sections: [
    {
      title: '1. Qanday ma’lumotlar yig‘iladi',
      paragraphs: [
        'Xizmat turiga qarab quyidagi ma’lumotlar qayta ishlanishi mumkin:',
      ],
      bullets: [
        'Identifikatsiya: ism, lavozim, login, aloqa ma’lumotlari.',
        'Davomat: kelish-ketish vaqti, Face ID / barmoq / QR / GPS / qurilma orqali tasdiqlash ma’lumotlari (tashkilot sozlamasiga qarab).',
        'Ish jarayoni: vazifalar, cheklistlar, KPI, hisobotlar, chat xabarlari (agar yoqilgan bo‘lsa).',
        'Texnik: IP manzil, qurilma turi, brauzer, sessiya jurnallari, xavfsizlik voqealari.',
        'To‘lov: tarif, hisob-faktura va to‘lov holati (to‘lov provayderi orqali).',
      ],
    },
    {
      title: '2. Ma’lumotlarning maqsadi',
      paragraphs: ['Ma’lumotlar quyidagi maqsadlarda ishlatiladi:'],
      bullets: [
        'Platforma funksiyalarini taqdim etish (davomat, KPI, vazifalar va hokazo).',
        'Xavfsizlikni ta’minlash, firibgarlik va ruxsatsiz kirishni oldini olish.',
        'Texnik qo‘llab-quvvatlash va xizmat sifatini oshirish.',
        'Shartnoma, to‘lov va qonuniy majburiyatlarni bajarish.',
        'Foydalanuvchi roziligi bilan yangiliklar yoki muhim xabarnomalar yuborish.',
      ],
    },
    {
      title: '3. Biometrik va sezgir ma’lumotlar',
      paragraphs: [
        'Face ID yoki barmoq izi kabi biometrik identifikatsiya faqat tashkilot yoqgan funksiyalar doirasida va qonuniy asosda ishlatiladi. Bu ma’lumotlar odatda autentifikatsiya va davomatni tasdiqlash uchun mo‘ljallangan.',
        'Tashkilot o‘z xodimlariga biometrik funksiyalar haqida ichki tartibda xabar berishi va zarur roziliklarni olishi kerak.',
      ],
    },
    {
      title: '4. Kimga uzatilishi mumkin',
      paragraphs: [
        'Biz shaxsiy ma’lumotlarni sotmaymiz. Ma’lumotlar faqat quyidagi holatlarda uzatilishi mumkin:',
      ],
      bullets: [
        'Tashkilot ichida — vakolatli rollarga (admin, rahbar va hokazo).',
        'Xizmat ko‘rsatuvchi texnik hamkorlarga (hosting, monitoring) — shartnoma va maxfiylik majburiyatlari bilan.',
        'Qonun talabi bo‘yicha — vakolatli davlat organlariga.',
        'Biznes o‘zgarishi (birlashish, o‘tkazish) holatida — tegishli himoya choralari bilan.',
      ],
    },
    {
      title: '5. Saqlash muddati',
      paragraphs: [
        'Ma’lumotlar xizmat ko‘rsatish, shartnoma va qonuniy muddatlar uchun zarur bo‘lgan muddatda saqlanadi. Tashkilot sozlamalari yoki shartnomaga qarab ba’zi yozuvlar uzoqroq saqlanishi mumkin (masalan, audit yoki hisobot uchun).',
        'Hisob yopilganda yoki saqlash muddati tugaganda ma’lumotlar o‘chiriladi yoki anonimlashtiriladi — texnik va qonuniy imkoniyat doirasida.',
      ],
    },
    {
      title: '6. Xavfsizlik choralari',
      paragraphs: [
        'Biz ma’lumotlarni himoya qilish uchun tashkiliy va texnik choralar qo‘llaymiz: kirishni cheklash (rollar), shifrlangan ulanish (HTTPS), jurnal yuritish, yangilanishlar va monitoring.',
        'Hech bir internet tizimi 100% xavfsizlikni kafolatlamaydi. Shuning uchun kuchli parol, qurilmani himoya qilish va shubhali faoliyatni darhol xabar qilish muhim.',
      ],
    },
    {
      title: '7. Cookie va texnik fayllar',
      paragraphs: [
        'Platforma sessiya, til, mavzu (dark/light) va xavfsizlik uchun zarur cookie yoki mahalliy saqlashdan foydalanishi mumkin. Bu elementlar asosan xizmat ishlashi uchun kerak.',
      ],
    },
    {
      title: '8. Sizning huquqlaringiz',
      paragraphs: [
        'Amaldagi qonunchilik doirasida siz (yoki tashkilotingiz orqali) quyidagilarni so‘rashingiz mumkin:',
      ],
      bullets: [
        'O‘zingizga oid ma’lumotlar bilan tanishish.',
        'Noto‘g‘ri ma’lumotlarni tuzatish.',
        'Qonuniy asosda o‘chirish yoki cheklash.',
        'Ma’lumotlarning qayta ishlanishiga e’tiroz bildirish (mavjud asoslarga qarab).',
      ],
    },
    {
      title: '9. Bolalar',
      paragraphs: [
        'Platforma umumiy korporativ HR xizmati sifatida bolalarga yo‘naltirilmagan. Agar voyaga yetmagan shaxslar ma’lumotlari qayta ishlansa, bu faqat qonuniy asos va tashkilot mas’uliyati doirasida amalga oshiriladi.',
      ],
    },
    {
      title: '10. Siyosatning yangilanishi',
      paragraphs: [
        'Biz Maxfiylik siyosatini vaqti-vaqti bilan yangilashimiz mumkin. Yangi versiya ushbu sahifada e’lon qilinadi. Muhim o‘zgarishlar bo‘lsa, Platforma orqali xabar berilishi mumkin.',
      ],
    },
  ],
  contactNote:
    'Maxfiylik bo‘yicha so‘rovlar: tashkilot admini yoki PROOPEX qo‘llab-quvvatlash orqali yuboring. Foydalanish tartibi uchun «Foydalanish shartlari» sahifasini ko‘ring.',
};
