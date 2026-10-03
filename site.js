/*
  site.js — the only place the business details live.
  Change a value here and the whole page follows.
  Anything marked REPLACE is a sample.
*/
window.SITE = {
  name: "The Dumpster Man",
  tagline: "Dumpster rental and junk removal",
  city: "Austin, Texas",

  // Dispatch number. Keep both lines in sync.
  phone: "(737) 414-9043",
  tel: "tel:+17374149043",

  // Austin metro plus every city in Hays County.
  towns: ["Austin", "Round Rock", "Cedar Park", "Pflugerville", "San Marcos", "Kyle", "Buda",
          "Dripping Springs", "Wimberley", "Uhland", "Niederwald", "Mountain City", "Hays", "Woodcreek"],

  hours: [
    { day: "Mon–Fri", time: "7:00–6:00" },
    { day: "Saturday", time: "8:00–2:00" },
    { day: "Sunday", time: "On-call swaps" }
  ],

  // REPLACE: sample rental prices. 7-day rental, drop and haul included.
  rentals: [
    { size: "10 yard", price: 349, detail: "Up to 2 tons", fits: "Garage or a small room" },
    { size: "15 yard", price: 429, detail: "Up to 3 tons", fits: "Most houses" },
    { size: "20 yard", price: 499, fits: "The workhorse", featured: true },
    { size: "30 yard", price: 589, detail: "Up to 4 tons", fits: "Whole house. Needs swing room" },
    { size: "40 yard", price: 669, detail: "Bulky light loads", fits: "Not for concrete or dirt" },
    { size: "Swap", price: 175, detail: "Full for fresh", fits: "Pull a full can and set a fresh one" }
  ],

  // REPLACE: sample junk removal prices.
  junk: [
    { size: "Single item", price: 125, fits: "One couch, one fridge, one hot tub cover" },
    { size: "Garage", price: 349, fits: "The garage pile, loaded and gone" },
    { size: "Full house", price: 649, fits: "Every room we can fill the truck with" },
    { size: "Estate", price: 899, fits: "Estate cleanouts, start to finish" }
  ],

  // Scroll story clips, in order: the drop, then one per beat.
  // Scroll scrubs each clip, so encode them with short keyframe gaps (see README).
  videos: [
    { src: "video/00-drop.mp4", poster: "img/00-drop.jpg" },
    { src: "video/02-driveway.mp4", poster: "img/02-driveway.jpg" },
    { src: "video/03-fill.mp4", poster: "img/03-fill.jpg" },
    { src: "video/04-crew.mp4", poster: "img/04-crew.jpg" },
    { src: "video/05-clear.mp4", poster: "img/05-clear.jpg" },
    { src: "video/06-brick.mp4", poster: "img/06-brick.jpg" }
  ]
};
