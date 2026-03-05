import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon, PhoneCallIcon } from "lucide-react";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
import { WordRotate } from "@/components/ui/word-rotate";

export function HeroSection() {
	const words = ["Smesitel", "Filtr", "Radiator", "Isitish qozonlari"];
	return (
		<div className="w-full h-auto min-h-[80vh] flex items-center justify-center pt-10 pb-20 bg-background overflow-hidden relative">
			{/* Grid Background */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

			{/* Soft Ambient Glows */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 mix-blend-screen opacity-50 md:opacity-100"></div>
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] -z-10 mix-blend-screen opacity-50 md:opacity-100"></div>

			<section className="mx-auto w-full max-w-5xl relative z-10">
				{/* main content */}

				<div className="relative flex flex-col items-center justify-center gap-5 mt-10">

				<h1
					className={cn(
						"fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center font-display font-bold text-3xl sm:text-4xl tracking-tight delay-100 duration-500 ease-out md:text-5xl lg:text-6xl md:font-extrabold",
						"text-shadow-[0_0px_50px_theme(--color-foreground/.2)]"
					)}
				>
					Ishonchli <WordRotate words={words} className="text-primary inline-block font-black px-2" /> izlayapsizmi? <br className="hidden md:block"/> <span className="inline-block mt-2 md:mt-0">To'g'ri manzildasiz</span>
				</h1>

				<p className="fade-in slide-in-from-bottom-10 mx-auto max-w-md animate-in fill-mode-backwards text-center text-base text-foreground/80 tracking-wider delay-200 duration-500 ease-out sm:text-lg md:text-xl">
					Sifat • Kafolat • Yetkazib berish
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
					<a href="tel:+998977777015">
						<Button className="rounded-full" size="lg" variant="default">
							<PhoneCallIcon data-icon="inline-start" className="size-4 mr-2" />{" "}
							Bog'lanish
						</Button>
					</a>
				</div>
			</div>
			</section>
		</div>
	);
}

export function LogosSection() {
	return (
		<section className="relative space-y-4 pt-6 pb-10">
			<h2 className="text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
				Asosiy <span className="text-foreground">Hamkorlarimiz</span>
			</h2>
			<div className="relative z-10 mx-auto max-w-4xl">
				<LogoCloud logos={logos} />
			</div>
		</section>
	);
}

const logos = [
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Grohe_AG_Logo.svg/3840px-Grohe_AG_Logo.svg.png",
		alt: "Grohe Logo",
	},
	{
		src: "https://www.viega.us/content/dam/viegadm/en_us/corporation/brand/images/ViegaOnly_black-1.png",
		alt: "Viega Logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/BWT_Logo_2024.svg/1280px-BWT_Logo_2024.svg.png",
		alt: "BWT Logo",
	},
	{
		src: "https://wp.logos-download.com/wp-content/uploads/2016/10/Grundfos_logo.png?dl",
		alt: "Grundfos Logo",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Wavin_Logo_SVG.svg",
		alt: "Wavin Logo",
	},
	{
		src: "https://www.marlin.com.pl/images/makers/ferro.png",
		alt: "Ferro Logo",
	},
	{
		src: "https://vectorseek.com/wp-content/uploads/2023/09/Chaffoteaux-Logo-Vector.svg-.png",
		alt: "Chaffoteaux Logo",
	},
	{
		src: "https://teplofakt.by/upload/iblock/40c/40c0218d6567070bc234bf5ce5a276f9.png",
		alt: "Herz Logo",
	},
	{
		src: "https://capcap.md/img_brand/07202409511853794499.webp",
		alt: "Termet Logo",
	},
	{
		src: "https://thermoindustria.com/images/feature_variant/9/Logo-POLETTI.png",
		alt: "Carlo Poletti Logo",
	},
];
