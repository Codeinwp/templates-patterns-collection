/**
 * WordPress dependencies
 */
const { Path, SVG } = wp.primitives;

const icon = () => {
	return (
		<SVG
			width="100"
			height="100"
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="tpc-template-cloud-icon"
		>
			<Path
				d="M95.0264 100H4.97356C2.22797 100 0 97.772 0 95.0264V4.97356C0 2.22797 2.22797 0 4.97356 0H95.0264C97.772 0 100 2.22797 100 4.97356V95.0264C100 97.772 97.772 100 95.0264 100Z"
				fill="#0366D6"
			/>
			<Path
				d="M82.6941 86.7448V30.8205V18.4653H70.3502H14.4146L26.7584 30.8205H70.3502V74.401L82.6941 86.7448Z"
				fill="white"
			/>
			<Path
				d="M42.2416 58.9291L42.2528 71.183L53.2352 82.1653L53.1902 47.9806L18.9941 47.9355L29.9765 58.9066L42.2416 58.9291Z"
				fill="white"
			/>
		</SVG>
	);
};

export const iconBlack = () => {
	return (
		<SVG
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M22.8063 24H1.19365C0.534714 24 0 23.4653 0 22.8063V1.19365C0 0.534714 0.534714 0 1.19365 0H22.8063C23.4653 0 24 0.534714 24 1.19365V22.8063C24 23.4653 23.4653 24 22.8063 24Z"
				fill="#14171C"
			/>
			<Path
				d="M19.8466 20.8187V7.39687V4.43164H16.884H3.45947L6.422 7.39687H16.884V17.8562L19.8466 20.8187Z"
				fill="white"
			/>
			<Path
				d="M10.138 14.1429L10.1407 17.0838L12.7764 19.7195L12.7656 11.5152L4.55859 11.5044L7.19435 14.1375L10.138 14.1429Z"
				fill="white"
			/>
		</SVG>
	);
};

export default icon;
