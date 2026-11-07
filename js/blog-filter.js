
const blogFeed = document.querySelector(".blog-feed");
const blogSearch = document.querySelector("#blogSearch");
const blogResults = document.querySelector("#blogResults");
const blogEmpty = document.querySelector("#blogEmpty");

const posts = [...blogFeed.querySelectorAll("article.blog-post")].map((element, index) => {
  const time = element.querySelector("time[datetime]");
  const dateValue = time ? Date.parse(time.dateTime) : NaN;

  return {
    element,
    index,
    timestamp: Number.isFinite(dateValue) ? dateValue : 0,
    text: element.textContent.toLocaleLowerCase()
  };
});

function updateBlog() {
  const query = blogSearch.value.trim().toLocaleLowerCase();
  const order = document.querySelector('input[name="blogOrder"]:checked').value;
  const sorted = [...posts].sort((a, b) => {
    const difference = a.timestamp - b.timestamp;
    return (order === "oldest" ? difference : -difference) || a.index - b.index;
  });

  let count = 0;
  const fragment = document.createDocumentFragment();

  sorted.forEach(post => {
    const matches = post.text.includes(query);
    post.element.hidden = !matches;
    if (matches) count += 1;
    fragment.appendChild(post.element);
  });

  blogFeed.appendChild(fragment);
  blogResults.textContent = `${count} of ${posts.length} posts`;
  blogEmpty.hidden = count !== 0;
}

blogSearch.addEventListener("input", updateBlog);

document.querySelectorAll('input[name="blogOrder"]').forEach(radio => {
  radio.addEventListener("change", updateBlog);
});

updateBlog();
