import { Icon } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import classnames from 'classnames';
import SVG from '../utils/svg';

const Search = ( {
	onSearch,
	query,
	handleSubmit,
	step,
	deleteQuery,
	label,
} ) => {
	return (
		<form onSubmit={ handleSubmit } className="ob-search-form">
			{ label && <label htmlFor="ob-search-ss">{ label }</label> }
			<div className="ob-search-wrap">
				<Icon className="search-icon" icon={ SVG.search } />
				<input
					id="ob-search-ss"
					type="text"
					value={ query }
					onChange={ ( e ) => {
						onSearch( e.target.value );
					} }
					className="search-input"
				/>
				{ step === 1 ? (
					<button
						type="submit"
						className={ classnames(
							'search-button',
							query ? 'active' : ''
						) }
					>
						<Icon icon={ SVG.arrow } width={ 17 } height={ 12 } />
					</button>
				) : (
					<Icon
						className={ classnames(
							'remove-button',
							query ? 'active' : ''
						) }
						onClick={ deleteQuery }
						icon={ SVG.delete }
						width={ 16 }
						height={ 16 }
					/>
				) }
			</div>
		</form>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getSearchQuery, getCurrentStep } = select( 'ti-onboarding' );
		return {
			query: getSearchQuery(),
			step: getCurrentStep(),
		};
	} ),
	withDispatch( ( dispatch, { step } ) => {
		const { setSearchQuery, setCategory, setOnboardingStep } = dispatch(
			'ti-onboarding'
		);
		return {
			onSearch: ( query ) => setSearchQuery( query ),
			deleteQuery: () => setSearchQuery( '' ),
			handleSubmit: ( e ) => {
				e.preventDefault();
				setCategory( 'all' );
				if ( step === 1 ) {
					setOnboardingStep( 2 );
				}
			},
		};
	} )
)( Search );
