import Image, { type ImageProps } from "next/image";
import { blogCoverUrl } from "@/lib/blog-cover";

type Props = Omit<ImageProps, "src"> & {
  coverImage: string;
};

/** Blog covers: local `/public` paths use the optimizer; remotes load unoptimized to avoid broken heroes in dev. */
export function BlogCoverImage({ coverImage, alt, ...props }: Props) {
  const src = blogCoverUrl(coverImage);
  const remote = src.startsWith("http");

  return <Image {...props} src={src} alt={alt} unoptimized={remote} />;
}