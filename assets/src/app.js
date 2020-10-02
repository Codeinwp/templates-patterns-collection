import './style.scss'
import reducer from './store/reducer'
import actions from './store/actions'
import selectors from './store/selectors'
import Onboarding from './Components/Main'

import { registerStore } from '@wordpress/data'
import { render } from '@wordpress/element'

registerStore('neve-onboarding', {
  reducer,
  actions,
  selectors
})

const Root = () => {
  return (
    <div className='tiob-wrap'>
      <Onboarding/>
    </div>
  )
}
render(<Root/>, document.getElementById('tpc-app'))
