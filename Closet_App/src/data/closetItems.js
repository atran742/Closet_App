// Hand-authored closet data. Put photos in /public/closet/ and reference
// them by filename below — no upload UI or blob storage needed.
//
// To add an item: copy one of the objects below, change the fields, done.
// For primaryColor hex: use your browser's built-in color picker (right-click
// the photo in devtools > "Copy color" via the eyedropper on most browsers),
// or a free site like imagecolorpicker.com — drop the photo in, click the
// garment, copy the hex.

export const closetItems = [
  {
    id: "top-red-gingham-shirt",
    photoUrl: "/Clothes_pics/IMG_2124.jpg",
    category: "top",
    primaryColor: { hex: "#E83613", label: "red-gingham" },
    pattern: "gingham",
    fabric: "linen",
    styleTags: ["flirty", "summer", "date"],
    formality: 1,
    occasionExclude: ["swimming", "gym"],
  },
  {
    id: "bottom-triangle-swim-top",
    photoUrl: "/Clothes_pics/IMG_2125.jpg",
    category: "top",
    primaryColor: { hex: "#C8F26F", label: "Chartruse" },
    pattern: "Tri-color",
    fabric: "Spandex",
    styleTags: ["Swimming", "geometric", "summer"],
    formality: 1,
    occasionExclude: ["Office", "Formal"],
  },
  {
    id: "bottom-swim-bottoms",
    photoUrl: "/Clothes_pics/IMG_2126.jpg",
    category: "bottom",
    primaryColor: { hex: "#020300", label: "black" },
    pattern: "solid",
    fabric: "athletic",
    styleTags: ["Swimming", "summer", "beach"],
    formality: 1,
    occasionIncludeOnly: ["swimming"],
  },
  {
    id: "bottom-jean-shorts",
    photoUrl: "/Clothes_pics/IMG_2127.jpg",
    category: "bottom",
    primaryColor: { hex: "#536696", label: "blue" },
    pattern: "solid",
    fabric: "jean",
    styleTags: ["Casual", "summer", "going out"],
    formality: 2,
    occasionExclude: ["Office", "Formal", "swimming", "gym"],
  },
  {
    id: "top-nike-tank",
    photoUrl: "/Clothes_pics/IMG_2128.jpg",
    category: "top",
    primaryColor: { hex: "#27691B", label: "green" },
    pattern: "solid",
    fabric: "cotten",
    styleTags: ["Casual", "summer", "going out", "gym"],
    formality: 2,
    occasionExclude: ["Office", "Formal", "swimming"],
  },
  {
    id: "top-purple-flower-shirt",
    photoUrl: "/Clothes_pics/IMG_2129.jpg",
    category: "top",
    primaryColor: { hex: "#CC84F0", label: "purple" },
    pattern: "flowers",
    fabric: "organza",
    styleTags: ["Office", "Formal", "going out"],
    formality: 4,
    occasionExclude: [ "swimming", "gym", "beach"],
  },

  {
    id: "bottom-dark-blue-shorts",
    photoUrl: "/Clothes_pics/IMG_2130.jpg",
    category: "bottom",
    primaryColor: { hex: "#0C0861", label: "blue" },
    pattern: "solid",
    fabric: "linen",
    styleTags: ["gym", "sleeping", "casual", "going out"],
    formality: 2,
    occasionExclude: [ "swimming", "office", "formal"],
  },
  


  // Add more items here, following the same shape.
];