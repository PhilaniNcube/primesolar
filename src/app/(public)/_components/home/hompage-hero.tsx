import Container from "@/components/container";
import Heading, { SubHeading } from "@/components/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomepageHero = () => {
	return (
		<section className="py-16">
			<Container>
				<div className="flex items-center justify-center flex-col">
					<Heading className="text-center">
						Powering the future with solar energy
					</Heading>
					<SubHeading className="text-center max-w-2xl text-slate-500 mx-auto">
						Get the information you need to make an informed decision about
						joining the renewable energy revolution with solar power
					</SubHeading>
					<Link href="/get-estimate">
						<Button className="mt-8">Get A Solar Estimate</Button>
					</Link>
				</div>
			</Container>
		</section>
	);
};
export default HomepageHero;
