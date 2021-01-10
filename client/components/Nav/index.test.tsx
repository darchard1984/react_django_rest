import '@testing-library/jest-dom/extend-expect'

import Nav from '.'
import React from 'react'
import { render } from '@testing-library/react'

describe('Nav', () => {
  it('Should contain div ', () => {
    const { getByText } = render(<Nav />)

    const el = getByText('Lystly')
    expect(el.innerHTML).toEqual('Lystly')
  })
})
