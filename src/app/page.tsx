import { Before } from "@/components/Before";
import { EggTree } from "@/components/BranchEgg";
import { Role } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Numbers } from "@/components/Numbers";
import { Proof } from "@/components/Proof";
import { SiteHeader } from "@/components/SiteHeader";
import { SnapScroller, type Section } from "@/components/SnapScroller";
import { Toolbox } from "@/components/Toolbox";
import { aori, netchex, stennDev, stennLead } from "@/content/experience";

const sections: Section[] = [
  { id: "hero", label: "Hello" },
  { id: "numbers", label: "Numbers" },
  { id: "proof", label: "This site" },
  { id: "netchex", label: "Netchex" },
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
      <Proof />
      <Role id="netchex" year="2025" stages={[netchex]} />
      <Role id="stenn" year="2021" stages={[stennLead, stennDev]} deco="coffee" />
      <Role id="aori" year="2020" stages={[aori]} />
      <Before />
      <Toolbox />
      <Contact />
    </SnapScroller>
  );
}
