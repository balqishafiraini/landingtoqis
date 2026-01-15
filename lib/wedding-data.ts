export const WEDDING_DATA = {
  bride: {
    name: "Balqis",
    fullName: "Balqis Shafira Aini",
    parents: "Putri kedua dari Bapak H. Ahmad Ridwan & Ibu Hj. Siti Nurhaliza",
    instagram: "balqis.shafira",
  },
  groom: {
    name: "Erlan",
    fullName: "Erlan Yogaswara",
    parents: "Putra pertama dari Bapak H. Dedi Supriadi & Ibu Hj. Ratna Dewi",
    instagram: "erlan.yoga",
  },
  events: {
    lampung: {
      akad: {
        dateTime: "2026-02-15T08:00:00",
        venue: "Masjid Agung Al-Furqon",
        address: "Jl. Diponegoro No. 1, Bandar Lampung, Lampung",
        mapUrl: "https://maps.google.com/?q=-5.4297,105.2610",
      },
      walimah: {
        dateTime: "2026-02-15T11:00:00",
        venue: "Gedung Serbaguna Lampung",
        address: "Jl. Raden Intan No. 123, Bandar Lampung, Lampung",
        mapUrl: "https://maps.google.com/?q=-5.4297,105.2610",
      },
    },
    jakarta: {
      reception: {
        dateTime: "2026-02-22T18:00:00",
        venue: "The Ritz-Carlton Jakarta",
        address: "Jl. DR. Ide Anak Agung Gde Agung Kav E.1.1 No 1, Jakarta Selatan",
        mapUrl: "https://maps.google.com/?q=-6.2088,106.8456",
      },
    },
  },
  hashtag: "#BalqisErlanForever",
  musicUrl: "/wedding-music.mp3",
}

// Legacy exports for backwards compatibility
export const coupleInfo = {
  bride: WEDDING_DATA.bride,
  groom: WEDDING_DATA.groom,
}

export const musicUrl = WEDDING_DATA.musicUrl
