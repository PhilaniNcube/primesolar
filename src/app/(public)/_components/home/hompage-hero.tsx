import Container from "@/components/container";
import Heading, { SubHeading } from "@/components/typography";

const HomepageHero = () => {
  return <section className="py-8">
    <Container>
      <div className="flex items-center justify-center flex-col">
        <Heading className="text-center">Powering the future with solar energy</Heading>
        <SubHeading className="text-center max-w-2xl text-slate-500 mx-auto">Get the information you need to make an informed decision about joining the renewable energy revolution with solar power</SubHeading>
      </div>
    </Container>
  </section>;
};
export default HomepageHero;
