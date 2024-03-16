import { Signal } from "@preact/signals";
import { Image, ImgPos } from "./image";

export interface SpaceStationClickHandlers {
  astronaut: ()=>void;
  spaceRocket: ()=>void;
}

interface Params {
  spaceStationRocket: Signal<boolean>;
  rocketPos: Signal<ImgPos>;
  clickHandlers: Signal<SpaceStationClickHandlers>;
  astronautVisible: Signal<boolean>;
}

export function SpaceStationScene(params: Params) {
  const spaceStationSrc = !params.spaceStationRocket.value ? "./images/space-station.jpg" : "./images/space-station-no-rocket.jpg";
  return <>
    <Image src={spaceStationSrc} pos={{x: 0, y: 0, scale: 1}} />
    {params.astronautVisible.value && <Image src="./images/astronaut.png" pos={{x: 280, y: 463, scale: 1}} onClick={()=> params.clickHandlers.value.astronaut()} />}
    {params.spaceStationRocket.value && <Image src="./images/rocket.png" pos={params.rocketPos.value} />}
    <div class="space-rocket" onClick={()=> params.clickHandlers.value.spaceRocket()}></div>
  </>;
}