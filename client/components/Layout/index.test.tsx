import '@testing-library/jest-dom/extend-expect'

import { HeadInner } from '.'
import React from 'react'
import { render } from '@testing-library/react'

describe('Layout', () => {
  it('Should contain title ', () => {
    const title = 'Foo'
    const description = 'Bar'
    const { container, debug, getByText } = render(
      <HeadInner title={title} description={description} />
    )
    const titleText = getByText(title).innerHTML
    const metaDescription = container
      .querySelector(`meta[name=description]`)
      .getAttribute('content')

    expect(titleText).toEqual(title)
    expect(metaDescription).toEqual(description)
  })
})
