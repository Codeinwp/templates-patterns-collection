/**
 * Will attach the post model to the window object if it doesn't exist.
 *
 * @param id of the page/post
 * @returns {Promise<void>}
 */
export const setPostModel = async ( elementorId ) => {
    if ( undefined !== window.tiTpc.postModel ) {
        return;
    }

    let postModel = undefined;
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
}
