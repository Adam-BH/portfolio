const config = {
	title: 'Adam Bhouri | Software Engineering Student',
	description: {
		long: "Engineering student passionate about Artificial Intelligence, data-driven systems, and building technology with real-world impact. I enjoy transforming complex problems into structured solutions, whether through AI models, full-stack applications, or innovative system design. Currently involved in entrepreneurial and social-impact projects, leading teams from ideation to execution. Interested in AI engineering, intelligent systems, and scalable tech solutions.",
		short:
			'Engineering student passionate about AI, data-driven systems, and building impactful technology. I enjoy turning complex problems into structured, scalable solutions through intelligent systems and software development.',
	},
	keywords: [
		"Adam Bhouri",
		"INSAT",
		"Engineering Student",
		"AI",
		"Artificial Intelligence",
		"Machine Learning",
		"Data-Driven Systems",
		"Software Development",
		"Full-Stack Development",
		"Systems Design",
		"Scalable Solutions",
		"Tech Builder",
		"Intelligent Systems",
		"Problem Solver",
		"Entrepreneurship",
		"Project Leadership",
		"Enactus",
		"Social Impact",
		"Hackathons",
		"Innovation",
		"Technology for Impact",
		"Digital Systems",
		"Computer Vision",
		"Data Analysis"
],
	author: 'Adam Bhouri',
	email: 'adam.bhouri@gmail.com',
	site: 'https://adambhouri.me',

	// for github stars button
	githubUsername: 'Adam-BH',
	githubRepo: 'portfolio',

	get ogImg() {
		return this.site + '/assets/seo/og-image.png';
	},
	social: {
		twitter: '',
		linkedin: 'https://www.linkedin.com/in/adambhouri/',
		instagram: 'https://www.instagram.com/adambhouri/',
		facebook: 'https://www.facebook.com/b7ouriii',
		github: 'https://github.com/Adam-BH',
	},
};
export { config };
