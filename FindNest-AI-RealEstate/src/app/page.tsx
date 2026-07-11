import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Steps from "@/components/Steps";
import LatestListings from "@/components/LatestListings";
import Faq from "@/components/Faq";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Steps />
      <Featured />
      <LatestListings />
      <Faq />
    </div>
  );
}
