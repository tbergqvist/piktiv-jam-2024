export function preloadImages() {
	const images = [
    "/images/cat.png",
    "/images/home.jpg",
    "/images/open-door.jpg",
    "/images/game-over.jpg",
    "/images/mountains.jpg",
    "/images/arrow.png",
    "/images/ufo.png",
    "/images/bear.png",
  ];

  const refs = images.map(path => {
    let img = new Image();
    img.src = path;
    return img;
  });
}