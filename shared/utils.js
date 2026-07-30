/**
 * Loop through an Elementor element and apply the function.
 *
 * @param {any} element  Elementor element.
 * @param {*} applyFunc The function to apply on each child element.
 */
const loopElementorElement = ( element, applyFunc ) => {
	applyFunc( element );

	element?.elements?.forEach( ( item ) => {
		loopElementorElement( item, applyFunc );
	} );
};

/**
 * Clean the template content from unnecessary data.
 *
 * @param {any} templateContent The template content.
 * @param {Function} cleanFunc The function to apply on each element.
 */
export const cleanTemplateContent = ( templateContent, cleanFunc ) => {
	templateContent?.content?.forEach?.( ( item ) => {
		loopElementorElement( item, cleanFunc );
	} );
};

/**
 * License tiers entitled to Templates Cloud.
 */
export const TEMPLATES_CLOUD_TIERS = [
	6,
	17,
	23,
	5,
	9,
	14,
	20,
	1,
	7,
	12,
	18,
	3,
	8,
	13,
	19,
];

/**
 * Check if a license tier is entitled to Templates Cloud.
 *
 * @param {number|string} tier The tier key returned by the licensing API.
 * @return {boolean} Whether the tier includes Templates Cloud.
 */
export const isTemplatesCloudTier = ( tier ) => {
	const parsed = Number( tier );

	return Number.isInteger( parsed ) && TEMPLATES_CLOUD_TIERS.includes( parsed );
};

/**
 * Check if the license itself is valid, regardless of its tier.
 *
 * @param {Object} license The license data.
 * @return {boolean} Whether the license is valid.
 */
export const isLicenseValid = ( license ) =>
	'valid' === license?.valid || 'valid' === license?.license;
