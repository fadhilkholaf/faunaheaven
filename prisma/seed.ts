import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import {
    CourseLevel,
    JournalCategory,
    MissionType,
    PrizeRarity,
} from "../generated/prisma/enums";

const adapter = new PrismaPg({
    connectionString: `${process.env.DATABASE_URL}`,
});
const prisma = new PrismaClient({ adapter });

const image = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;
const redPandaImage =
    "https://upload.wikimedia.org/wikipedia/commons/c/c6/Red_Panda.JPG";

async function main() {
    const categories = [
        ["Dasar-dasar satwa liar", "wildlife-basics"],
        ["Laut & pesisir", "ocean-coast"],
        ["Aksi iklim", "climate-action"],
        ["Burung & migrasi", "birds-migration"],
        ["Sungai & lahan basah", "rivers-wetlands"],
        ["Tumbuhan & jamur", "plants-fungi"],
    ] as const;
    const categoryMap = new Map<string, string>();
    for (const [name, slug] of categories) {
        const category = await prisma.courseCategory.upsert({
            where: { slug },
            create: { id: `category-${slug}`, name, slug },
            update: { name },
        });
        categoryMap.set(slug, category.id);
    }
    const courses = [
        {
            id: "course-wildlife-101",
            slug: "wildlife-101",
            provider: "FaunaHeaven",
            title: "Satwa Liar 101: Membaca Alam",
            description:
                "Pelajari cara mengenali jejak, suara, dan kisah yang ditinggalkan satwa.",
            imageUrl: image("photo-1549366021-9f761d450615"),
            level: CourseLevel.BEGINNER,
            durationMin: 85,
            rewardCoins: 100,
            category: "wildlife-basics",
        },
        {
            id: "course-urban-wildlife",
            slug: "urban-wildlife",
            provider: "Laboratorium Kota Hijau",
            title: "Alam Liar di Sekitar Kita",
            description:
                "Temukan satwa yang hidup di lingkungan kita dan cara memberi mereka ruang.",
            imageUrl: image("photo-1517849845537-4d257902454a"),
            level: CourseLevel.BEGINNER,
            durationMin: 70,
            rewardCoins: 90,
            category: "wildlife-basics",
        },
        {
            id: "course-ocean-keepers",
            slug: "ocean-keepers",
            provider: "Institut Planet Biru",
            title: "Penjaga Laut",
            description:
                "Pahami ekosistem laut yang menopang kehidupan dan pilihan untuk melindunginya.",
            imageUrl: image("photo-1544551763-46a013bb70d5"),
            level: CourseLevel.INTERMEDIATE,
            durationMin: 110,
            rewardCoins: 130,
            category: "ocean-coast",
        },
        {
            id: "course-forest-futures",
            slug: "forest-futures",
            provider: "Sekolah Kanopi",
            title: "Masa Depan Hutan",
            description:
                "Jelajahi penjagaan hutan, pemulihan alam liar, dan ilmu habitat yang tangguh.",
            imageUrl: image("photo-1448375240586-882707db888b"),
            level: CourseLevel.INTERMEDIATE,
            durationMin: 95,
            rewardCoins: 120,
            category: "climate-action",
        },
        {
            id: "course-climate-choices",
            slug: "climate-choices",
            provider: "Bumi Bersama",
            title: "Pilihan untuk Iklim",
            description:
                "Ubah pengetahuan iklim menjadi tindakan kecil yang bermakna.",
            imageUrl: image("photo-1497435334941-8c899ee9e8e9"),
            level: CourseLevel.BEGINNER,
            durationMin: 60,
            rewardCoins: 80,
            category: "climate-action",
        },
        {
            id: "course-species-spotlight",
            slug: "species-spotlight",
            provider: "Catatan Lapangan",
            title: "Sorotan Spesies",
            description:
                "Kenali enam spesies istimewa dan orang-orang yang menjaga masa depan mereka.",
            imageUrl: image("photo-1516026672322-bc52d61a55d5"),
            level: CourseLevel.ADVANCED,
            durationMin: 125,
            rewardCoins: 150,
            category: "wildlife-basics",
        },
        {
            id: "course-bird-migration",
            slug: "bird-migration",
            provider: "Akademi Jalur Terbang",
            title: "Burung yang Bermigrasi",
            description:
                "Ikuti jalur terbang purba dan temukan cara burung menavigasi planet yang berubah.",
            imageUrl: image("photo-1444464666168-49d633b86797"),
            level: CourseLevel.INTERMEDIATE,
            durationMin: 90,
            rewardCoins: 110,
            category: "birds-migration",
        },
        {
            id: "course-wetland-keepers",
            slug: "wetland-keepers",
            provider: "Sungai Bersama",
            title: "Penjaga Lahan Basah",
            description:
                "Pelajari mengapa rawa, mangrove, dan dataran banjir adalah infrastruktur alami yang penting.",
            imageUrl: image("photo-1500534623283-312aade485b7"),
            level: CourseLevel.BEGINNER,
            durationMin: 75,
            rewardCoins: 95,
            category: "rivers-wetlands",
        },
        {
            id: "course-fungi-network",
            slug: "fungi-network",
            provider: "Sekolah Miselium",
            title: "Jaringan Jamur Tersembunyi",
            description:
                "Kenali mitra bawah tanah yang membantu hutan berkomunikasi, tumbuh, dan pulih.",
            imageUrl: image("photo-1501004318641-b39e6451bec6"),
            level: CourseLevel.INTERMEDIATE,
            durationMin: 80,
            rewardCoins: 100,
            category: "plants-fungi",
        },
        {
            id: "course-coral-reefs",
            slug: "coral-reefs",
            provider: "Masa Depan Terumbu",
            title: "Kota Terumbu Karang",
            description:
                "Jelajahi arsitektur, penghuni, dan ketangguhan ekosistem terumbu karang.",
            imageUrl: image("photo-1546026423-cc4642628d2b"),
            level: CourseLevel.ADVANCED,
            durationMin: 105,
            rewardCoins: 135,
            category: "ocean-coast",
        },
        {
            id: "course-rewild-your-yard",
            slug: "rewild-your-yard",
            provider: "Laboratorium Habitat Rumah",
            title: "Hidupkan Kembali Halamanmu",
            description:
                "Ubah balkon, kebun, atau trotoar menjadi habitat ramah bagi kehidupan lokal.",
            imageUrl: image("photo-1497250681960-ef046c08a56e"),
            level: CourseLevel.BEGINNER,
            durationMin: 55,
            rewardCoins: 75,
            category: "plants-fungi",
        },
        {
            id: "course-conservation-storytelling",
            slug: "conservation-storytelling",
            provider: "Studio Lapangan Terbuka",
            title: "Bercerita tentang Konservasi",
            description:
                "Bangun kisah penuh harapan yang mengajak lebih banyak orang merawat dunia kehidupan.",
            imageUrl: image("photo-1511497584788-876760111969"),
            level: CourseLevel.ADVANCED,
            durationMin: 100,
            rewardCoins: 125,
            category: "climate-action",
        },
    ];
    for (const courseData of courses) {
        const { category, ...data } = courseData;
        const course = await prisma.course.upsert({
            where: { slug: data.slug },
            create: { ...data, categoryId: categoryMap.get(category)! },
            update: { ...data, categoryId: categoryMap.get(category)! },
        });
        const modules = [
            "Mulai dengan rasa ingin tahu",
            "Amati lebih dekat",
            "Buat perubahan",
        ];
        for (let i = 0; i < modules.length; i++)
            await prisma.courseModule.upsert({
                where: {
                    courseId_position: { courseId: course.id, position: i + 1 },
                },
                create: {
                    id: `${course.id}-module-${i + 1}`,
                    courseId: course.id,
                    position: i + 1,
                    title: modules[i],
                    summary: `Catatan lapangan singkat dari ${course.title}.`,
                    content: `Di bab ini, kita memperlambat langkah dan melihat sistem kehidupan di balik ${course.title.toLowerCase()}. Perhatikan satu detail di sekitar Anda, lalu bawa rasa ingin tahu itu ke pelajaran berikutnya.`,
                    durationMin: 10 + i * 4,
                },
                update: { title: modules[i], summary: `Catatan lapangan singkat dari ${course.title}.` },
            });
    }
    const journals = [
        {
            id: "journal-elephant-memory",
            slug: "elephants-and-memory",
            title: "Yang Diingat Gajah",
            excerpt:
                "Ingatan bukan sekadar kekuatan istimewa; bagi gajah, ingatan adalah peta untuk bertahan hidup.",
            imageUrl: image("photo-1557050543-4d5f4e07ef46"),
            category: JournalCategory.WILDLIFE,
            content:
                "Keluarga gajah dipandu pengetahuan yang diwariskan lintas generasi. Betina pemimpin mengingat sumber air, jalur aman, dan tempat kawanan beristirahat. Saat kita melindungi habitat yang terhubung, kita juga melindungi perpustakaan hidup ini.",
        },
        {
            id: "journal-reef-city",
            slug: "a-city-under-the-sea",
            title: "Kota di Bawah Laut",
            excerpt:
                "Terumbu karang adalah lingkungan ramai dan penuh warna yang dibangun arsitek-arsitek kecil.",
            imageUrl: image("photo-1546026423-cc4642628d2b"),
            category: JournalCategory.CONSERVATION,
            content:
                "Terumbu karang adalah komunitas dengan kerja sama luar biasa. Ikan, karang, alga, dan arus semuanya berperan. Terumbu sehat melindungi pesisir dan mendukung manusia, sehingga perubahan kecil di daratan dapat berdampak besar di laut.",
        },
        {
            id: "journal-night-pollinators",
            slug: "the-night-shift",
            title: "Penjaga Malam",
            excerpt: "Saat kita tidur, ngengat dan kelelawar menjaga dunia tetap berbunga.",
            imageUrl: image("photo-1500534623283-312aade485b7"),
            category: JournalCategory.CLIMATE,
            content:
                "Penyerbuk malam adalah penolong iklim yang bekerja tanpa suara. Ngengat membawa serbuk sari antarbunga dan kelelawar mengendalikan populasi serangga. Mematikan lampu yang tidak perlu memberi pekerja malam ini kegelapan yang mereka butuhkan.",
        },
        {
            id: "journal-whale-song",
            slug: "songs-across-the-ocean",
            title: "Nyanyian Melintasi Laut",
            excerpt:
                "Nyanyian paus menembus air dan membawa pesan melintasi jarak yang sangat jauh.",
            imageUrl: image("photo-1560275619-4662e36fa65c"),
            category: JournalCategory.WILDLIFE,
            content:
                "Paus menggunakan suara untuk saling menemukan, bernavigasi, dan berbagi informasi di lautan luas. Melindungi koridor laut yang tenang memberi ruang agar percakapan ini terus berlangsung.",
        },
        {
            id: "journal-mangrove-shield",
            slug: "the-mangrove-shield",
            title: "Perisai Mangrove",
            excerpt:
                "Hutan mangrove menjaga garis pantai dan menjadi tempat tumbuh bagi kehidupan laut muda.",
            imageUrl: image("photo-1500534623283-312aade485b7"),
            category: JournalCategory.CONSERVATION,
            content:
                "Mangrove meredam gelombang, menyimpan karbon, dan melindungi ikan sebelum mereka menuju laut. Akarnya yang kusut mengingatkan bahwa perlindungan dapat berupa tempat bermulanya banyak kehidupan.",
        },
        {
            id: "journal-soil-alive",
            slug: "soil-is-alive",
            title: "Tanah Itu Hidup",
            excerpt:
                "Di bawah setiap langkah ada dunia akar, mikroba, dan jamur yang bekerja dengan sabar.",
            imageUrl: image("photo-1501004318641-b39e6451bec6"),
            category: JournalCategory.CLIMATE,
            content:
                "Tanah sehat adalah sistem hidup. Jamur menghubungkan akar, mikroba mendaur ulang nutrisi, dan bahan organik membantu tanah menahan air. Merawat tanah adalah aksi iklim dari permukaan bumi.",
        },
        {
            id: "journal-city-swifts",
            slug: "city-swifts",
            title: "Burung di Atas Kota",
            excerpt:
                "Burung walet menghabiskan sebagian besar hidupnya di udara, bahkan di atas jalan yang ramai.",
            imageUrl: image("photo-1444464666168-49d633b86797"),
            category: JournalCategory.COMMUNITY,
            content:
                "Burung kota menunjukkan betapa adaptifnya satwa liar. Beberapa tempat bersarang yang aman dan ruang hijau bebas pestisida dapat membuat lingkungan perkotaan lebih aman bagi para pengelana menakjubkan.",
        },
        {
            id: "journal-river-memory",
            slug: "a-river-remembers",
            title: "Sungai Mengingat",
            excerpt:
                "Sungai membawa cerita dari hujan pegunungan hingga lahan basah pesisir.",
            imageUrl: image("photo-1437482078695-73f5ca6c96e2"),
            category: JournalCategory.CONSERVATION,
            content:
                "Sungai yang sehat terhubung dari hulu hingga delta. Saat kita memulihkan kelokan, tepian, dan dataran banjirnya, kita memberi air dan satwa ruang untuk bergerak secara alami.",
        },
    ];
    for (const journal of journals) {
        const saved = await prisma.journal.upsert({
            where: { slug: journal.slug },
            create: journal,
            update: journal,
        });
        const questions = [
            "Apa gagasan utama jurnal ini?",
            "Tindakan mana yang paling mendukung pelajaran ini?",
        ];
        for (let i = 0; i < questions.length; i++)
            await prisma.quizQuestion.upsert({
                where: {
                    journalId_position: {
                        journalId: saved.id,
                        position: i + 1,
                    },
                },
                create: {
                    journalId: saved.id,
                    position: i + 1,
                    question: questions[i],
                    options: [
                        "Lindungi habitat yang terhubung",
                        "Abaikan tanda-tandanya",
                        "Hancurkan habitatnya",
                        "Tunggu orang lain",
                    ],
                    answerIndex: 0,
                },
                update: { question: questions[i] },
            });
    }
    const faqs = [
        [
            "Mulai",
            "Bisakah saya menjelajah tanpa akun?",
            "Bisa. Tamu dapat melihat kursus, cerita jurnal, dan FAQ. Akun hanya diperlukan untuk mendaftar kursus, belajar, mengerjakan kuis, dan mendapatkan koin.",
        ],
        [
            "Belajar",
            "Bagaimana hadiah kursus bekerja?",
            "Selesaikan setiap modul dalam kursus yang diikuti dan hadiahnya akan ditambahkan ke dompet satu kali. Mengulang modul yang sudah selesai tidak menggandakan hadiah.",
        ],
        [
            "Akun",
            "Di mana progres saya disimpan?",
            "Progres belajar, profil, dan dompet Anda disimpan dengan aman di database akun FaunaHeaven.",
        ],
        [
            "EcoKuji",
            "Bisakah saya mendapatkan kartu yang sama dua kali?",
            "Bisa. Kartu duplikat akan menumpuk di koleksi FaunaDex. Anda dapat menyimpannya, memberikannya, atau menukar ekstra menjadi koin.",
        ],
        [
            "EcoKuji",
            "Apa yang terjadi jika hadiah habis?",
            "Hadiah tidak dapat ditarik setelah stoknya mencapai nol. Setiap perubahan stok terjadi dalam transaksi yang sama dengan spin.",
        ],
        [
            "Misi",
            "Kapan misi harian direset?",
            "Progres misi berdasarkan tanggal dan direset pada awal hari UTC berikutnya.",
        ],
        [
            "Hadiah",
            "Bisakah kode promo digunakan lebih dari sekali?",
            "Setiap kode promo dapat ditukarkan satu kali per akun, sesuai periode aktif dan batas penukaran.",
        ],
        [
            "Koleksi",
            "Bagaimana cara menemukan kartu satwa?",
            "Jelajahi banner EcoKuji, lalu kunjungi FaunaDex untuk melihat setiap spesies yang ditemukan dan jumlahnya.",
        ],
        [
            "Aksesibilitas",
            "Apakah FaunaHeaven bisa digunakan di ponsel?",
            "Bisa. Katalog, halaman belajar, koleksi, misi, dan EcoKuji dirancang untuk ponsel, tablet, dan desktop.",
        ],
    ] as const;
    for (let i = 0; i < faqs.length; i++)
        await prisma.fAQ.upsert({
            where: { id: `faq-${i + 1}` },
            create: {
                id: `faq-${i + 1}`,
                category: faqs[i][0],
                question: faqs[i][1],
                answer: faqs[i][2],
                position: i,
            },
            update: {
                category: faqs[i][0],
                question: faqs[i][1],
                answer: faqs[i][2],
                position: i,
            },
        });
    const fauna = [
        [
            "fauna-red-panda",
            "Red panda",
            "Ailurus fulgens",
            "A small forest acrobat with a big personality.",
            redPandaImage,
            "Eastern Himalayas",
            PrizeRarity.RARE,
        ],
        [
            "fauna-sea-turtle",
            "Green sea turtle",
            "Chelonia mydas",
            "A long-distance traveler of the blue planet.",
            "photo-1518467166778-b88f373ffec7",
            "Tropical oceans",
            PrizeRarity.COMMON,
        ],
        [
            "fauna-snow-leopard",
            "Snow leopard",
            "Panthera uncia",
            "A quiet guardian of high mountain ecosystems.",
            "photo-1549366021-9f761d450615",
            "Central Asia",
            PrizeRarity.EPIC,
        ],
        [
            "fauna-golden-eagle",
            "Golden eagle",
            "Aquila chrysaetos",
            "A powerful raptor built for open skies.",
            "photo-1444464666168-49d633b86797",
            "Mountain ranges",
            PrizeRarity.LEGENDARY,
        ],
        [
            "fauna-axolotl",
            "Axolotl",
            "Ambystoma mexicanum",
            "A remarkable amphibian that can regenerate its limbs.",
            "photo-1559253664-ca249d4608c6",
            "Xochimilco canals",
            PrizeRarity.RARE,
        ],
        [
            "fauna-orangutan",
            "Orangutan",
            "Pongo abelii",
            "A thoughtful canopy-dweller with a deep family life.",
            "photo-1540573133985-87b6da6d54a9",
            "Sumatran rainforest",
            PrizeRarity.EPIC,
        ],
        [
            "fauna-lemur",
            "Ring-tailed lemur",
            "Lemur catta",
            "A social island specialist with a distinctive striped tail.",
            "photo-1535338454770-8be927b5a00b",
            "Madagascar",
            PrizeRarity.COMMON,
        ],
        [
            "fauna-pangolin",
            "Ground pangolin",
            "Smutsia temminckii",
            "A shy armored mammal that helps keep soil ecosystems healthy.",
            "photo-1549366021-9f761d450615",
            "Southern Africa",
            PrizeRarity.RARE,
        ],
        [
            "fauna-polar-bear",
            "Polar bear",
            "Ursus maritimus",
            "An Arctic swimmer whose future depends on sea ice.",
            "photo-1589656966895-2f33e7653819",
            "Arctic sea ice",
            PrizeRarity.EPIC,
        ],
        [
            "fauna-hummingbird",
            "Ruby-throated hummingbird",
            "Archilochus colubris",
            "A tiny migration champion powered by flowers.",
            "photo-1497206365907-f5e630693df0",
            "Woodland edges",
            PrizeRarity.COMMON,
        ],
        [
            "fauna-giant-panda",
            "Giant panda",
            "Ailuropoda melanoleuca",
            "A bamboo specialist and symbol of habitat protection.",
            "photo-1564349683136-77e08dba1ef7",
            "Mountain forests",
            PrizeRarity.RARE,
        ],
        [
            "fauna-blue-whale",
            "Blue whale",
            "Balaenoptera musculus",
            "The largest animal ever known to live on Earth.",
            "photo-1560275619-4662e36fa65c",
            "Open ocean",
            PrizeRarity.LEGENDARY,
        ],
        [
            "fauna-red-fox",
            "Red fox",
            "Vulpes vulpes",
            "A clever urban neighbor found across the northern hemisphere.",
            "photo-1516934024742-b461fba47600",
            "Grasslands",
            PrizeRarity.COMMON,
        ],
        [
            "fauna-jaguar",
            "Jaguar",
            "Panthera onca",
            "A powerful rainforest predator and guardian of waterways.",
            "photo-1549366021-9f761d450615",
            "Amazon rainforest",
            PrizeRarity.EPIC,
        ],
        [
            "fauna-honeybee",
            "Western honey bee",
            "Apis mellifera",
            "A tiny pollinator with an outsized role in food systems.",
            "photo-1473973266408-ed4e27abdd47",
            "Flowering meadows",
            PrizeRarity.COMMON,
        ],
        [
            "fauna-manta-ray",
            "Giant manta ray",
            "Mobula birostris",
            "A graceful ocean traveler with wings wider than a car.",
            "photo-1544551763-46a013bb70d5",
            "Tropical seas",
            PrizeRarity.RARE,
        ],
        [
            "fauna-tree-frog",
            "Red-eyed tree frog",
            "Agalychnis callidryas",
            "A bright nocturnal climber of humid forests.",
            "photo-1473448912268-2022ce9509d8",
            "Cloud forests",
            PrizeRarity.COMMON,
        ],
        [
            "fauna-wolf",
            "Gray wolf",
            "Canis lupus",
            "A keystone species whose return can reshape an ecosystem.",
            "photo-1516934024742-b461fba47600",
            "Northern forests",
            PrizeRarity.EPIC,
        ],
        [
            "fauna-albatross",
            "Wandering albatross",
            "Diomedea exulans",
            "A master of ocean winds with the longest wingspan of any bird.",
            "photo-1444464666168-49d633b86797",
            "Southern Ocean",
            PrizeRarity.RARE,
        ],
        [
            "fauna-beaver",
            "North American beaver",
            "Castor canadensis",
            "A wetland engineer whose dams create homes for many species.",
            "photo-1500534623283-312aade485b7",
            "Freshwater streams",
            PrizeRarity.COMMON,
        ],
        [
            "fauna-chameleon",
            "Veiled chameleon",
            "Chamaeleo calyptratus",
            "A patient canopy hunter with independently moving eyes.",
            "photo-1511497584788-876760111969",
            "Mountain forests",
            PrizeRarity.RARE,
        ],
        [
            "fauna-giant-otter",
            "Giant otter",
            "Pteronura brasiliensis",
            "A playful river guardian that lives in close family groups.",
            "photo-1437482078695-73f5ca6c96e2",
            "Amazon waterways",
            PrizeRarity.EPIC,
        ],
        [
            "fauna-manatee",
            "West Indian manatee",
            "Trichechus manatus",
            "A gentle seagrass grazer sometimes called a sea cow.",
            "photo-1544551763-46a013bb70d5",
            "Warm coastal waters",
            PrizeRarity.COMMON,
        ],
        [
            "fauna-firefly",
            "Common firefly",
            "Lampyris noctiluca",
            "A tiny night light whose glow is a language of courtship.",
            "photo-1501004318641-b39e6451bec6",
            "Meadows and hedgerows",
            PrizeRarity.COMMON,
        ],
    ] as const;
    const localizedFaunaNames: Record<string, string> = {
        "fauna-red-panda": "Panda merah",
        "fauna-sea-turtle": "Penyu hijau",
        "fauna-snow-leopard": "Macan tutul salju",
        "fauna-golden-eagle": "Elang emas",
        "fauna-axolotl": "Aksolotl",
        "fauna-orangutan": "Orangutan",
        "fauna-lemur": "Lemur ekor belang",
        "fauna-pangolin": "Trenggiling",
        "fauna-polar-bear": "Beruang kutub",
        "fauna-hummingbird": "Kolibri tenggorokan merah",
        "fauna-giant-panda": "Panda raksasa",
        "fauna-blue-whale": "Paus biru",
        "fauna-red-fox": "Rubah merah",
        "fauna-jaguar": "Jaguar",
        "fauna-honeybee": "Lebah madu barat",
        "fauna-manta-ray": "Pari manta raksasa",
        "fauna-tree-frog": "Katak pohon mata merah",
        "fauna-wolf": "Serigala abu-abu",
        "fauna-albatross": "Albatros pengembara",
        "fauna-beaver": "Berang-berang Amerika Utara",
        "fauna-chameleon": "Bunglon berjumbai",
        "fauna-giant-otter": "Berang-berang raksasa",
        "fauna-manatee": "Manatee Hindia Barat",
        "fauna-firefly": "Kunang-kunang biasa",
    };
    const localizedFaunaDetails: Record<string, [string, string]> = {
        "fauna-red-panda": ["Panda merah adalah mamalia pemalu yang lincah di pepohonan. Ekornya yang panjang membantu menjaga keseimbangan sekaligus menghangatkan tubuh di hutan pegunungan.", "Himalaya timur"],
        "fauna-sea-turtle": ["Penyu hijau melakukan perjalanan jauh melintasi laut untuk mencari makan dan kembali bertelur. Mereka membantu menjaga kesehatan padang lamun dan terumbu karang.", "Laut tropis"],
        "fauna-snow-leopard": ["Macan tutul salju memiliki bulu tebal dan kaki lebar untuk bertahan di pegunungan dingin. Kucing pemalu ini berperan penting menjaga keseimbangan populasi mangsanya.", "Asia Tengah"],
        "fauna-golden-eagle": ["Elang emas adalah pemburu tangguh dengan penglihatan tajam dan kemampuan terbang tinggi. Ia menggunakan arus udara pegunungan untuk menghemat energi saat mencari mangsa.", "Pegunungan"],
        "fauna-axolotl": ["Aksolotl adalah salamander air yang terkenal karena mampu menumbuhkan kembali anggota tubuhnya. Wajahnya yang tampak tersenyum menyembunyikan kehidupan unik di kanal air tawar.", "Kanal Xochimilco"],
        "fauna-orangutan": ["Orangutan menghabiskan sebagian besar hidupnya di kanopi dan dikenal sangat cerdas. Mereka menyebarkan biji dari buah yang dimakan sehingga membantu regenerasi hutan.", "Hutan hujan Sumatra"],
        "fauna-lemur": ["Lemur ekor belang hidup berkelompok dan menggunakan ekornya untuk berkomunikasi. Satwa endemik Madagaskar ini membantu menyebarkan biji berbagai tumbuhan hutan.", "Madagaskar"],
        "fauna-pangolin": ["Trenggiling adalah mamalia bersisik yang menggulung menjadi bola ketika merasa terancam. Ia memakan banyak semut dan rayap, sehingga membantu mengendalikan populasi serangga.", "Afrika selatan"],
        "fauna-polar-bear": ["Beruang kutub adalah perenang kuat yang mengandalkan es laut untuk berburu anjing laut. Perubahan iklim membuat habitat esnya semakin penting untuk dilindungi.", "Es laut Arktik"],
        "fauna-hummingbird": ["Kolibri dapat melayang di tempat sambil mengepakkan sayap dengan sangat cepat. Paruh dan lidahnya yang panjang membuatnya menjadi penyerbuk penting bagi banyak bunga.", "Tepi hutan"],
        "fauna-giant-panda": ["Panda raksasa menghabiskan sebagian besar harinya memakan bambu. Walau terlihat tenang, panda membantu menjaga perhatian dunia pada perlindungan hutan pegunungan.", "Hutan pegunungan"],
        "fauna-blue-whale": ["Paus biru adalah hewan terbesar yang pernah diketahui hidup di Bumi. Tubuh raksasanya tetap bertahan dengan menyaring jutaan organisme kecil dari air laut.", "Laut lepas"],
        "fauna-red-fox": ["Rubah merah sangat mudah beradaptasi dan dapat hidup di hutan, padang rumput, hingga sekitar kota. Pendengarannya yang tajam membantu menemukan mangsa di balik salju atau rumput.", "Padang rumput"],
        "fauna-jaguar": ["Jaguar adalah pemangsa kuat dengan gigitan yang sangat kokoh. Kehadirannya menandakan hutan hujan masih memiliki rantai makanan yang sehat dan beragam.", "Hutan hujan Amazon"],
        "fauna-honeybee": ["Lebah madu hidup dalam koloni terorganisasi dan bekerja sama merawat sarang. Saat mengumpulkan nektar, mereka membantu penyerbukan tanaman yang menjadi sumber pangan manusia.", "Padang bunga"],
        "fauna-manta-ray": ["Pari manta bergerak anggun dengan mengepakkan sirip lebarnya seperti sayap. Hewan jinak ini menyaring plankton dari air dan sering bermigrasi mengikuti sumber makanan.", "Laut tropis"],
        "fauna-tree-frog": ["Katak pohon mata merah aktif pada malam hari dan memakai bantalan lengket di kakinya untuk memanjat. Warna tubuhnya membantu mengejutkan pemangsa di hutan yang lembap.", "Hutan awan"],
        "fauna-wolf": ["Serigala abu-abu hidup dalam keluarga yang bekerja sama saat berburu dan merawat anak. Sebagai spesies kunci, kehadirannya dapat membantu memulihkan keseimbangan ekosistem.", "Hutan utara"],
        "fauna-albatross": ["Albatros pengembara dapat melayang berhari-hari di atas lautan dengan memanfaatkan angin. Bentang sayapnya yang luar biasa membuatnya sangat efisien saat menempuh jarak jauh.", "Samudra Selatan"],
        "fauna-beaver": ["Berang-berang membangun bendungan yang memperlambat aliran air dan menciptakan lahan basah. Pekerjaan mereka menyediakan tempat berlindung bagi banyak tumbuhan dan satwa lain.", "Aliran air tawar"],
        "fauna-chameleon": ["Bunglon berjumbai adalah pemburu sabar dengan mata yang dapat bergerak secara terpisah. Lidahnya yang panjang melesat cepat untuk menangkap serangga dari kejauhan.", "Hutan pegunungan"],
        "fauna-giant-otter": ["Berang-berang raksasa hidup dalam kelompok keluarga yang kompak dan gemar bermain di sungai. Mereka merupakan indikator penting bagi kesehatan perairan Amazon.", "Perairan Amazon"],
        "fauna-manatee": ["Manatee adalah herbivor lembut yang menghabiskan waktu merumput di padang lamun. Gerakannya yang tenang membuatnya sering dijuluki sapi laut.", "Perairan pesisir hangat"],
        "fauna-firefly": ["Kunang-kunang menghasilkan cahaya dari reaksi kimia di tubuhnya untuk berkomunikasi. Kelap-kelipnya menjadi tanda bahwa lingkungan malam masih cukup sehat bagi serangga.", "Padang rumput dan semak"],
    };
    for (const [
        id,
        name,
        scientificName,
        description,
        photo,
        habitat,
        rarity,
    ] of fauna) {
        const localizedName = localizedFaunaNames[id] ?? name;
        const [localizedDescription, localizedHabitat] = localizedFaunaDetails[id] ?? [description, habitat];
        const imageUrl = photo.startsWith("http") ? photo : image(photo);
        await prisma.faunaEntry.upsert({
            where: { slug: id },
            create: {
                id,
                slug: id,
                name: localizedName,
                scientificName,
                description: localizedDescription,
                imageUrl,
                habitat: localizedHabitat,
                rarity,
            },
            update: {
                name: localizedName,
                scientificName,
                description: localizedDescription,
                imageUrl,
                habitat: localizedHabitat,
                rarity,
            },
        });
    }
    const banners = [
        [
            "banner-forest",
            "Penjaga hutan",
            "Sahabat kanopi",
            "Kenali penjaga dunia hijau.",
            "photo-1448375240586-882707db888b",
        ],
        [
            "banner-blue",
            "Planet biru",
            "Penjaga laut",
            "Selami lautan kehidupan yang luar biasa.",
            "photo-1544551763-46a013bb70d5",
        ],
        [
            "banner-night",
            "Setelah gelap",
            "Penjaga malam",
            "Dunia liar yang terjaga saat kita tidur.",
            "photo-1500534623283-312aade485b7",
        ],
        [
            "banner-flyways",
            "Jalur terbang agung",
            "Burung yang bergerak",
            "Ikuti rute yang menghubungkan benua.",
            "photo-1444464666168-49d633b86797",
        ],
        [
            "banner-freshwater",
            "Dunia air tawar",
            "Tetangga sungai",
            "Temukan kehidupan yang bergerak di setiap daerah aliran sungai.",
            "photo-1437482078695-73f5ca6c96e2",
        ],
        [
            "banner-small-wonders",
            "Keajaiban kecil",
            "Mungil tapi kuat",
            "Kenali penyerbuk dan pengurai yang menjaga ekosistem tetap utuh.",
            "photo-1501004318641-b39e6451bec6",
        ],
    ] as const;
    for (const [id, category, title, description, photo] of banners) {
        const banner = await prisma.gachaBanner.upsert({
            where: { slug: id },
            create: {
                id,
                category,
                slug: id,
                title,
                description,
                imageUrl: image(photo),
                spinCost: 25,
                tenSpinCost: 200,
            },
            update: { category, title, description, imageUrl: image(photo) },
        });
        for (const [entryId, , , , , , rarity] of fauna) {
            const entry = await prisma.faunaEntry.findUniqueOrThrow({
                where: { id: entryId },
            });
            const stock =
                rarity === PrizeRarity.LEGENDARY
                    ? 5
                    : rarity === PrizeRarity.EPIC
                      ? 15
                      : rarity === PrizeRarity.RARE
                        ? 35
                        : 100;
            const weight =
                rarity === PrizeRarity.LEGENDARY
                    ? 1
                    : rarity === PrizeRarity.EPIC
                      ? 2
                      : rarity === PrizeRarity.RARE
                        ? 4
                        : 10;
            await prisma.gachaPrize.upsert({
                where: {
                    bannerId_faunaEntryId: {
                        bannerId: banner.id,
                        faunaEntryId: entry.id,
                    },
                },
                create: {
                    bannerId: banner.id,
                    faunaEntryId: entry.id,
                    rarity,
                    stock,
                    initialStock: stock,
                    weight,
                },
                update: { rarity, weight, stock, initialStock: stock },
            });
        }
    }
    const missions = [
        [
            "mission-learn",
            "Pelajari hal baru",
            "Selesaikan dua modul kursus hari ini.",
            MissionType.COURSE_MODULE,
            2,
            40,
        ],
        [
            "mission-quiz",
            "Uji catatan lapanganmu",
            "Selesaikan satu kuis jurnal hari ini.",
            MissionType.QUIZ_COMPLETE,
            1,
            25,
        ],
        [
            "mission-collect",
            "Beri ruang untuk keajaiban",
            "Kumpulkan satu kartu satwa hari ini.",
            MissionType.COLLECTION_ADD,
            1,
            30,
        ],
        [
            "mission-learn-four",
            "Jaga semangatnya",
            "Selesaikan empat modul kursus hari ini.",
            MissionType.COURSE_MODULE,
            4,
            80,
        ],
        [
            "mission-quiz-two",
            "Pikiran penuh ingin tahu",
            "Selesaikan dua kuis jurnal hari ini.",
            MissionType.QUIZ_COMPLETE,
            2,
            60,
        ],
        [
            "mission-spin",
            "Coba peruntunganmu",
            "Lakukan satu pull EcoKuji hari ini.",
            MissionType.GACHA_SPIN,
            1,
            20,
        ],
        [
            "mission-collect-three",
            "Bangun panduan lapanganmu",
            "Kumpulkan tiga kartu satwa hari ini.",
            MissionType.COLLECTION_ADD,
            3,
            75,
        ],
        [
            "mission-learn-one",
            "Mulai dari yang kecil",
            "Selesaikan satu modul kursus hari ini.",
            MissionType.COURSE_MODULE,
            1,
            15,
        ],
    ] as const;
    for (const [id, title, description, type, target, rewardCoins] of missions)
        await prisma.dailyMission.upsert({
            where: { id },
            create: { id, title, description, type, target, rewardCoins },
            update: { title, description, type, target, rewardCoins },
        });
    const promos = [
        ["WELCOME-WILD", 100, 1000],
        ["FIELD-NOTES", 75, 500],
        ["OCEAN-LOVER", 125, 250],
        ["FOREST-FRIEND", 90, 300],
        ["WILDLIFE-WEEK", 200, 100],
    ] as const;
    for (const [code, rewardCoins, maxRedemptions] of promos)
        await prisma.promoCode.upsert({
            where: { code },
            create: { code, rewardCoins, maxRedemptions },
            update: { rewardCoins, maxRedemptions, active: true },
        });
}

main().finally(() => prisma.$disconnect());
