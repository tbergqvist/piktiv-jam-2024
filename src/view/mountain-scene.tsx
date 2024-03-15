import { Signal } from "@preact/signals";
import { Image, ImgPos } from "./image";

export interface Params {
  catPos: Signal<ImgPos>;
  ufoPos: Signal<ImgPos>;
  clickHandlers: Signal<MountainClicks | undefined>;
}

export interface MountainClicks {
  home: ()=>void;
  bear: ()=>void;
}

export function MountainScene(params: Params) {
  return <>
    <img src="/images/mountains.jpg"/>
    <Image src="/images/cat.png" pos={params.catPos.value} />
    <Image src="/images/ufo.png" pos={params.ufoPos.value} />
    <Image src="/images/bear.png" pos={{x: 320, y: 420, scale: 1}} onClick={()=> params.clickHandlers.value?.bear()} />
    {params.clickHandlers.value && <Image src="/images/arrow.png" pos={{x: 1140, y: 350}} onClick={()=>params.clickHandlers.value?.home()}/>}
  </>;
}