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

export function preloadSounds() {
	const sounds = [
    {name: "cat", src: "/sounds/cat-meow.mp3"},
    {name: "spaceship", src: "/sounds/alien-spaceship.mp3"},
    {name: "scream", src: "/sounds/scream.mp3" },
    {name: "rocket", src: "/sounds/rocket.mp3" },
    {name: "rocket-crash", src: "/sounds/rocket-crash.mp3" },
    {name: "sneeze", src: "/sounds/sneeze.mp3" },
    {name: "alien-screaming", src: "/sounds/alien-screaming.mp3" },
    {name: "win", src: "/sounds/win.mp3" },
    {name: "blaster1", src: "/sounds/blaster.mp3" },
    {name: "blaster2", src: "/sounds/blaster.mp3" },
    {name: "blaster3", src: "/sounds/blaster.mp3" },
    {name: "blaster4", src: "/sounds/blaster.mp3" },
  ];

  return sounds.reduce((sounds, current) => {
    let audio = new Audio();
    audio.src = current.src;
    sounds[current.name] = audio;
    return sounds;
  }, {} as {[key: string]: HTMLAudioElement});
}