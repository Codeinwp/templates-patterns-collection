const untrailingSlashIt = ( str ) => str.replace( /\/$/, '' );
const trailingSlashIt = ( str ) => untrailingSlashIt( str ) + '/';

export { trailingSlashIt, untrailingSlashIt };
