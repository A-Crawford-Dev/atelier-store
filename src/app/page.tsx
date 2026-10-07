import { CampaignDiptych } from "@/components/home/campaign-diptych";
import { CategoryRail } from "@/components/home/category-rail";
import { EditorialFeature } from "@/components/home/editorial-feature";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { Hero } from "@/components/home/hero";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Services } from "@/components/home/services";

export default function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <FeaturedCollections />
      <CategoryRail />
      <EditorialFeature />
      <CampaignDiptych />
      <Services />
    </>
  );
}
