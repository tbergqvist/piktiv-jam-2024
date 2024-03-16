import { Signal } from "@preact/signals";
import { Image, ImgPos } from "./image";

export interface Params {
  catPos: Signal<ImgPos>;
  ufoPos: Signal<ImgPos>;
  clickHandlers: Signal<MountainClicks | undefined>;
}

export interface MountainClicks {
  bear: ()=>void;
  spaceStation: ()=>void;
}

export function MountainScene(params: Params) {
  return <>
    <Image src="/images/mountains.jpg" pos={{x: 0, y: 0, scale: 1}}/>
    <Image src="/images/space-station.png" pos={{x: 940, y: 87, scale: 1}} onClick={()=> params.clickHandlers.value?.spaceStation()} />
    <Image src="/images/cat.png" pos={params.catPos.value} />
    <Image src="/images/ufo.png" pos={params.ufoPos.value} />
    <Image src="/images/bear.png" pos={{x: 320, y: 420, scale: 1}} onClick={()=> params.clickHandlers.value?.bear()} />
  </>;
}