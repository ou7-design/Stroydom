import React from 'react';
import { cn } from '@/lib/utils';
import {
	Check,
	Copy,
	LucideIcon,
	Mail,
	MapPin,
	Phone,
	SendIcon,
	InstagramIcon,
	FacebookIcon,
	YoutubeIcon,
} from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

const APP_EMAIL = 'stroydom@gmail.com';
const APP_PHONE = '+998 97 777 70 15';
const APP_PHONE_2 = '+998 33 030 06 00';

export function ContactPage() {
	const socialLinks = [
		{
			icon: SendIcon,
			href: 'https://t.me/Stroydomuzb1',
			label: 'Telegram',
		},
		{
			icon: InstagramIcon,
			href: 'https://www.instagram.com/stroydom.uzbekistan/',
			label: 'Instagram',
		},
		{
			icon: FacebookIcon,
			href: 'https://www.facebook.com/stroydom.uzbekistan',
			label: 'Facebook',
		},
		{
			icon: YoutubeIcon,
			href: 'https://www.youtube.com/@Stroydom_uz',
			label: 'YouTube',
		},
	];

	return (
		<div className="w-full">
			<div className="mx-auto h-full max-w-6xl relative overflow-hidden">
				<div
					aria-hidden
					className="absolute inset-0 isolate -z-10 opacity-80 contain-strict"
				>
					<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
					<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
				</div>
				<div className="flex grow flex-col justify-center px-4 md:px-6 pt-24 pb-16">
					<h1 className=" text-4xl font-bold md:text-5xl text-foreground">
						Biz bilan bog'laning
					</h1>
					<p className="text-muted-foreground mb-5 text-base mt-2">
						Bizning qo'llab-quvvatlash jamoamizga murojaat qiling.
					</p>
				</div>
				<div className="relative w-full">
					{/* Continuous background band for desktop headers */}
					<div className="absolute top-0 left-0 w-full h-16 bg-muted/20 hidden md:block rounded-md" />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0 w-full">
						<Box
							icon={Mail}
							title="Email"
							description="Biz barcha xatlarga 24 soat ichida javob beramiz."
						>
							<div className="flex items-center gap-2">
								<a
									href={`mailto:${APP_EMAIL}`}
									className="font-mono text-sm md:text-base font-medium tracking-wide hover:underline text-foreground"
								>
									{APP_EMAIL}
								</a>
								<CopyButton className="size-6" test={APP_EMAIL} />
							</div>
						</Box>

						<Box
							icon={MapPin}
							title="Manzil"
							description="Bizning ofisimizga tashrif buyuring."
						>
							<p className="font-mono text-sm md:text-base font-medium tracking-wide text-foreground leading-relaxed max-w-[250px]">
								Mirzo Ulug'bek tumani Parkent ko'chasi 215-uy, Tashkent, Uzbekistan
							</p>
						</Box>

						<Box
							icon={Phone}
							title="Telefon"
							description="Biz Dushanbadan Jumagacha, 9:00-18:00 gacha ishlaymiz."
						>
							<div className="flex flex-col gap-3">
								<div className="flex items-center justify-between gap-4">
									<a
										href={`tel:${APP_PHONE}`}
										className="font-mono text-sm md:text-base font-medium tracking-wide hover:underline text-foreground"
									>
										{APP_PHONE}
									</a>
									<CopyButton className="size-6" test={APP_PHONE} />
								</div>
								<div className="flex items-center justify-between gap-4">
									<a
										href={`tel:${APP_PHONE_2}`}
										className="font-mono text-sm md:text-base font-medium tracking-wide hover:underline text-foreground"
									>
										{APP_PHONE_2}
									</a>
									<CopyButton className="size-6" test={APP_PHONE_2} />
								</div>
							</div>
						</Box>
					</div>
				</div>

				<div className="relative flex flex-col pt-32 pb-24 items-center justify-center">
					<h2 className="text-center text-3xl font-bold md:text-4xl text-foreground mb-10">
						Bizni ijtimoiy tarmoqlarda toping
					</h2>
					<div className="flex flex-wrap items-center gap-4 px-4 justify-center">
						{socialLinks.map((link) => (
							<a
								key={link.label}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-muted/10 hover:bg-muted/30 text-foreground flex items-center gap-x-2 rounded-full border border-border/50 px-5 py-2 transition-all"
							>
								<link.icon className="size-4" />
								<span className="font-mono text-sm font-medium tracking-wide">
									{link.label}
								</span>
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

type ContactBox = React.ComponentProps<'div'> & {
	icon: LucideIcon;
	title: string;
	description: string;
};

function Box({
	title,
	description,
	className,
	children,
	...props
}: ContactBox) {
	return (
		<div className={cn('flex flex-col h-full', className)}>
			<div className="flex items-center gap-x-3 h-16 px-4 md:px-6 bg-muted/20 md:bg-transparent rounded-md md:rounded-none">
				<props.icon className="text-muted-foreground size-5" strokeWidth={1.5} />
				<h2 className="font-heading text-lg font-semibold tracking-wide text-foreground">
					{title}
				</h2>
			</div>
			<div className="flex flex-col items-start px-4 md:px-6 py-8 flex-grow">
				{children}
			</div>
			<div className="px-4 md:px-6 pb-6 mt-auto">
				<p className="text-muted-foreground text-sm">{description}</p>
			</div>
		</div>
	);
}

type CopyButtonProps = React.ComponentProps<typeof Button> & {
	test: string;
};

function CopyButton({
	className,
	variant = 'ghost',
	size = 'icon',
	test,
	...props
}: CopyButtonProps) {
	const [copied, setCopied] = React.useState<boolean>(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(test);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			className={cn('disabled:opacity-100 flex-shrink-0 relative hover:bg-muted/50 transition-colors', className)}
			onClick={handleCopy}
			aria-label={copied ? 'Copied' : 'Copy to clipboard'}
			disabled={copied || props.disabled}
			{...props}
		>
			<div
				className={cn(
					'transition-all absolute inset-0 flex items-center justify-center',
					copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
				)}
			>
				<Check className="size-3.5 stroke-emerald-500" aria-hidden="true" />
			</div>
			<div
				className={cn(
					'absolute inset-0 flex items-center justify-center transition-all',
					copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
				)}
			>
				<Copy aria-hidden="true" className="size-3.5 text-foreground" />
			</div>
		</Button>
	);
}
