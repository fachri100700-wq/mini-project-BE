import { PrismaClient, EventType, EventCategory } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface EventSummary {
  id: string;
  seatTotal: number;
}

interface EventData {
  eventName: string;
  description: string;
  location: string;
  seatTotal: number;
  eventType: EventType;
  eventCategory: EventCategory;
  startDateOffsetDays: number; // days from now
  durationDays: number; // event duration in days
}

const eventsData: EventData[] = [
  // ── CONCERT ──────────────────────────────────────
  {
    eventName: "Festival Musik Jazz Jakarta 2026",
    description: "Nikmati malam penuh improvisasi jazz dari musisi lokal dan internasional di Jakarta.",
    location: "Jakarta Convention Center",
    seatTotal: 500,
    eventType: EventType.PAID,
    eventCategory: EventCategory.CONCERT,
    startDateOffsetDays: 45,
    durationDays: 3,
  },
  {
    eventName: "Konser Amal 'Suara Untuk Negeri'",
    description: "Konser amal yang menghadirkan musisi papan atas Indonesia untuk menggalang dana pendidikan.",
    location: "Gelora Bung Karno, Jakarta",
    seatTotal: 400,
    eventType: EventType.PAID,
    eventCategory: EventCategory.CONCERT,
    startDateOffsetDays: 60,
    durationDays: 1,
  },
  {
    eventName: "Rock n Roll Night With The Legends",
    description: "Malam rock legendaris bersama band-band terbaik era 90-an dan 2000-an.",
    location: "Stadion Utama GBK, Jakarta",
    seatTotal: 350,
    eventType: EventType.PAID,
    eventCategory: EventCategory.CONCERT,
    startDateOffsetDays: 90,
    durationDays: 2,
  },
  // ── SEMINAR ──────────────────────────────────────
  {
    eventName: "Seminar Nasional Digital Marketing 2026",
    description: "Pelajari strategi digital marketing terkini dari para praktisi berpengalaman di industri.",
    location: "Hotel Indonesia Kempinski, Jakarta",
    seatTotal: 200,
    eventType: EventType.PAID,
    eventCategory: EventCategory.SEMINAR,
    startDateOffsetDays: 30,
    durationDays: 1,
  },
  {
    eventName: "Workshop AI untuk Pemula – Gratis",
    description: "Pelajari dasar-dasar Artificial Intelligence dan implementasinya dalam kehidupan sehari-hari.",
    location: "Universitas Indonesia, Depok",
    seatTotal: 150,
    eventType: EventType.FREE,
    eventCategory: EventCategory.SEMINAR,
    startDateOffsetDays: 20,
    durationDays: 1,
  },
  {
    eventName: "Seminar Kesehatan Mental Generasi Muda",
    description: "Mengenal pentingnya kesehatan mental dan cara mengelola stres di era modern.",
    location: "Gedung Serbaguna Senayan, Jakarta",
    seatTotal: 250,
    eventType: EventType.FREE,
    eventCategory: EventCategory.SEMINAR,
    startDateOffsetDays: 50,
    durationDays: 1,
  },
  {
    eventName: "Business & Entrepreneurship Summit 2026",
    description: "Bersama para founder startup unicorn Indonesia berbagi kunci sukses membangun bisnis.",
    location: "ICE BSD City, Tangerang",
    seatTotal: 300,
    eventType: EventType.PAID,
    eventCategory: EventCategory.SEMINAR,
    startDateOffsetDays: 75,
    durationDays: 2,
  },
  // ── SPORTS ───────────────────────────────────────
  {
    eventName: "Jakarta Fun Run 10K",
    description: "Lari pagi santai bersama ribuan peserta lainnya sambil menikmati pemandangan kota Jakarta.",
    location: "Bundaran HI – Monas, Jakarta",
    seatTotal: 500,
    eventType: EventType.PAID,
    eventCategory: EventCategory.SPORTS,
    startDateOffsetDays: 25,
    durationDays: 1,
  },
  {
    eventName: "Turnamen Futsal Antar Komunitas",
    description: "Adu skill futsal antar komunitas se-Jabodetabek dengan total hadiah puluhan juta rupiah.",
    location: "GOR Futsal Kelapa Gading, Jakarta",
    seatTotal: 120,
    eventType: EventType.PAID,
    eventCategory: EventCategory.SPORTS,
    startDateOffsetDays: 40,
    durationDays: 3,
  },
  {
    eventName: "Yoga di Taman – Sesi Pagi Gratis",
    description: "Yoga pagi gratis di area terbuka hijau untuk merilekskan tubuh dan pikiran.",
    location: "Taman Menteng, Jakarta Pusat",
    seatTotal: 80,
    eventType: EventType.FREE,
    eventCategory: EventCategory.SPORTS,
    startDateOffsetDays: 15,
    durationDays: 1,
  },
  {
    eventName: "Kompetisi Basket 3x3 Jakarta",
    description: "Turnamen basket 3x3 terbuka untuk umum dengan kategori pelajar dan umum.",
    location: "Gelora Bung Karno Basket Hall, Jakarta",
    seatTotal: 200,
    eventType: EventType.PAID,
    eventCategory: EventCategory.SPORTS,
    startDateOffsetDays: 55,
    durationDays: 2,
  },
  // ── WORKSHOP ─────────────────────────────────────
  {
    eventName: "Workshop Fotografi Smartphone",
    description: "Pelajari teknik fotografi menggunakan smartphone agar hasil jepretanmu semakin profesional.",
    location: "CoWorking Space SCBD, Jakarta",
    seatTotal: 60,
    eventType: EventType.PAID,
    eventCategory: EventCategory.WORKSHOP,
    startDateOffsetDays: 35,
    durationDays: 1,
  },
  {
    eventName: "Belajar Coding: JavaScript untuk Pemula",
    description: "Workshop programming gratis bagi pemula yang ingin memulai karir sebagai web developer.",
    location: "Kampus Merdeka, Jakarta Selatan",
    seatTotal: 100,
    eventType: EventType.FREE,
    eventCategory: EventCategory.WORKSHOP,
    startDateOffsetDays: 18,
    durationDays: 1,
  },
  {
    eventName: "Kelas Memasak: Masakan Tradisional Nusantara",
    description: "Pelajari resep dan teknik memasak masakan tradisional dari berbagai daerah di Indonesia.",
    location: "Sekolah Kuliner Grand Indonesia, Jakarta",
    seatTotal: 50,
    eventType: EventType.PAID,
    eventCategory: EventCategory.WORKSHOP,
    startDateOffsetDays: 48,
    durationDays: 1,
  },
  {
    eventName: "Workshop Desain Grafis Canva untuk Pemula",
    description: "Kuasai Canva untuk membuat desain profesional tanpa perlu keahlian desain sebelumnya.",
    location: "Ruang Meeting Hotel Santika, Bandung",
    seatTotal: 70,
    eventType: EventType.PAID,
    eventCategory: EventCategory.WORKSHOP,
    startDateOffsetDays: 65,
    durationDays: 1,
  },
  // ── EXHIBITION ───────────────────────────────────
  {
    eventName: "Pameran Seni Rupa Kontemporer Indonesia",
    description: "Karya-karya seniman kontemporer terbaik Indonesia dipamerkan dalam ajang bergengsi tahunan.",
    location: "Galeria Nasional Indonesia, Jakarta",
    seatTotal: 150,
    eventType: EventType.PAID,
    eventCategory: EventCategory.EXHIBITION,
    startDateOffsetDays: 42,
    durationDays: 7,
  },
  {
    eventName: "Expo UMKM Kreatif 2026",
    description: "Pameran produk kreatif UMKM dari seluruh Indonesia dengan harga spesial dan doorprize.",
    location: "Jakarta Fair Kemayoran",
    seatTotal: 400,
    eventType: EventType.FREE,
    eventCategory: EventCategory.EXHIBITION,
    startDateOffsetDays: 80,
    durationDays: 5,
  },
  {
    eventName: "Pameran Teknologi & Inovasi Indonesia",
    description: "Saksikan inovasi teknologi terbaru buatan anak bangsa dalam berbagai bidang.",
    location: "ICE BSD City, Tangerang",
    seatTotal: 350,
    eventType: EventType.PAID,
    eventCategory: EventCategory.EXHIBITION,
    startDateOffsetDays: 100,
    durationDays: 4,
  },
  // ── THEATER ──────────────────────────────────────
  {
    eventName: "Pertunjukan Teater 'Roro Jonggrang'",
    description: "Kisah legenda Roro Jonggrang yang disajikan dalam pertunjukan teater spektakuler.",
    location: "Teater Jakarta, Taman Ismail Marzuki",
    seatTotal: 180,
    eventType: EventType.PAID,
    eventCategory: EventCategory.THEATER,
    startDateOffsetDays: 38,
    durationDays: 2,
  },
  {
    eventName: "Drama Musikal 'Laskar Pelangi'",
    description: "Adaptasi panggung dari novel best-seller Laskar Pelangi karya Andrea Hirata.",
    location: "Teater Usmar Ismail, Jakarta",
    seatTotal: 220,
    eventType: EventType.PAID,
    eventCategory: EventCategory.THEATER,
    startDateOffsetDays: 70,
    durationDays: 3,
  },
  {
    eventName: "Pertunjukan Wayang Kulit Semalam Suntuk",
    description: "Pertunjukan wayang kulit semalam suntuk dengan dalang ternama, gratis untuk umum.",
    location: "Pendopo Taman Budaya Yogyakarta",
    seatTotal: 300,
    eventType: EventType.FREE,
    eventCategory: EventCategory.THEATER,
    startDateOffsetDays: 22,
    durationDays: 1,
  },
  // ── FESTIVAL ─────────────────────────────────────
  {
    eventName: "Festival Kuliner Nusantara 2026",
    description: "Ratusan stan kuliner dari seluruh Nusantara siap memanjakan lidahmu!",
    location: "Lapangan Gasibu, Bandung",
    seatTotal: 500,
    eventType: EventType.FREE,
    eventCategory: EventCategory.FESTIVAL,
    startDateOffsetDays: 33,
    durationDays: 3,
  },
  {
    eventName: "Bali Arts & Culture Festival",
    description: "Festival seni dan budaya Bali dengan pertunjukan tari, musik, dan pameran kerajinan tangan.",
    location: "Taman Budaya Bali, Denpasar",
    seatTotal: 400,
    eventType: EventType.PAID,
    eventCategory: EventCategory.FESTIVAL,
    startDateOffsetDays: 85,
    durationDays: 7,
  },
  {
    eventName: "Pesta Rakyat Malam Tahun Baru",
    description: "Rayakan malam pergantian tahun bersama panggung hiburan dan pesta kembang api spektakuler.",
    location: "Kawasan Monas, Jakarta Pusat",
    seatTotal: 500,
    eventType: EventType.FREE,
    eventCategory: EventCategory.FESTIVAL,
    startDateOffsetDays: 203,
    durationDays: 1,
  },
  // ── MORE VARIOUS ─────────────────────────────────
  {
    eventName: "Seminar Investasi Saham untuk Pemula",
    description: "Pelajari dasar-dasar investasi saham dan cara memulai portofolio investasi Anda.",
    location: "Hotel Aryaduta, Jakarta",
    seatTotal: 150,
    eventType: EventType.PAID,
    eventCategory: EventCategory.SEMINAR,
    startDateOffsetDays: 55,
    durationDays: 1,
  },
  {
    eventName: "Lomba Debat Bahasa Inggris Nasional",
    description: "Kompetisi debat bahasa Inggris tingkat nasional untuk pelajar dan mahasiswa.",
    location: "Universitas Gadjah Mada, Yogyakarta",
    seatTotal: 200,
    eventType: EventType.PAID,
    eventCategory: EventCategory.WORKSHOP,
    startDateOffsetDays: 68,
    durationDays: 2,
  },
  {
    eventName: "Pameran Buku Jakarta 2026",
    description: "Pameran buku terbesar di Indonesia dengan diskon hingga 70% dan talkshow penulis.",
    location: "Istora Senayan, Jakarta",
    seatTotal: 450,
    eventType: EventType.FREE,
    eventCategory: EventCategory.EXHIBITION,
    startDateOffsetDays: 95,
    durationDays: 7,
  },
  {
    eventName: "Konser Musik Klasik 'Symphony of the Night'",
    description: "Malam penuh harmoni dengan simfoni klasik yang dibawakan oleh orkestra ternama.",
    location: "Aula Simfonia, Kemayoran",
    seatTotal: 250,
    eventType: EventType.PAID,
    eventCategory: EventCategory.CONCERT,
    startDateOffsetDays: 50,
    durationDays: 1,
  },
  {
    eventName: "Workshop Public Speaking & Leadership",
    description: "Tingkatkan kemampuan public speaking dan jiwa kepemimpinan Anda dalam workshop intensif ini.",
    location: "Menara BCA, Jakarta Pusat",
    seatTotal: 80,
    eventType: EventType.PAID,
    eventCategory: EventCategory.WORKSHOP,
    startDateOffsetDays: 28,
    durationDays: 1,
  },
  {
    eventName: "Festival Film Independen Jakarta",
    description: "Pemutaran film-film independen terbaik dari sineas muda Indonesia dan diskusi bersama sutradara.",
    location: "Gedung Kesenian Jakarta",
    seatTotal: 180,
    eventType: EventType.PAID,
    eventCategory: EventCategory.FESTIVAL,
    startDateOffsetDays: 72,
    durationDays: 5,
  },
];

export async function seedEvents(organizerIds: string[]) {
  const events: EventSummary[] = [];

  const now = new Date();

  for (let i = 0; i < eventsData.length; i++) {
    const data = eventsData[i];
    const organizer = organizerIds[i % organizerIds.length];

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + data.startDateOffsetDays);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + data.durationDays);

    const event = await prisma.event.create({
      data: {
        eventName: data.eventName,
        startDate,
        endDate,
        imageUrl: `https://picsum.photos/seed/event${i + 1}/800/400`,
        location: data.location,
        description: data.description,
        seatTotal: data.seatTotal,
        eventType: data.eventType,
        eventCategory: data.eventCategory,
        userId: organizer,
      },
    });

    events.push({ id: event.id, seatTotal: event.seatTotal });
  }

  console.log(`Seeded ${events.length} events.`);
  return events;
}