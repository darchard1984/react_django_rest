import Nav from '.'
import React from 'react'
import { mount } from 'enzyme'

describe('Nav', () => {
  it('Should contain div ', () => {
    const wrapper = mount(<Nav />)

    expect(wrapper.find('div').text()).toEqual('Lystly')
  })
})
