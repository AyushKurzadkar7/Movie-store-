function renderMovies() {
    const search   = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("category").value;
    const sort     = document.getElementById("sort").value;

    let filtered = movies.filter(m => {
        const matchSearch   = m.name.toLowerCase().includes(search);
        const matchCategory = category === "All" || m.category === category;
        return matchSearch && matchCategory;
    });

    if (sort === "price-asc")  filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sort === "rating")     filtered.sort((a, b) => b.rating - a.rating);

    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

    if (filtered.length === 0) {
        movieList.innerHTML = "<p class='no-result'>No movies found.</p>";
        return;
    }

    filtered.forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie-card";

        const img = document.createElement("img");
        img.src = movie.image;
        img.alt = movie.name;
        img.onerror = () => img.src = "https://via.placeholder.com/200x280?text=No+Image";

        const info = document.createElement("div");
        info.className = "movie-info";
        info.innerHTML = `
            <h3>${movie.name}</h3>
            <p class="category">${movie.category}</p>
            <p class="rating">⭐ ${movie.rating}</p>
            <p class="price">₹${movie.price}</p>
        `;

        const btn = document.createElement("button");
        btn.textContent = "Add to Cart";
        btn.addEventListener("click", () => addToCart(movie));

        div.appendChild(img);
        div.appendChild(info);
        div.appendChild(btn);
        movieList.appendChild(div);
    });
}

renderMovies();
