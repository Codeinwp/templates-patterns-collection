/**
 * Will attach the post model to the window object if it doesn't exist.
 *
 * @param {number} elementorId Id of the page/post.
 * @return {Promise<void>}
 */
export const setPostModel = async ( elementorId ) => {
	if ( undefined !== window.tiTpc.postModel ) {
		return;
	}

	let postModel;
	if ( 'page' === window.tiTpc.postType ) {
		postModel = await new wp.api.models.Page( { id: elementorId } );
	} else {
		postModel = await new wp.api.models.Post( { id: elementorId } );
	}

	if ( undefined === postModel ) {
		return;
	}

	window.tiTpc.postModel = postModel;
	await window.tiTpc.postModel.fetch();
};

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
 * @return {any} The cleaned template content.
 */
export const cleanTemplateContent = ( templateContent, cleanFunc ) => {
	if ( undefined === templateContent.content ) {
		return templateContent;
	}

	const content = templateContent.content;

	if ( Array.isArray( content ) ) {
		content.forEach( ( item ) => {
			loopElementorElement( item, cleanFunc );
		} );
	}
};
