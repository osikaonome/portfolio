import type { MDXComponents } from "mdx/types";
import type { AssetContext } from "@/lib/images";
import { Todo } from "@/components/ui/todo";
import { ArchitectureDiagram } from "./architecture-diagram";
import { BeforeAfter } from "./before-after";
import { Callout } from "./callout";
import { CodeCompare, Pre } from "./code";
import { DecisionLog } from "./decision-log";
import { DeviceFrame } from "./device-frame";
import { Gallery } from "./gallery";
import { Iterations } from "./iterations";
import { LiveDemo } from "./live-demo";
import { Media } from "./media";
import { MetricRow } from "./metric-row";
import { Palette } from "./palette";
import { PrototypeEmbed } from "./prototype-embed";
import { Quote } from "./quote";
import { Section } from "./section";
import { Timeline } from "./timeline";
import { TypeSpecimen } from "./type-specimen";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithoutCtx<T extends (props: any) => unknown> = Omit<Parameters<T>[0], "ctx">;

/**
 * The MDX component map for one entry. Blocks that load assets get the
 * entry's folder bound in, so content can write <Media src="cover.jpg" />.
 */
export function createBlocks(ctx: AssetContext) {
  return {
    pre: Pre,

    // Shared
    Todo,
    Section,
    Callout,
    Quote,
    Timeline,
    Media: (p: WithoutCtx<typeof Media>) => <Media ctx={ctx} {...p} />,
    Gallery: (p: WithoutCtx<typeof Gallery>) => <Gallery ctx={ctx} {...p} />,
    DeviceFrame: (p: WithoutCtx<typeof DeviceFrame>) => <DeviceFrame ctx={ctx} {...p} />,

    // Engineering
    MetricRow,
    DecisionLog,
    CodeCompare,
    ArchitectureDiagram: (p: WithoutCtx<typeof ArchitectureDiagram>) => <ArchitectureDiagram ctx={ctx} {...p} />,
    LiveDemo: (p: WithoutCtx<typeof LiveDemo>) => <LiveDemo ctx={ctx} {...p} />,

    // Design
    Palette,
    TypeSpecimen,
    BeforeAfter: (p: WithoutCtx<typeof BeforeAfter>) => <BeforeAfter ctx={ctx} {...p} />,
    Iterations: (p: WithoutCtx<typeof Iterations>) => <Iterations ctx={ctx} {...p} />,
    PrototypeEmbed: (p: WithoutCtx<typeof PrototypeEmbed>) => <PrototypeEmbed ctx={ctx} {...p} />,
  } satisfies MDXComponents;
}
