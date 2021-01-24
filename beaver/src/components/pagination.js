import { Button, ButtonGroup } from '@wordpress/components';

const Pagination = ( { total, current, onChange } ) => {
	if ( total < 2 ) {
		return null;
	}

	const pages = [];

	for ( let i = 0; i < total; i++ ) {
		const isCurrent = i === current;

		pages.push(
			<Button
				key={ `page-${ i }` }
				isPrimary={ isCurrent }
				disabled={ isCurrent }
				onClick={ () => onChange( i ) }
			>
				{ i + 1 }
			</Button>
		);
	}

	return <ButtonGroup className="pagination">{ pages }</ButtonGroup>;
};

export default Pagination;
