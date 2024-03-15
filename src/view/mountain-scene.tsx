import { Signal } from "@preact/signals";
import { Image, ImgPos } from "./image";

export interface Params {
  catPos: Signal<ImgPos>;
  ufoPos: Signal<ImgPos>;
}

export function MountainScene(params: Params) {
  return <>
    <img src="/images/mountains.jpg"/>
    <Image src="/images/cat.png" pos={params.catPos.value} />
    <Image src="/images/ufo.png" pos={params.ufoPos.value} />
  </>;
}