
export interface IBook {
  title: string;
  desc: string;
  pages: number;
}

export interface IPage {
  name: string;
  position: number;
  prompt: string;
  image: string;
}

export interface AIres {
  img: string;
  prompt: string;
  seed: number;
}
