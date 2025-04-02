let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch and display toys
  function fetchToys() {
      fetch("http://localhost:3000/toys")
          .then(response => response.json())
          .then(toys => {
              toyCollection.innerHTML = "";
              toys.forEach(renderToy);
          });
  }

  // Render a single toy
  function renderToy(toy) {
      const div = document.createElement("div");
      div.classList.add("card");

      div.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} likes</p>
          <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
      `;

      // Add event listener for like button
      div.querySelector(".like-btn").addEventListener("click", () => {
          likeToy(toy, div);
      });

      toyCollection.appendChild(div);
  }

  // Handle liking a toy
  function likeToy(toy, div) {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ likes: newLikes }),
      })
      .then(response => response.json())
      .then(updatedToy => {
          toy.likes = updatedToy.likes;
          div.querySelector("p").textContent = `${updatedToy.likes} likes`;
      });
  }

  // Handle new toy submission
  toyForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const newToy = {
          name: event.target.name.value,
          image: event.target.image.value,
          likes: 0,
      };

      fetch("http://localhost:3000/toys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newToy),
      })
      .then(response => response.json())
      .then(renderToy);

      toyForm.reset();
  });

  fetchToys();
});
