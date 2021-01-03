import { mount, shallow } from 'enzyme'

import Nav from '.'

describe('Nav', () => {
  it('Should mount', () => {
    const result = shallow(<Nav />).contains(<div>Lystly</div>)

    expect(result).toBeTruthy()
  })
})
