const thumbnails = document.querySelector(".thumbnails");
const mainImage = document.querySelector("figure img");

const thumbnailHandler = (event) => {
    const clickTarget = event.target;
    const displayNewImage = () => {
        mainImage.src = clickTarget.src;
        document.documentElement.style.setProperty(
          "--originY",
          clickTarget.dataset.index * 25 + 12.5 + "%"
        );
      };

    if (clickTarget.classList.contains("thumbnail")) {
        if (!document.startViewTransition) {
            displayNewImage();
            return;
        }

        const transition = document.startViewTransition(() => displayNewImage());
    }
};

thumbnails.addEventListener("click", thumbnailHandler, false);