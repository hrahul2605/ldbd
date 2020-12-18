const button = document.querySelector("button");
const container = document.querySelector("#container");

async function handleSubmit(e, form) {
  e.preventDefault();
  button.disabled = true;
  setTimeout(() => {
    button.disabled = false;
  }, 2000);

  const jsonFormData = {};
  for (const pairs of new FormData(form)) jsonFormData[pairs[0]] = pairs[1];
  console.log(jsonFormData);
  const body = {};
  body.url = jsonFormData.url;
  if (jsonFormData.slug.length > 0) body.slug = jsonFormData.slug;
  try {
    const res = await fetch("/create", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const content = await res.json();

    container.innerHTML = "";
    if (content.message) {
      const errorText = document.createElement("p");
      errorText.innerHTML = content.message;
      container.appendChild(errorText);
    } else {
      const shortLink = document.createElement("a");
      shortLink.setAttribute("href", content.shortURL);
      shortLink.innerText = content.shortURL;
      container.appendChild(shortLink);
    }
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("form").addEventListener("submit", function (e) {
  handleSubmit(e, this);
});
