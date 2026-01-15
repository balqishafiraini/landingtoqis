export const WEDDING_DATA = {
  bride: {
    name: "Balqis",
    fullName: "Balqis Shafira Aini",
    parents: "Putri keempat dari Bapak Lili Zainal & Ibu Ida Ul Hasanah",
  },
  groom: {
    name: "Erlan",
    fullName: "Erlan Yogaswara",
    parents: "Putra pertama dari (Alm) Arief Mulyana & Ibu Samiyah Suhana",
  },
  events: {
    lampung: {
      akad: {
        dateTime: "2026-05-23T08:00:00",
        venue: "Rumah Kediaman Bapak Lili Zainal",
        address: "Jl. Romowijoyo no. 56, Sawah Lama, Tanjung Karang Timur, Bandar Lampung",
        mapUrl: "https://maps.app.goo.gl/Hp6SbNi72Lm6wAXPA",
      },
      walimah: {
        dateTime: "2026-05-23T10:00:00",
        venue: "Rumah Kediaman Bapak Lili Zainal",
        address: "Jl. Romowijoyo no. 56, Sawah Lama, Tanjung Karang Timur, Bandar Lampung",
        mapUrl: "https://maps.app.goo.gl/Hp6SbNi72Lm6wAXPA",
      },
    },
    jakarta: {
      reception: {
        dateTime: "2026-06-01T16:00:00",
        venue: "Villa Srimanganti",
        address: "Jl. Raya Pkp No.34 2, RT.2/RW.8, Klp. Dua Wetan, Kec. Ciracas, Kota Jakarta Timur, DKI Jakarta",
        mapUrl: "https://maps.app.goo.gl/nWQiJHJrwhafYwf89",
      },
    },
  },
  hashtag: "#LANdingtoQIS",
  musicUrl: "/Lover.mp3",
}

// Legacy exports for backwards compatibility
export const coupleInfo = {
  bride: WEDDING_DATA.bride,
  groom: WEDDING_DATA.groom,
}

export const musicUrl = WEDDING_DATA.musicUrl
