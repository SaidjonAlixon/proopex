import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  CheckSquare,
  ClipboardCheck,
  Download,
  Factory,
  FileCheck,
  FileSpreadsheet,
  Fingerprint,
  Globe2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Link2,
  ListTodo,
  MapPin,
  MessageSquare,
  Network,
  Plug,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Target,
  Truck,
  Upload,
  UserCog,
  UserPlus,
  Users,
  Video,
  Wallet,
  Workflow,
} from 'lucide-react';

/** Bitta PROOPEX sahifa — PHARMEX namunasi bo‘yicha nav */
export const NAV = [
  { id: 'bosh-sahifa', label: 'Bosh sahifa', href: '/' },
  { id: 'imkoniyatlar', label: 'Imkoniyatlar', mega: true },
  { id: 'yechimlar', label: 'Yechimlar' },
  { id: 'maqsadimiz', label: 'Maqsadimiz', href: '/maqsadimiz' },
  { id: 'tariflar', label: 'Tariflar' },
  { id: 'biz-haqimizda', label: 'Biz haqimizda', href: '/biz-haqimizda' },
] as const;

/** Landing — Biz haqimizda */
export const ABOUT = {
  eyebrow: 'Biz haqimizda',
  title: 'PROOPEX — biznesingizning yangi boshqaruv standarti',
  lead:
    'Har bir jarayon nazoratda. Har bir natija tahlilda. Har bir qaror aniq ma’lumotlarga asoslanadi.',
  storyTitle: 'Nima uchun PROOPEX?',
  story:
    'Biznes o‘sgani sari xodimlar, vazifalar va filiallarni boshqarish murakkablashadi. PROOPEX tarqoq jarayonlarni yagona raqamli muhitga birlashtiradi — kundalik ishni avtomatlashtirish va samaradorlikni oshirish uchun.',
  valuesTitle: 'Yagona platformada — muhim yo‘nalishlar',
  values: [
    {
      icon: Users,
      title: 'Xodimlar',
      text: 'Ishga qabul, moslashtirish, lavozimlar va xodimlar faoliyati.',
    },
    {
      icon: Fingerprint,
      title: 'Davomat',
      text: 'Ish jadvali, smenalar, kelish-ketish va davomat tahlili.',
    },
    {
      icon: CheckSquare,
      title: 'Vazifalar',
      text: 'Topshiriqlar, muddatlar, mas’ullar va bajarilish holati.',
    },
    {
      icon: BarChart3,
      title: 'KPI va hisobot',
      text: 'Maqsadlar, natijalar, ish haqi hisobi va biznes tahlili.',
    },
  ],
  approachTitle: 'Kimlar uchun va qanday yondashamiz?',
  approach: [
    {
      title: 'Turli sohalar',
      text: 'Savdo, xizmat, ishlab chiqarish va ko‘p filialli tashkilotlar uchun moslashuvchan.',
    },
    {
      title: 'Aniq boshqaruv',
      text: 'Har rol o‘z vakolatida ishlaydi; rahbar jarayon va natijani kuzatadi.',
    },
    {
      title: 'Rivojlanish asosi',
      text: 'Texnologiya — tartib, shaffoflik va aniq qarorlar uchun mustahkam zamin.',
    },
  ],
  closingTitle: 'PROOPEX — raqamli boshqaruv muhiti',
  closingText:
    'Bu shunchaki dastur emas. Bugungi faoliyatni tartibga solish va ertangi rivojlanishni rejalashtirish uchun yaratilgan yagona boshqaruv standarti.',
  founder: {
    photo: 'said.png',
    name: 'Saidmuhammadalixon Ataullayev',
    role: 'PROOPEX asoschisi va texnologik yechimlar yaratuvchisi',
    company: 'PROOPEX',
    alsoFounder: 'Saydx asoschisi',
    captionNote: 'PROOPEX va Saydx — asoschi',
    quote:
      'Men texnologiyani shunchaki dastur yaratish vositasi emas, balki murakkab muammolarni sodda yechimlarga aylantirish imkoniyati deb bilaman.',
    paragraphs: [
      'Men — Saidmuhammadalixon Ataullayev, biznes jarayonlarini raqamlashtirish, sun’iy intellekt va zamonaviy texnologiyalar orqali boshqaruv tizimlarini takomillashtirishga intiluvchi texnologik loyiha yaratuvchisiman.',
      'PROOPEX loyihasini yaratishdan asosiy maqsadim — biznesdagi tarqoq jarayonlarni yagona tizimga birlashtirish, ortiqcha qo‘l mehnatini kamaytirish va boshqaruvni aniq, shaffof hamda samarali qilishga yordam beradigan platforma yaratish.',
      'Menimcha, zamonaviy biznes faqat ko‘proq ishlash bilan emas, balki jarayonlarni to‘g‘ri tashkil etish, ma’lumotlardan oqilona foydalanish va vaqtni qadrlash orqali rivojlanadi.',
      'Shu sababli PROOPEX doirasida xodimlarni boshqarish, davomat, vazifalar, KPI, hisob-kitoblar, filiallar faoliyati va boshqa biznes jarayonlarini yagona raqamli muhitda birlashtirish ustida ishlayapman. Platformani turli sohalardagi korxonalar uchun tushunarli, moslashuvchan va rivojlantirish mumkin bo‘lgan yechimga aylantirishni maqsad qilganman.',
    ],
    approachTitle: 'Mening yondashuvim',
    approach: [
      {
        title: 'Muammoni tushunish',
        text: 'Har qanday texnologik yechim real ehtiyojdan boshlanishi kerak.',
      },
      {
        title: 'Soddalikni ta’minlash',
        text: 'Murakkab texnologiyalar foydalanuvchi uchun qulay va tushunarli bo‘lishi lozim.',
      },
      {
        title: 'Tizimli fikrlash',
        text: 'Alohida vazifalarni emas, bir-biri bilan bog‘langan jarayonlarni yaxlit holda ko‘rib chiqish kerak.',
      },
      {
        title: 'Doimiy rivojlanish',
        text: 'Har bir yangi imkoniyat amaliy qiymat yaratishi va platformani yanada takomillashtirishi kerak.',
      },
    ],
    visionTitle: 'Mening qarashim',
    vision:
      'Men kelajakda kompaniyalar turli dasturlar, jadvallar va alohida vositalar o‘rtasida vaqt yo‘qotmaydigan, barcha muhim jarayonlarini yagona raqamli muhitda boshqara oladigan tizimlar keng tarqalishiga ishonaman. PROOPEX — ana shu qarashni amalga oshirish yo‘lidagi loyiham.',
    goal:
      'Maqsadim — shunchaki dastur yaratish emas. Bizneslar uchun haqiqiy qiymat beradigan, kundalik ishni yengillashtiradigan va rivojlanish uchun yangi imkoniyatlar ochadigan texnologiyalar yaratish.',
  },
  teamTitle: 'Platforma dasturchilari',
  team: [
    {
      id: 'firdavs',
      photo: 'firdavs.jpg',
      badge: 'Dasturlash',
      name: 'Saydirasulov Firdavs',
      role: 'Full-Stack Developer · PROOPEX platforma dasturchisi',
      quote:
        'Kodni san’at darajasiga ko‘tarish — bu nafaqat ishlaydigan dastur yozish, balki foydalanuvchi va biznes uchun tushunarli, barqaror va chiroyli yechim yaratishdir.',
      paragraphs: [
        'Men — Saydirasulov Firdavs, PROOPEX platformasining full-stack dasturchisiman. Frontend interfeys, backend logikasi va tizimlar o‘rtasidagi bog‘lanishlarni bir butun sifatida ko‘rib chiqaman.',
        'Mening vazifam — innovatsion g‘oyalarni professional darajada kodga ko‘chirish: mukammal foydalanuvchi tajribasi, barqaror backend va xavfsiz API uyg‘unligini ta’minlash.',
        'Har bir modul — davomat, vazifalar, KPI yoki integratsiya — yuqori yuklama va real biznes sharoitida ishonchli ishlashi kerak. Shu sababli arxitektura, testlar va optimallashtirishga alohida e’tibor beraman.',
        'PROOPEX da men texnik yechimlarni sodda, kengaytiriladigan va jamoa uchun qulay qilib qurishga intilaman — shunda platforma o‘sib borsada, sifat va tezlik saqlanib qoladi.',
      ],
      approachTitle: 'Mening yondashuvim',
      approach: [
        {
          title: 'Sifat ustuvor',
          text: 'Ishlaydigan kod yetarli emas — o‘qiladigan, test qilinadigan va uzoq muddat xizmat qiladigan kod kerak.',
        },
        {
          title: 'Foydalanuvchi markazda',
          text: 'Interfeys chiroyli bo‘lishi bilan birga tez, tushunarli va xatosiz ishlashi shart.',
        },
        {
          title: 'Xavfsizlik asos',
          text: 'API, autentifikatsiya va ma’lumotlar oqimi — himoya qatlamlari bilan loyihalanadi.',
        },
        {
          title: 'Kengayishga tayyor',
          text: 'Modulli arxitektura yangi imkoniyatlarni tez qo‘shishga yo‘l ochadi.',
        },
      ],
      dutiesTitle: 'Mas’uliyatlar',
      duties: [
        'Yuqori yuklamali tizimlarni optimallashtirish',
        'API integratsiyasi va xavfsizlik protokollarini amalga oshirish',
        'Modulli va test qilinadigan frontend arxitekturasini yaratish',
        'Backend xizmatlari, ma’lumotlar oqimi va xatoliklarni barqaror boshqarish',
        'Asoschi bilan birgalikda yangi modullarni ishlab chiqish va ishga tushirish',
      ],
      visionTitle: 'Mening qarashim',
      vision:
        'Yaxshi dastur — ko‘rinmas mehnat. Foydalanuvchi uchun hammasi sodda; orqada esa aniq arxitektura, xavfsizlik va tezlik turadi. PROOPEX shu prinsip asosida rivojlanadi.',
      goal:
        'Maqsadim — biznes ehtiyojlarini texnik jihatdan puxta, chiroyli va ishonchli platformaga aylantirish: har bir qator kod qiymat bersin.',
    },
  ],
} as const;

/** Landing — Maqsadimiz (faqat shu bo‘lim) */
export const MISSION = {
  eyebrow: 'Bizning maqsadimiz',
  title: 'Har bir biznes uchun ochiq, aniq va ishonchli boshqaruv',
  lead:
    'PROOPEX — xodimlar, vazifalar, davomat, KPI, hisob-kitoblar va operatsion jarayonlarni yagona raqamli muhitda birlashtirishga yo‘naltirilgan platforma. Maqsadimiz — biznesni boshqarishni soddalashtirish, takroriy ishlarni kamaytirish va har bir muhim natijani tushunarli qilish.',
  pillars: [
    {
      icon: Layers,
      title: 'Yagona tizim',
      text: 'Ma’lumotlar va jarayonlarni bir joyda tashkil etish — tarqoq fayllarsiz.',
    },
    {
      icon: Target,
      title: 'Aniq natija',
      text: 'Vazifalar va ko‘rsatkichlarni kuzatish — hisobot taxmin emas.',
    },
    {
      icon: ShieldCheck,
      title: 'Ishonchli nazorat',
      text: 'Rollar, ruxsatlar va audit mexanizmlari — kim nima qilgani aniq.',
    },
    {
      icon: Sparkles,
      title: 'Doimiy rivojlanish',
      text: 'Biznes ehtiyojlariga mos kengayish — yangi modullar qo‘shilib boradi.',
    },
  ],
  compareTitle: 'Tarqoq jarayonlardan yagona boshqaruvga',
  traditional: {
    title: 'An’anaviy boshqaruv',
    items: [
      'Ma’lumotlar turli fayl va tizimlarda saqlanadi',
      'Hisobotlar qo‘lda tayyorlanadi',
      'Vazifalar turli aloqa kanallarida tarqaladi',
      'Filiallarni taqqoslash qiyinlashadi',
      'Rahbar ma’lumot yig‘ishga ko‘p vaqt sarflaydi',
    ],
  },
  modern: {
    title: 'PROOPEX yondashuvi',
    items: [
      'Ma’lumotlar yagona muhitda tashkil etiladi',
      'Hisobotlar tizimlashtiriladi',
      'Vazifalar mas’ul va muddat bilan birikadi',
      'Filiallar umumiy ko‘rsatkichlarda ko‘rinadi',
      'Qaror qabul qilish osonlashadi',
    ],
  },
  modulesTitle: 'Biznesning muhim jarayonlari — yagona platformada',
  modules: [
    {
      icon: Users,
      title: 'HR va xodimlar',
      text: 'Xodimlar bazasi, lavozimlar va tashkiliy tuzilma — bitta manba.',
    },
    {
      icon: UserPlus,
      title: 'Ishga qabul',
      text: 'Vakansiya, nomzod, suhbat va tanlov bosqichlari bir oqimda.',
    },
    {
      icon: Fingerprint,
      title: 'Davomat va smenalar',
      text: 'Face ID, QR, GPS — ish vaqtini ishonchli qayd etish.',
    },
    {
      icon: CheckSquare,
      title: 'Vazifalar va checklist',
      text: 'Topshiriq, muddat va bajarilish nazorati — KPI bilan bog‘liq.',
    },
    {
      icon: BarChart3,
      title: 'KPI va samaradorlik',
      text: 'Reja, natija va ish ko‘rsatkichlari shaffof hisoblanadi.',
    },
    {
      icon: Wallet,
      title: 'Ish haqi va hisob-kitob',
      text: 'Asosiy ish haqi, bonus va filial kesimidagi hisob-kitoblar.',
    },
    {
      icon: Building2,
      title: 'Filiallar va operatsiyalar',
      text: 'Hududiy bo‘linmalar va kundalik jarayonlar yagona panelda.',
    },
    {
      icon: FileCheck,
      title: 'Ariza yoki tushuntirish xatlari',
      text: 'Kechikish yoki kelmaslikda izoh beriladi; ariza elektron tasdiqlanadi va haqiqiy deb tan olinadi.',
    },
    {
      icon: Truck,
      title: 'Logistika va transport',
      text: 'Marshrut, transport va jonli GPS monitoring.',
    },
    {
      icon: ShieldCheck,
      title: 'Xavfsizlik va audit',
      text: 'Rollar, qurilmalar, sessiyalar va harakatlar jurnali.',
    },
    {
      icon: Brain,
      title: 'AI va tahlil',
      text: 'Yordamchi AI va ma’lumotlarni tushunarli tahlil qilish.',
    },
    {
      icon: Plug,
      title: 'Integratsiyalar',
      text: 'Excel, Telegram, API va tashqi tizimlar bilan almashinuv.',
    },
  ],
  flowTitle: 'Ishga qabuldan natijagacha — yagona ish oqimi',
  flow: [
    { icon: Users, title: 'Nomzod', text: 'Ariza va tanlov' },
    { icon: UserPlus, title: 'Qabul', text: 'Offer va hujjat' },
    { icon: GraduationCap, title: 'Onboarding', text: 'Moslashuv vazifalari' },
    { icon: Fingerprint, title: 'Davomat', text: 'Kelish / ketish' },
    { icon: CheckSquare, title: 'Vazifalar', text: 'Ijro va tasdiq' },
    { icon: BarChart3, title: 'KPI', text: 'Oylik baho' },
    { icon: Wallet, title: 'Hisob-kitob', text: 'Ish haqi / bonus' },
    { icon: ArrowLeftRight, title: 'Offboarding', text: 'Chiqish jarayoni' },
  ],
  sectorsTitle: 'Turli sohalar uchun moslashuvchan yechim',
  sectors: [
    {
      icon: Store,
      title: 'Savdo va chakana',
      text: 'Do‘konlar tarmog‘i: smena, checklist tashrif va savdo reja KPI.',
    },
    {
      icon: Building2,
      title: 'Dorixona va xizmat',
      text: 'Filial holati, GPS audit, kadr ehtiyoji va oylik tasdiq.',
    },
    {
      icon: Factory,
      title: 'Ishlab chiqarish',
      text: 'Smena, sifat checklisti, sex bo‘yicha vazifa va KPI.',
    },
    {
      icon: Truck,
      title: 'Logistika va transport',
      text: 'Dispetcher, marshrut, jonli GPS va haydovchi davomati.',
    },
    {
      icon: Briefcase,
      title: 'Ofis va xizmatlar',
      text: 'HR, vazifa, chat, KPI — professional ofis jamoalari uchun.',
    },
    {
      icon: Network,
      title: 'Yirik korxona / holding',
      text: 'Ko‘p filial, rollar, brend va Maxsus tarifda kengayish.',
    },
  ],
  audienceTitle: 'Kim uchun qanday qiymat?',
  audiences: [
    {
      icon: UserCog,
      title: 'Rahbar uchun',
      items: [
        'Umumiy biznes holatini ko‘rish',
        'Filial va bo‘limlarni taqqoslash',
        'Muammoli jarayonlarni aniqlash',
        'Qaror uchun zarur ma’lumotlarni olish',
      ],
    },
    {
      icon: Users,
      title: 'HR uchun',
      items: [
        'Xodimlar bazasini boshqarish',
        'Ishga qabul va moslashtirish',
        'Davomat va KPI jarayonlari',
        'Takroriy ma’muriy ishlarni kamaytirish',
      ],
    },
    {
      icon: LayoutDashboard,
      title: 'Xodim uchun',
      items: [
        'Shaxsiy vazifa va muddatlar',
        'Ish jadvali va davomat',
        'O‘z natijalarini kuzatish',
        'So‘rov / arizani tartibda yuborish',
      ],
    },
  ],
  futureTitle: 'Bugungi jarayonlar. Aqlliroq boshqaruv. Yangi imkoniyatlar.',
  futureReady: [
    { title: 'Yordamchi AI', text: 'Platformada matn va navigatsiya yordami (sozlangan bo‘lsa).' },
    { title: 'Hisobotlar', text: 'Davomat, KPI, reyting — Excel/PDF eksporti.' },
    { title: 'Integratsiyalar', text: 'Telegram, API, web va Mini App — bitta baza.' },
  ],
  futureBuilding: [
    { title: 'Chuqurroq tahlil', text: 'Hisobotlarni izohlash va muammo nuqtalarini aniqlash.' },
    { title: 'Avtomatlashtirish', text: 'Takroriy jarayonlarni aqlliroq bog‘lash.' },
    { title: 'Korporativ kengayish', text: 'Holding, white-label va tashqi ERP integratsiyalari.' },
  ],
  closingTitle: 'Biznesni boshqarish osonroq bo‘lishi kerak.',
  closingText:
    'Biz PROOPEX orqali kompaniyalarga jarayonlarni tartibga solish, ma’lumotlarni birlashtirish va natijalarni yaxshiroq tushunish imkonini beradigan raqamli muhit yaratishga intilamiz. Maqsadimiz — kundalik boshqaruvni soddalashtirish va rivojlanish uchun mustahkam texnologik asos yaratish.',
  closingLine: 'Barcha jarayonlar bir tizimda. Har bir vazifa tushunarli. Har bir natija ko‘rinadigan.',
} as const;

/** Vazifa / topshiriq / eslatma — platformadagi real imkoniyatlar */
export const TASK_CAPABILITIES = [
  {
    icon: ListTodo,
    title: 'Vazifa belgilash',
    text: 'Sarlavha, tavsif, muddat, ustuvorlik, fayl — bitta forma. Yuborilgach ijrochi «olingan» ro‘yxatida ko‘radi.',
  },
  {
    icon: UserPlus,
    title: 'Bir yoki bir nechta xodim',
    text: 'Bitta odamga yoki guruhga biriktirasiz: mudir, HR, koordinator, smena. Har kim o‘z holatini alohida yuritadi.',
  },
  {
    icon: CheckSquare,
    title: 'Bajarish va tekshirish',
    text: 'Ijrochi «bajarildi» deb topshiradi; rahbar tasdiqlaydi yoki qaytaradi. Tasdiq KPI dagi topshiriq ulushiga kiradi.',
  },
  {
    icon: Bell,
    title: 'Eslatma va muddat',
    text: 'Shaxsiy eslatma, muddat oldidan ogohlantirish, Telegram bot (sozlangan bo‘lsa). Ish unutilmaydi.',
  },
] as const;

export type NavId = (typeof NAV)[number]['id'];

export type MegaItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tone: 'cyan' | 'violet' | 'magenta' | 'azure' | 'emerald' | 'amber' | 'rose' | 'indigo';
};

/** Mega-menyudagi platforma modullari — PLATFORM.md asosida */
export const MEGA_FEATURE = {
  badge: '16 modul',
  title: 'Xodimlar ishining to‘liq sikli',
  text: 'Arizadan stajgacha, Face/barmoq davomatdan oylik KPI va filial hisob-kitobigacha — bitta PROOPEX oqimida. Qo‘shimcha yangi modullar ham qo‘shib borilmoqda ayni vaqtda.',
  cta: 'Barcha imkoniyatlar',
  href: '#imkoniyatlar',
} as const;

/**
 * Bitta ro‘yxat — takrorlanmas.
 * Mega-menyu va Imkoniyatlar bo‘limi shu manbadan.
 * Manba: PLATFORM.md (har modul bir marta).
 */
export const MEGA_MODULES: MegaItem[] = [
  {
    icon: LayoutDashboard,
    title: 'Boshqaruv paneli',
    desc: 'Har rolga mos kartochkalar: ariza, nomzod, vazifa, chat, holat, moliya — tezkor o‘tish',
    tone: 'cyan',
  },
  {
    icon: Workflow,
    title: 'Arizalar va vakansiyalar',
    desc: 'Filial/bo‘limdan kadr ehtiyoji → tasdiq → e’lon, kanal, muddat va nashr',
    tone: 'violet',
  },
  {
    icon: Users,
    title: 'Nomzodlar va pipeline',
    desc: 'Anketa → suhbat → preboarding → offer → staj; kanban bosqichlari va to‘liq tarix',
    tone: 'magenta',
  },
  {
    icon: Fingerprint,
    title: 'Davomat: Face, barmoq, QR',
    desc: 'GPS yashil hudud, yuz yoki barmoq izi, QR, kechikish, kunlik jurnal, masofaviy belgilash, Excel',
    tone: 'azure',
  },
  {
    icon: ClipboardCheck,
    title: 'Cheklist va reyting',
    desc: 'Filial tashrifi (~50 m GPS), savollar, ball, qamrov, koordinator reytingi, Excel',
    tone: 'emerald',
  },
  {
    icon: Wallet,
    title: 'Oylik KPI',
    desc: 'Jami = fiks + bonus; og‘irliklar: davomat / topshiriq / checklist — sozlanadi, qayta hisob, Excel',
    tone: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Filial hisob-kitob',
    desc: 'Savdo %, fiksa, reja, avans, jarima; filial varaqasi, tasdiq va Excel (ANTEY uslubi)',
    tone: 'violet',
  },
  {
    icon: ListTodo,
    title: 'Vazifalar (topshiriqlar)',
    desc: 'Bir yoki bir nechta xodimga vazifa, muddat, tasdiq/qaytarish; KPI dagi topshiriq ulushi shu yerdan',
    tone: 'indigo',
  },
  {
    icon: MessageSquare,
    title: 'Chat',
    desc: 'Xodimlar suhbatlari, fayl yuborish, o‘qilmagan soni',
    tone: 'cyan',
  },
  {
    icon: Bell,
    title: 'Eslatmalar',
    desc: 'Shaxsiy muddatli eslatma; Telegram bot orqali ogohlantirish (sozlangan bo‘lsa)',
    tone: 'rose',
  },
  {
    icon: Building2,
    title: 'Filiallar va ehtiyoj',
    desc: 'Apteka tarmog‘i, mudir/smena/GPS/holat; filialdan kadr yoki tovar so‘rovi',
    tone: 'azure',
  },
  {
    icon: GraduationCap,
    title: 'Kirish o‘quvi va staj',
    desc: 'Video/PDF, test, stajirovka bahosi, trener; materiallarni admin yuklaydi',
    tone: 'violet',
  },
  {
    icon: Network,
    title: 'Tashkiliy tuzilma',
    desc: 'Bo‘lim, lavozim, bo‘ysunish zanjiri — menyu va huquqlar shunga bog‘lanadi',
    tone: 'magenta',
  },
  {
    icon: Video,
    title: 'Konferensiya',
    desc: 'Video suhbat va yozuv — jamoa uchrashuvlari uchun',
    tone: 'indigo',
  },
  {
    icon: FileSpreadsheet,
    title: 'Hisobotlar va eksport',
    desc: 'Davomat, KPI, reyting, hisob-kitob — jadvalga chiqarish (Excel/PDF)',
    tone: 'emerald',
  },
  {
    icon: ShieldCheck,
    title: 'Admin va xavfsizlik',
    desc: 'Foydalanuvchi, qurilma gate, Face ID markazi (yuz/barmoq vektorlari), brend sozlamalari',
    tone: 'rose',
  },
];

/** @deprecated — Imkoniyatlar faqat MEGA_MODULES; takror yo‘q */
export const FEATURES = [] as const;

export type SolutionCard = {
  title: string;
  text: string;
  items: string[];
};

export type SolutionSector = {
  id: string;
  label: string;
  blurb: string;
  roles: SolutionCard[];
};

/**
 * Soha bo‘yicha yechimlar — har biri boshqa rollar/vazifalar.
 * Dorixona = PLATFORM.md; qolganlari PROOPEX modullarini sohaga moslab.
 */
export const SOLUTION_SECTORS: SolutionSector[] = [
  {
    id: 'dorixona',
    label: 'Dorixona',
    blurb: 'Apteka tarmog‘i: filial, farmasevt, mudir, cheklist auditori — PLATFORM.md rollari.',
    roles: [
      {
        title: 'Direktor / egasi',
        text: 'Butun dorixona tarmog‘i: ariza–pipeline–staj, davomat, cheklist holati, oylik KPI, filial hisob-kitob tasdiqi, topshiriq va chat.',
        items: ['Tarmoq holati', 'Hisob-kitob tasdiqi', 'KPI og‘irliklari', 'Davomat + Face/barmoq', 'Excel/PDF'],
      },
      {
        title: 'HR / rekruter',
        text: 'Farmasevt va mudir qabulidan stajgacha: vakansiya, pipeline, suhbat, offer, staj bahosi.',
        items: ['Ariza ↔ vakansiya', 'Kanban pipeline', 'Suhbatlar', 'Staj', 'Davomat jurnal'],
      },
      {
        title: 'Moliyachi',
        text: 'Filial savdo % + fiksa + reja; oylik = fiks + bonus (davomat/topshiriq/checklist).',
        items: ['Oylik KPI', 'Filial hisob-kitob', 'Qayta hisob', 'Excel'],
      },
      {
        title: 'Mudir',
        text: 'O‘z dorixonasi: smena, ehtiyoj, Face davomat, vazifa, chat. Cheklistni koordinator yozadi.',
        items: ['Filial jamoasi', 'Ehtiyoj', 'Face davomat', 'Vazifalar'],
      },
      {
        title: 'Koordinator',
        text: 'GPS (~50 m) cheklist tashrifi, ball, reyting — KPI checklist ulushi.',
        items: ['GPS tashrif', 'Ball / reyting', 'Qamrov', 'Hisobot'],
      },
      {
        title: 'Farmasevt / stajyor',
        text: 'Face/barmoq/QR davomat, vazifa, ehtiyoj, kirish o‘quvi, shaxsiy KPI.',
        items: ['Davomat', 'Vazifalar', 'Ehtiyoj', 'O‘quv / KPI'],
      },
    ],
  },
  {
    id: 'zavod',
    label: 'Ishlab chiqarish',
    blurb: 'Sex, smena, sifat nazorati: usta, texnolog, sifat auditori — boshqa ritm, shu platforma.',
    roles: [
      {
        title: 'Zavod direktori',
        text: 'Sexlar bo‘yicha smena KPI, sifat checklisti, xavfsizlik auditlari, kadr ehtiyoji va oylik tasdiq.',
        items: ['Smena KPI', 'Sifat hisoboti', 'Kadr ehtiyoji', 'Hisob-kitob tasdiqi', 'Eksport'],
      },
      {
        title: 'HR / kadrlar',
        text: 'Ishchi va usta qabuli, staj/trener, smena bo‘yicha nomzod pipeline, o‘quv materiallari.',
        items: ['Vakansiya (sex)', 'Pipeline', 'Staj / trener', 'Kirish o‘quvi', 'Davomat jurnal'],
      },
      {
        title: 'Sex boshlig‘i',
        text: 'Smena jamoasi, Face/barmoq kirish-chiqish, topshiriqlar, ehtiyoj (material/kadr).',
        items: ['Smena jamoasi', 'Davomat', 'Vazifalar', 'Ehtiyoj so‘rovi'],
      },
      {
        title: 'Sifat / auditor',
        text: 'Sexga GPS yoki hudud checklist: savollar, foto, ball — sifat KPI ulushi.',
        items: ['Sifat checklist', 'Ball', 'Reyting', 'Excel'],
      },
      {
        title: 'Usta / operator',
        text: 'Smena Face/barmoq, berilgan vazifalar, eslatma, shaxsiy KPI (davomat + topshiriq).',
        items: ['Smena belgilash', 'Vazifalar', 'Eslatma', 'Shaxsiy KPI'],
      },
      {
        title: 'Ombor / texnik',
        text: 'Material ehtiyoji, topshiriq, chat, Face — to‘liq rekruting paneli shart emas.',
        items: ['Ehtiyoj', 'Topshiriq', 'Chat', 'Face'],
      },
    ],
  },
  {
    id: 'yetkazish',
    label: 'Yetkazib berish',
    blurb: 'Logistika: ekspeditor, ombor, dispetcher — marshrut, GPS, muddatli vazifa.',
    roles: [
      {
        title: 'Logistika rahbari',
        text: 'Park / ombor tarmog‘i, yetkazuvchi KPI, kechikish hisoboti, hisob-kitob tasdiqi.',
        items: ['Tarmoq holati', 'Yetkazuv KPI', 'Kechikish', 'Tasdiq', 'Excel'],
      },
      {
        title: 'Dispetcher',
        text: 'Marshrut vazifalari (bir/bir nechta haydovchi), muddat, eslatma, chat.',
        items: ['Vazifa biriktirish', 'Muddat', 'Eslatma', 'Chat', 'Holat'],
      },
      {
        title: 'Ombor mudiri',
        text: 'Yuklash checklisti, ehtiyoj, Face/barmoq hududda, jamoa davomati.',
        items: ['Yuklash checklist', 'Ehtiyoj', 'Davomat', 'Jamoa'],
      },
      {
        title: 'Haydovchi / ekspeditor',
        text: 'GPS hududda belgilash, marshrut vazifasi, foto/fayl, shaxsiy KPI.',
        items: ['GPS + Face/QR', 'Marshrut vazifa', 'Fayl/foto', 'KPI'],
      },
      {
        title: 'HR / moliya',
        text: 'Haydovchi qabuli, oylik (davomat + topshiriq), yoqilg‘i/jarima hisobi eksport.',
        items: ['Rekruting', 'Oylik KPI', 'Jarima/avans', 'Excel'],
      },
      {
        title: 'Mijoz xizmati',
        text: 'Eslatma, chat, kechikkan yetkazuvlar bo‘yicha vazifa kuzatuvi.',
        items: ['Eslatma', 'Chat', 'Vazifa kuzatuvi', 'Hisobot'],
      },
    ],
  },
  {
    id: 'savdo',
    label: 'Savdo / do‘kon',
    blurb: 'Retail zanjir: do‘kon mudiri, sotuvchi, merchandiser — savdo reja va tashrif.',
    roles: [
      {
        title: 'Tarmoq egasi',
        text: 'Do‘konlar holati, savdo reja KPI, hisob-kitob, kadr va topshiriq nazorati.',
        items: ['Do‘konlar xaritasi', 'Savdo reja', 'Hisob-kitob', 'KPI', 'Eksport'],
      },
      {
        title: 'Do‘kon mudiri',
        text: 'Smena, Face davomat, ehtiyoj, vazifa, chat — o‘z do‘konida.',
        items: ['Smena', 'Davomat', 'Ehtiyoj', 'Vazifalar'],
      },
      {
        title: 'Merchandiser',
        text: 'Do‘konga GPS tashrif checklisti (stellaj, narx, foto), reyting.',
        items: ['GPS tashrif', 'Checklist', 'Foto', 'Reyting'],
      },
      {
        title: 'Sotuvchi',
        text: 'Kirish/chiqish Face yoki QR, kunlik vazifa, shaxsiy savdo KPI.',
        items: ['Davomat', 'Vazifa', 'Shaxsiy KPI', 'Chat'],
      },
      {
        title: 'HR / rekruter',
        text: 'Sotuvchi va mudir qabuli, o‘quv, staj, pipeline.',
        items: ['Vakansiya', 'Pipeline', 'O‘quv', 'Staj'],
      },
      {
        title: 'Moliya',
        text: 'Do‘kon hisob-kitobi, avans/jarima, oylik qayta hisob.',
        items: ['Hisob-kitob', 'Oylik', 'Avans/jarima', 'Excel'],
      },
    ],
  },
  {
    id: 'klinika',
    label: 'Klinika / xizmat',
    blurb: 'Tibbiyot yoki xizmat ofisi: registratura, shifokor/mutaxassis, nazoratchi — boshqa soha, shu modullar.',
    roles: [
      {
        title: 'Klinik rahbar',
        text: 'Filiallar (klinikalar), navbatchilik KPI, sifat audit, hisob-kitob tasdiqi.',
        items: ['Filial holati', 'Sifat audit', 'KPI', 'Tasdiq', 'Eksport'],
      },
      {
        title: 'HR',
        text: 'Shifokor/hamshira qabuli, litsenziya/staj o‘quvi, pipeline.',
        items: ['Vakansiya', 'Pipeline', 'Kirish o‘quvi', 'Staj'],
      },
      {
        title: 'Registratura / ofis',
        text: 'Face/barmoq kirish, navbatchilik vazifasi, eslatma, chat.',
        items: ['Davomat', 'Vazifa', 'Eslatma', 'Chat'],
      },
      {
        title: 'Nazoratchi',
        text: 'Kabinet/hudud checklist (tozalik, jihoz), GPS ixtiyoriy, ball.',
        items: ['Checklist', 'Ball', 'Reyting', 'Hisobot'],
      },
      {
        title: 'Mutaxassis',
        text: 'Shaxsiy grafik davomati, topshiriq, o‘quv, shaxsiy KPI.',
        items: ['Davomat', 'Topshiriq', 'O‘quv', 'KPI'],
      },
      {
        title: 'Admin',
        text: 'Foydalanuvchi, qurilma gate, Face markazi, brend, Yordamchi AI.',
        items: ['Rollar', 'Face markazi', 'Qurilma', 'AI sozlama'],
      },
    ],
  },
];

/** @deprecated — eski importlar uchun; dorixona sektori */
export const SOLUTIONS = SOLUTION_SECTORS[0].roles;

/** AI agentlar — platformadagi yordamchi vazifalar */
export const AI_AGENTS: {
  title: string;
  text: string;
  items: string[];
  badge?: string;
}[] = [
  {
    title: 'Ishchi AI agent',
    badge: 'Premium',
    text: 'Premium tarif: odam o‘rniga platformadagi ishlarni bajaradi — topshiriqni og‘zaki yoki yozma qabul qiladi, farqi yo‘q. Bir necha rol vazifasini parallel qiladi; odamdan ko‘p ish hajmini ushlab turadi. Muhim tasdiqlar (hisob-kitob, KPI og‘irlik) — rahbar nazoratida.',
    items: ['Og‘zaki yoki yozma topshiriq', 'Odam o‘rniga bajaradi', 'Parallel ish oqimi', 'Faqat Premium'],
  },
  {
    title: 'Yordamchi AI (chat)',
    text: 'Premium / sozlangan muhitda: platforma bo‘yicha savol-javob, bo‘limlarni topish, qisqa ko‘rsatmalar. Admin «Yordamchi AI» bo‘limidan boshqaradi.',
    items: ['Savol-javob', 'Bo‘lim yo‘naltirish', 'Qisqa ko‘rsatma', 'Admin sozlamasi'],
  },
  {
    title: 'Vazifa matn yordamchisi',
    text: 'Topshiriq yaratishda AI tugmasi: sarlavha/tavsifni aniqroq yozish, formatlash. Mas’ul xodim va muddat — odam tanlaydi; AI faqat matnga yordam beradi.',
    items: ['Sarlavha taklifi', 'Tavsifni tozalash', 'Format (bold/list)', 'Inson tasdiqlaydi'],
  },
  {
    title: 'Eslatma va bot oqimi',
    text: 'Telegram Mini App va eslatma botlari: muddat oldidan ogohlantirish, filial lokatsiya. AI emas — avtomatik qoida; Yordamchi AI bilan birga ish ritmini ushlab turadi.',
    items: ['Muddat eslatmasi', 'Telegram ogohlantirish', 'Mini App kirish', 'Filial botlari'],
  },
];

/** Qanday ishlaydi — bosqichlar + batafsil */
export const STEPS = [
  {
    n: '01',
    title: 'Kirish',
    text: 'Login/parol yoki Face ID (HTTPS). Yangi telefon — admin tasdig‘isiz kirmaydi (device gate). Telegram Mini App ham ochiladi.',
  },
  {
    n: '02',
    title: 'Rolga mos panel',
    text: 'Direktor, HR, moliya, mudir, koordinator, xodim — har kim o‘z menyusi va huquqlarini ko‘radi.',
  },
  {
    n: '03',
    title: 'Kundalik ritm',
    text: 'Davomat (Face/QR/GPS), cheklist tashrif, chat, vazifa muddati, rekruting qadamlari — hammasi bitta joyda.',
  },
  {
    n: '04',
    title: 'KPI va hisobot',
    text: 'Oylik avtomatik: davomat + topshiriq + checklist. Filial hisob-kitob tasdiqlanadi; Excel/PDF chiqadi.',
  },
] as const;

export const HOW_DETAILS = [
  {
    title: 'Davomat qanday?',
    text: 'Xodim ruxsat etilgan GPS hududda Face ID yoki barmoq izi bilan kelish/ketishni belgilaydi. Kechikish KPI ga ta’sir qiladi. QR va masofaviy belgilash ham bor.',
  },
  {
    title: 'Vazifa KPI ga qanday kiradi?',
    text: 'Berilgan topshiriq bajariladi va tasdiqlanadi. Oylikda «topshiriq» ulushi shu holatlardan hisoblanadi (standart ~30%, sozlanadi).',
  },
  {
    title: 'Cheklist nima beradi?',
    text: 'Koordinator filialga tashrif qiladi (GPS). Ballar reyting va oylik «checklist» ulushiga qo‘shiladi.',
  },
  {
    title: 'Hisob-kitob formulasi',
    text: 'Oylik % = shaxsiy savdo × protsent. Jami = oylik % + fiksa + reja bonusi − avans/jarima. Karta ≈ jami; gross ≈ karta / 0.88.',
  },
] as const;

/** Web/Telegram kanallari */
export const INTEGRATIONS = [
  {
    icon: Smartphone,
    title: 'Telegram Mini App',
    text: 'Bot orqali ochiladi; web bilan bir vaqtda, bir xil bazadan.',
  },
  { icon: ScanFace, title: 'Face ID / kamera', text: 'Login va davomat — brauzer kamerasi, HTTPS majburiy.' },
  { icon: MapPin, title: 'GPS hudud', text: 'Davomat va cheklist faqat ruxsat etilgan joyda.' },
  { icon: ArrowLeftRight, title: 'Excel / eksport', text: 'Davomat, KPI, reyting, hisob-kitob — jadvalga chiqarish.' },
  {
    icon: BookOpen,
    title: 'PWA / brauzer',
    text: 'Telefon va kompyuterda; Mini App bilan parallel, bitta ma’lumot.',
  },
  { icon: Sparkles, title: 'AI yordamchi', text: 'Sozlangan bo‘lsa — yordam chat (Premium).' },
] as const;

/**
 * Boshqa platforma / dastur / sayt bilan ulanish — oddiy, alohida kartalar
 */
export const INTEGRATION_BRIDGES: {
  icon: LucideIcon;
  title: string;
  text: string;
  points: string[];
}[] = [
  {
    icon: Download,
    title: 'Boshqa dasturdan ma’lumot olish',
    text: 'Boshqa platforma yoki dasturdagi ma’lumotni PROOPEX ga olib kelib, mustaqil ishlashingiz mumkin.',
    points: [
      'Xodimlar, davomat, savdo yoki hisobot fayllari',
      'Excel / CSV orqali yoki ulanish orqali',
      'Olingan ma’lumot — o‘z panellingizda',
    ],
  },
  {
    icon: Upload,
    title: 'PROOPEX dan boshqa dasturga',
    text: 'Platformadagi natijalarni boshqa dastur yoki hisob-kitob tizimiga uzatish mumkin.',
    points: [
      'KPI, davomat, vazifa holati',
      'Eksport yoki avtomatik uzatish',
      'Bir marta sozlang — keyin oson',
    ],
  },
  {
    icon: Globe2,
    title: 'Boshqa platformaga ulash',
    text: 'PROOPEX ni boshqa biznes platformasi bilan bog‘lash — kirish va ma’lumot bir joyda.',
    points: [
      'Platformadan platformaga o‘tish',
      'Kerakli bo‘limni ochish',
      'Bitta akkaunt oqimi',
    ],
  },
  {
    icon: Plug,
    title: 'API orqali ulash',
    text: 'PROOPEX ni boshqa dasturlar bilan bog‘lab, ma’lumotlar bir-birini to‘ldiradi.',
    points: [
      'HR, moliya, CRM kabi tizimlar',
      'Ikki tomonlama oqim',
      'Chalkashliksiz, aniq qoidalar',
    ],
  },
  {
    icon: Link2,
    title: 'Individual ishlash',
    text: 'Tashqi manbadan ma’lumot kelgan bo‘lsa ham, siz o‘z jamoangizda mustaqil davom etasiz.',
    points: [
      'O‘z rollaringiz va huquqlaringiz',
      'Tashqi manba faqat ma’lumot beradi',
      'Nazorat sizda qoladi',
    ],
  },
  {
    icon: Workflow,
    title: 'Oddiy sozlash',
    text: 'Murakkab texnik til shart emas: nima kerakligini tanlang, ulanishni yoqing, ishlating.',
    points: [
      'Qadam-baqadam yo‘riqnoma',
      'Admin paneldan boshqaruv',
      'Kerak bo‘lsa o‘chirish oson',
    ],
  },
];

export const SECURITY_POINTS = [
  'Yuz skaneri — faqat o‘zingiz tanilasiz; boshqa odamga o‘xshasa rad',
  'GPS yashil hudud — ruxsatsiz joyda davomat bo‘lmaydi',
  'Yangi telefon — admin tasdig‘isiz kirish cheklanadi',
  'Rol huquqlari — har kim faqat o‘z bo‘limini ko‘radi',
  'Kirish himoyasi — tizimda qolganingiz faqat sizniki; boshqa odam ochiq qurilmadan kira olmaydi',
  'HTTPS — Face ID va Mini App uchun majburiy',
] as const;

export const FAQS = [
  {
    q: 'PROOPEX nima?',
    a: 'Xodimi bor har qanday kompaniya uchun HR va operatsion platforma: rekruting, Face ID davomat, cheklist, vazifa, chat, oylik KPI, filial hisob-kitob, o‘quv va konferensiya — bitta joyda.',
  },
  {
    q: 'Qaysi sohalarga mos?',
    a: 'Ishlab chiqarish, savdo, xizmat, ofis, logistika, tibbiyot, ta’lim — xodimlar bo‘lsa ishlaydi. Bir filial yoki butun tarmoq.',
  },
  {
    q: 'Davomat qanday ishlaydi?',
    a: 'GPS hududda Face ID yoki barmoq izi bilan kelish/ketish. Kechikish KPI ga ta’sir qiladi. QR va masofaviy davomat (ruxsatli rollar) mavjud. Kunlik jurnal va Excel bor.',
  },
  {
    q: 'Vazifalar nima qiladi?',
    a: 'Berilgan/olingan ishlar, muddat, holat (bajarildi, tasdiqlandi). Oylik KPI dagi topshiriq ulushi shu moduldan olinadi.',
  },
  {
    q: 'Oylik qanday hisoblanadi?',
    a: 'Jami = fiks maosh + bonus. KPI: davomat + topshiriq + checklist (og‘irliklar HR/direktor/moliya o‘zgartiradi). Yo‘q komponent chiqariladi, qolgani qayta taqsimlanadi.',
  },
  {
    q: 'Hisob-kitob nima?',
    a: 'Filial/bo‘lim oylik hisobi: shaxsiy savdo × %, fiksa, reja bonusi, avans/jarima. Tasdiq oqimi va Excel eksport.',
  },
  {
    q: 'Face ID xavfsizmi?',
    a: 'Yuz vektorlari shifrlangan saqlanadi; o‘xshash yuz rad etiladi. Login va davomatda ishlatiladi. Admin Face ID markazidan boshqaradi.',
  },
  {
    q: 'Tariflar?',
    a: 'Oylik: Start $1, Business $3, Premium $5. Yillik to‘lovda: $1 · $1.5 · $2.5 (xodim / oy). Batafsil Tariflar bo‘limida.',
  },
  {
    q: 'Telegram ishlaydimi?',
    a: 'Ha — Mini App va eslatma botlari. HTTPS kerak.',
  },
  {
    q: 'Yangi telefonda nima bo‘ladi?',
    a: 'Device gate: admin tasdiqlamaguncha kirish cheklanadi.',
  },
] as const;

export const PLANS = [
  {
    id: 'starter' as const,
    name: 'Start',
    price: 1 as number | null,
    yearlyPrice: 1 as number | null,
    custom: false as const,
    maxStaff: 30 as number | null,
    tagline: 'Kichik jamoalar uchun',
    highlight: false,
    features: [
      '30 tagacha xodim',
      'Xodimlar bazasi — profil, lavozim, aloqa',
      'Face ID elektron davomat',
      'Ishga qabul: nomzod va arizalar',
      'Vazifalar va ichki chat',
      'Standart oylik KPI',
      'Davomatni Excelga eksport',
      '1 filial / ofis',
      'Telegram orqali yordam',
    ],
    notIncluded: [
      'GPS audit / checklist',
      'Bir nechta filial',
      'Logistika kuzatuvi',
      'Ustuvor yordam',
    ],
  },
  {
    id: 'business' as const,
    name: 'Business',
    price: 3 as number | null,
    yearlyPrice: 1.5 as number | null,
    custom: false as const,
    maxStaff: 500 as number | null,
    tagline: 'O‘sayotgan kompaniyalar uchun',
    highlight: true,
    features: [
      '500 tagacha xodim',
      'Start dagi barcha asoslar',
      'GPS hudud nazorati va audit',
      'Onboarding — bosqichma-bosqich moslashuv',
      'Bo‘lim / filial hisob-kitobi',
      'Ishga qabul voronkasi (pipeline)',
      'Checklist auditi',
      'Reyting va qamrov hisobotlari',
      'Telegram bildirishnomalari',
      'Qurilma xavfsizligi (device gate)',
      '5 tagacha filial / obyekt',
      'Ustuvor texnik yordam',
    ],
    notIncluded: [
      'Logistika Live / mashina monitoringi',
      'Cheklanmagan filial',
      'AI yordamchi',
    ],
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: 5 as number | null,
    yearlyPrice: 2.5 as number | null,
    custom: false as const,
    maxStaff: 1500 as number | null,
    tagline: 'Yirik tarmoq va operatsion boshqaruv',
    highlight: false,
    features: [
      '1500 tagacha xodim',
      'Cheklanmagan filiallar',
      'Business imkoniyatlari + kengaytirish',
      'Logistika boshqaruv paneli',
      'Jonli GPS — transport monitoringi',
      'Dispetcherlik: marshrut va yoqilg‘i',
      'Haydovchi / ekspeditor davomati',
      'Ombor va taqsimot panellari',
      'Ko‘chma xodimlar xaritasi',
      'Markazlashgan Face ID boshqaruvi',
      'Moslashtiriladigan KPI',
      'AI yordamchisi (onboarding / ko‘rsatma)',
      'Brend: logo va rang',
      '24/7 ustuvor yordam',
    ],
    notIncluded: [
      'White-label domen',
      'SLA shartnoma',
      'Holding boshqaruvi',
      'Ishchi AI agent',
    ],
  },
  {
    id: 'custom' as const,
    name: 'Maxsus',
    price: null as number | null,
    yearlyPrice: null as number | null,
    custom: true as const,
    maxStaff: null as number | null,
    tagline: 'Korporativ va holding darajasi',
    highlight: false,
    features: [
      'Cheklanmagan ko‘lam — kelishuv asosida',
      'To‘liq platforma konfiguratsiyasi',
      'Holding / ko‘p kompaniya boshqaruvi',
      'Shaxsiy biznes jarayonlari va tasdiq zanjiri',
      'Kengaytirilgan transport parki nazorati',
      'Maxsus marshrut va hudud siyosati',
      'AI agent — avtomatlashtirish ssenariylari',
      '1C, ERP va Excel integratsiyasi',
      'White-label — nom, domen, dizayn',
      'Maxsus hisobot va KPI formulalari',
      'SLA — uptime va javob vaqti',
      'Maxsus migratsiya va joriy etish',
      'Shaxsiy menejer',
      'Korporativ xavfsizlik auditi',
      'Yillik yoki uzoq muddatli shartnoma',
    ],
    notIncluded: [] as string[],
  },
];

export type PlanId = (typeof PLANS)[number]['id'];

export function isCustomPlan(plan: (typeof PLANS)[number]) {
  return plan.custom === true || plan.price == null;
}

export function formatUsd(n: number) {
  if (!Number.isFinite(n)) return '$0';
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return `$${rounded}`;
  const s = rounded.toFixed(2);
  return `$${s.endsWith('0') ? s.slice(0, -1) : s}`;
}
