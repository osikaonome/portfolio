import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { createBlocks } from "@/components/blocks";
import type { AssetContext } from "@/lib/images";

/**
 * Compiles and renders an entry's MDX on the server at build time. Blocks are
 * provided through the component map, so content files never import code.
 */
export async function MDXContent({ source, ctx }: { source: string; ctx: AssetContext }) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
  });
  return <Content components={createBlocks(ctx)} />;
}
