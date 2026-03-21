declare module "*?as=srcset" {
  const srcset: string;
  export default srcset;
}

declare module "*&as=srcset" {
  const srcset: string;
  export default srcset;
}

declare module "*&as=url" {
  const src: string;
  export default src;
}

interface ImagetoolsImg {
  src: string;
  w: number;
  h: number;
  srcset?: string;
}

declare module "*?as=img" {
  const img: ImagetoolsImg;
  export default img;
}

declare module "*&as=img" {
  const img: ImagetoolsImg;
  export default img;
}
