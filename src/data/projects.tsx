import AceTernityLogo from '@/components/logos/aceternity';
import SlideShow from '@/components/slide-show';
import { Button } from '@/components/ui/button';
import { TypographyH3, TypographyP } from '@/components/ui/typography';
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from 'react-icons/ri';
import {
	SiChakraui,
	SiDocker,
	SiExpress,
	SiFirebase,
	SiJavascript,
	SiMongodb,
	SiPostgresql,
	SiPrisma,
	SiPython,
	SiReactquery,
	SiSanity,
	SiShadcnui,
	SiSocketdotio,
	SiSupabase,
	SiTailwindcss,
	SiThreedotjs,
	SiTypescript,
	SiVuedotjs,
} from 'react-icons/si';
import { TbBrandFramerMotion } from 'react-icons/tb';
const BASE_PATH = '/assets/projects-screenshots';

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
	return (
		<div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
			<Link
				className="font-mono underline flex gap-2"
				rel="noopener"
				target="_new"
				href={live}
			>
				<Button variant={'default'} size={'sm'}>
					Visit Website
					<ArrowUpRight className="ml-3 w-5 h-5" />
				</Button>
			</Link>
			{repo && (
				<Link
					className="font-mono underline flex gap-2"
					rel="noopener"
					target="_new"
					href={repo}
				>
					<Button variant={'default'} size={'sm'}>
						Github
						<ArrowUpRight className="ml-3 w-5 h-5" />
					</Button>
				</Link>
			)}
		</div>
	);
};

export type Skill = {
	title: string;
	bg: string;
	fg: string;
	icon: ReactNode;
};
const PROJECT_SKILLS = {
	next: {
		title: 'Next.js',
		bg: 'black',
		fg: 'white',
		icon: <RiNextjsFill />,
	},
	chakra: {
		title: 'Chakra UI',
		bg: 'black',
		fg: 'white',
		icon: <SiChakraui />,
	},
	node: {
		title: 'Node.js',
		bg: 'black',
		fg: 'white',
		icon: <RiNodejsFill />,
	},
	python: {
		title: 'Python',
		bg: 'black',
		fg: 'white',
		icon: <SiPython />,
	},
	prisma: {
		title: 'prisma',
		bg: 'black',
		fg: 'white',
		icon: <SiPrisma />,
	},
	postgres: {
		title: 'PostgreSQL',
		bg: 'black',
		fg: 'white',
		icon: <SiPostgresql />,
	},
	mongo: {
		title: 'MongoDB',
		bg: 'black',
		fg: 'white',
		icon: <SiMongodb />,
	},
	express: {
		title: 'Express',
		bg: 'black',
		fg: 'white',
		icon: <SiExpress />,
	},
	reactQuery: {
		title: 'React Query',
		bg: 'black',
		fg: 'white',
		icon: <SiReactquery />,
	},
	shadcn: {
		title: 'ShanCN UI',
		bg: 'black',
		fg: 'white',
		icon: <SiShadcnui />,
	},
	aceternity: {
		title: 'Aceternity',
		bg: 'black',
		fg: 'white',
		icon: <AceTernityLogo />,
	},
	tailwind: {
		title: 'Tailwind',
		bg: 'black',
		fg: 'white',
		icon: <SiTailwindcss />,
	},
	docker: {
		title: 'Docker',
		bg: 'black',
		fg: 'white',
		icon: <SiDocker />,
	},
	yjs: {
		title: 'Y.js',
		bg: 'black',
		fg: 'white',
		icon: (
			<span>
				<strong>Y</strong>js
			</span>
		),
	},
	firebase: {
		title: 'Firebase',
		bg: 'black',
		fg: 'white',
		icon: <SiFirebase />,
	},
	sockerio: {
		title: 'Socket.io',
		bg: 'black',
		fg: 'white',
		icon: <SiSocketdotio />,
	},
	js: {
		title: 'JavaScript',
		bg: 'black',
		fg: 'white',
		icon: <SiJavascript />,
	},
	ts: {
		title: 'TypeScript',
		bg: 'black',
		fg: 'white',
		icon: <SiTypescript />,
	},
	vue: {
		title: 'Vue.js',
		bg: 'black',
		fg: 'white',
		icon: <SiVuedotjs />,
	},
	react: {
		title: 'React.js',
		bg: 'black',
		fg: 'white',
		icon: <RiReactjsFill />,
	},
	sanity: {
		title: 'Sanity',
		bg: 'black',
		fg: 'white',
		icon: <SiSanity />,
	},
	spline: {
		title: 'Spline',
		bg: 'black',
		fg: 'white',
		icon: <SiThreedotjs />,
	},
	gsap: {
		title: 'GSAP',
		bg: 'black',
		fg: 'white',
		icon: '',
	},
	framerMotion: {
		title: 'Framer Motion',
		bg: 'black',
		fg: 'white',
		icon: <TbBrandFramerMotion />,
	},
	supabase: {
		title: 'Supabase',
		bg: 'black',
		fg: 'white',
		icon: <SiSupabase />,
	},
};
export type Project = {
	id: string;
	category: string;
	title: string;
	src: string;
	screenshots: string[];
	skills: { frontend: Skill[]; backend: Skill[] };
	content: React.ReactNode | any;
	github?: string;
	live: string;
};

const projects: Project[] = [
	{
		id: 'orbit-devops',
		category: 'Web / Events',
		title: 'Orbit | DevOps Event Website',
		src: `${BASE_PATH}/orbit/cover.png`,
		screenshots: [
			`${BASE_PATH}/orbit/1.png`,
			`${BASE_PATH}/orbit/2.png`,
			`${BASE_PATH}/orbit/3.png`,
		],
		skills: {
			frontend: [
				PROJECT_SKILLS.react,
				PROJECT_SKILLS.js,
				PROJECT_SKILLS.tailwind,
			],
			backend: [PROJECT_SKILLS.firebase],
		},
		live: 'https://orbit.tn',
		// github: "https://github.com/Adam-BH/orbit-website",
		content: (
			<div className="space-y-6">
				<SlideShow
					images={[
						`${BASE_PATH}/orbit/1.png`,
						`${BASE_PATH}/orbit/2.png`,
						`${BASE_PATH}/orbit/3.png`,
					]}
				/>

				<div className="space-y-3">
					<TypographyH3>Orbit | DevOps Event Website</TypographyH3>

					<TypographyP>
						I developed the official platform for <strong>Orbit</strong>, a
						DevOps event organized by <strong>IEEE CS INSAT</strong>. The
						website acted as the central hub for the event, presenting
						information, schedules, and handling participant registrations.
					</TypographyP>

					<TypographyP>
						The event featured <strong>DevOps & MLOps workshops</strong>, an{' '}
						<strong>Ideathon</strong>, and a <strong>DevOps competition</strong>
						. The platform allowed participants to securely create accounts,
						register for specific tracks, and upload their CVs directly through
						the system.
					</TypographyP>

					<TypographyP>
						I also built a dedicated <strong>admin dashboard</strong> to manage
						and track registrations in real time, giving organizers full
						visibility over workshop enrollments, ideathon teams, and
						competition applicants.
					</TypographyP>

					<TypographyP>
						<strong>Tech Stack:</strong> React for the frontend, Firebase for
						authentication, database management, and secure file storage.
					</TypographyP>
				</div>
			</div>
		),
	},
];

export default projects;
