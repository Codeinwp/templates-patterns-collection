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
