interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src }: LoaderParams) {
  return `/images/${src}`;
}
