/* Edit this array to add catalogue entries. External URLs must be authorised. */
const movies = [
  {
    id: "north",
    title: "Northern Lights",
    year: 2024,
    rating: 8.1,
    genres: ["Drama", "Mystery"],
    runtime: "1h 54m",
    language: "English",
    quality: "1080p",
    description:
      "A meteorologist returns to a remote town and uncovers a secret hidden beneath the winter sky.",
    poster:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
    link: "#",
    badge: "New",
  },
  {
    id: "signal",
    title: "The Last Signal",
    year: 2023,
    rating: 7.7,
    genres: ["Sci‑Fi", "Thriller"],
    runtime: "2h 03m",
    language: "English",
    quality: "4K",
    description:
      "An engineer intercepts a transmission that may be the final message from a lost expedition.",
    poster:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    link: "#",
    badge: "Trending",
  },
  {
    id: "summer",
    title: "Summer House",
    year: 2022,
    rating: 7.4,
    genres: ["Romance", "Drama"],
    runtime: "1h 46m",
    language: "French",
    quality: "1080p",
    description:
      "Two strangers inherit the same coastal home and discover that leaving is harder than expected.",
    poster:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    link: "#",
  },
  {
    id: "orbit",
    title: "Orbit Nine",
    year: 2024,
    rating: 8.5,
    genres: ["Adventure", "Sci‑Fi"],
    runtime: "2h 15m",
    language: "English",
    quality: "4K",
    description:
      "A crew of unlikely explorers races to repair a station before it falls into an uncharted world.",
    poster:
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=600&q=80",
    link: "#",
    badge: "Featured",
  },
  {
    id: "canvas",
    title: "The Painted Room",
    year: 2021,
    rating: 7.2,
    genres: ["Mystery", "Drama"],
    runtime: "1h 39m",
    language: "Spanish",
    quality: "HD",
    description:
      "A restorer finds a hidden portrait whose subjects seem to change every time the lights go out.",
    poster:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80",
    link: "#",
  },
  {
    id: "run",
    title: "City Run",
    year: 2023,
    rating: 7.9,
    genres: ["Action", "Crime"],
    runtime: "1h 51m",
    language: "English",
    quality: "1080p",
    description:
      "One night, one courier, and one package that could change the future of a divided city.",
    poster:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7451?auto=format&fit=crop&w=600&q=80",
    link: "#",
    badge: "Popular",
  },
];
const $ = (selector) => document.querySelector(selector);
const grid = $("#movie-grid"),
  search = $("#search"),
  genreFilter = $("#genre-filter"),
  sort = $("#sort");
const savedRatings = JSON.parse(
  localStorage.getItem("reelroom-ratings") || "{}",
);
const savedFavourites = JSON.parse(
  localStorage.getItem("reelroom-favourites") || "[]",
);
const save = () => {
  localStorage.setItem("reelroom-ratings", JSON.stringify(savedRatings));
  localStorage.setItem("reelroom-favourites", JSON.stringify(savedFavourites));
};

function card(movie) {
  const userRating = savedRatings[movie.id] || 0,
    favourite = savedFavourites.includes(movie.id);
  return `<article class="movie-card"><div class="poster">${movie.badge ? `<span class="badge">${movie.badge}</span>` : ""}<img src="${movie.poster}" alt="Poster for ${movie.title}" loading="lazy" decoding="async"></div><div class="card-body"><h3 class="card-title"><a href="${movie.link}" target="_blank" rel="noopener noreferrer">${movie.title}</a></h3><p class="meta">${movie.year} · ${movie.runtime} · ${movie.language}</p><p class="genres">${movie.genres.join(" · ")} · ${movie.quality}</p><p class="synopsis">${movie.description}</p><div class="rating-row"><span class="rating-value">★ ${movie.rating.toFixed(1)} <span class="sr-only">out of 10</span></span><div class="stars" role="group" aria-label="Rate ${movie.title}">${[1, 2, 3, 4, 5].map((n) => `<button class="star" type="button" data-rate="${n}" data-id="${movie.id}" aria-label="Rate ${n} out of 5" aria-pressed="${userRating === n}">★</button>`).join("")}</div></div><div class="card-actions"><a class="button button-primary external-link" href="${movie.link}" target="_blank" rel="noopener noreferrer">View external link ↗</a><button class="favourite" type="button" data-favourite="${movie.id}" aria-label="Save ${movie.title}" aria-pressed="${favourite}">${favourite ? "♥" : "♡"}</button></div></div></article>`;
}
function render() {
  const q = search.value.trim().toLowerCase(),
    genre = genreFilter.value;
  let list = movies.filter(
    (m) =>
      `${m.title} ${m.genres.join(" ")} ${m.language}`
        .toLowerCase()
        .includes(q) &&
      (genre === "all" || m.genres.includes(genre)),
  );
  if (sort.value === "rating") list.sort((a, b) => b.rating - a.rating);
  if (sort.value === "year") list.sort((a, b) => b.year - a.year);
  if (sort.value === "title")
    list.sort((a, b) => a.title.localeCompare(b.title));
  grid.innerHTML = list.map(card).join("");
  $("#empty-state").hidden = list.length !== 0;
  $("#result-count").textContent =
    `${list.length} ${list.length === 1 ? "film" : "films"}`;
}
function setupGenres() {
  [...new Set(movies.flatMap((m) => m.genres))]
    .sort()
    .forEach((genre) => genreFilter.add(new Option(genre, genre)));
}
function openModal() {
  const modal = $("#request-modal");
  $("#request-status").textContent = "";
  modal.showModal();
  modal.querySelector('[name="title"]').focus();
}
function closeModal() {
  $("#request-modal").close();
}
setupGenres();
render();
$("#year").textContent = new Date().getFullYear();
[search, genreFilter, sort].forEach((el) =>
  el.addEventListener("input", render),
);
grid.addEventListener("click", (event) => {
  const rate = event.target.closest("[data-rate]"),
    fav = event.target.closest("[data-favourite]");
  if (rate) {
    savedRatings[rate.dataset.id] = Number(rate.dataset.rate);
    save();
    render();
  }
  if (fav) {
    const i = savedFavourites.indexOf(fav.dataset.favourite);
    i === -1
      ? savedFavourites.push(fav.dataset.favourite)
      : savedFavourites.splice(i, 1);
    save();
    render();
  }
});
document
  .querySelectorAll("[data-open-request]")
  .forEach((button) => button.addEventListener("click", openModal));
document
  .querySelectorAll("[data-close-request]")
  .forEach((button) => button.addEventListener("click", closeModal));
$("#request-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const requests = JSON.parse(
    localStorage.getItem("reelroom-requests") || "[]",
  );
  requests.push({ ...data, requestedAt: new Date().toISOString() });
  localStorage.setItem("reelroom-requests", JSON.stringify(requests));
  $("#request-status").textContent = "Request saved. Thank you!";
  event.currentTarget.reset();
  setTimeout(closeModal, 1000);
});
$(".menu-button").addEventListener("click", (event) => {
  const open = $("#site-nav").classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#site-nav a").forEach((link) =>
  link.addEventListener("click", () => {
    $("#site-nav").classList.remove("is-open");
    $(".menu-button").setAttribute("aria-expanded", "false");
  }),
);
