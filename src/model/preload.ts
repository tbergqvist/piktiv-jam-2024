export function preloadImages() {
	const images = [
    "/images/cat.png",
    "/images/home.jpg",
    "/images/open-door.jpg",
    "/images/game-over.jpg",
    "/images/mountains.jpg",
    "/images/ufo.png",
    "/images/bear.png",
    "/images/space-station.png",
    "/images/space-station.jpg",
    "/images/space-station-no-rocket.jpg",
    "/images/astronaut.png",
    "/images/rocket.png",
    "/images/mars.jpg",
    "/images/alien.png",
    "/images/bacteria.png",
    "/images/blaster-fire.png",
  ];

  const refs = images.map(path => {
    let img = new Image();
    img.src = path;
    return img;
  });
}