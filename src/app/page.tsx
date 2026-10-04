import { Before } from "@/components/Before";
import { EggTree } from "@/components/BranchEgg";
import { SingleRole } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Numbers } from "@/components/Numbers";
import { SiteHeader } from "@/components/SiteHeader";
import { SnapScroller, type Section } from "@/components/SnapScroller";
import { Toolbox } from "@/components/Toolbox";
import { aori, netchex, stennDev, stennLead } from "@/content/experience";

const sections: Section[] = [
  { id: "hero", label: "Hello" },
  { id: "numbers", label: "Numbers" },
  { id: "netchex", label: "Netchex" },
  { id: "stenn-lead", label: "Stenn management" },
  { id: "stenn", label: "Stenn" },
  { id: "aori", label: "Aori" },
  { id: "before", label: "Before code" },
  { id: "tools", label: "Toolbox" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <SnapScroller sections={sections} header={<SiteHeader />}>
      <EggTree />
      <Hero />
      <Numbers />
      <SingleRole id="netchex" year="2025" stage={netchex} />
      <SingleRole id="stenn-lead" year="2023" stage={stennLead} />
      <SingleRole id="stenn" year="2021" stage={stennDev} deco="coffee" />
      <SingleRole id="aori" year="2020" stage={aori} />
      <Before />
      <Toolbox />
      <Contact />
    </SnapScroller>
  );
}
