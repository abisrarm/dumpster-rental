/*
  site.js — the only place the business details live.
  Change a value here and the whole page follows.
*/
window.SITE = {
  name: "The Dumpster Man",
  tagline: "Dumpster rental and junk removal",
  city: "Austin, Texas",

  // Dispatch number. Keep both lines in sync.
  phone: "(737) 414-9043",
  tel: "tel:+17374149043",

  // Towns we serve. The page, the FAQ and the quote form all read this list.
  towns: ["Austin", "Round Rock", "Cedar Park", "Pflugerville", "San Marcos", "Kyle", "Buda",
          "Dripping Springs", "Wimberley", "Uhland", "Mountain City", "Hays", "Woodcreek"],

  hours: [
    { day: "Mon–Fri", time: "7:00–6:00" },
    { day: "Saturday", time: "8:00–2:00" },
    { day: "Sunday", time: "On-call swaps" }
  ],

  // Rental prices. 7-day rental, drop and haul included.
  rentalTerms: "7-day rental, drop and haul included.",
  // Weight over what a can includes, per ton. Dispatch calls before pickup.
  overagePerTon: 75,
  rentals: [
    { size: "10 yard", price: 349, tons: 2, fits: "A garage or one room" },
    { size: "15 yard", price: 429, tons: 3, fits: "Most houses" },
    { size: "20 yard", price: 499, tons: 3, fits: "A kitchen gut", featured: true },
    { size: "30 yard", price: 589, tons: 4, fits: "Whole house. Needs swing room" },
    { size: "40 yard", price: 669, weight: "Bulky and light", fits: "Not concrete or dirt" },
    { size: "Swap", price: 175, fits: "Haul the full can, set an empty one" }
  ],

  // Junk removal prices. We load it and haul it.
  junk: [
    { size: "Single item", price: 125, fits: "One couch, one fridge, one hot tub cover" },
    { size: "Garage", price: 349, fits: "The garage pile, loaded and gone" },
    { size: "Full house", price: 649, fits: "Every room we can fill the truck with" },
    { size: "Estate", price: 899, fits: "Estate cleanouts, start to finish" }
  ],

  // Scroll film: one house, one driveway. "to" is where each clip ends,
  // as a share of the pinned scroll (see README for the scroll map).
  videos: [
    { src: "video/01-drop.mp4", poster: "img/01-drop.jpg", to: 0.22 },
    { src: "video/02-fill.mp4", poster: "img/02-fill.jpg", to: 0.40 },
    { src: "video/03-load.mp4", poster: "img/03-load.jpg", to: 0.55 },
    { src: "video/04-pickup.mp4", poster: "img/04-pickup.jpg", to: 0.75 },
    { src: "video/05-leave.mp4", poster: "img/05-leave.jpg", to: 1 }
  ]
};
