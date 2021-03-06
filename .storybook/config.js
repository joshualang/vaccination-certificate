import { configure } from '@storybook/react'
import { load, addDecorator } from '@storybook/react'
import styled from 'styled-components/macro'
import React from 'react'
import { withInfo } from '@storybook/addon-info'
import GlobalStyles from '../src/components/common/styles/GlobalStyles'
import { BrowserRouter as Router } from 'react-router-dom'

//add-ons
import '@storybook/addon-knobs/register'
import 'storybook-addon-jsx/register'
import '@storybook/addon-a11y/register'
// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module)
addDecorator(withInfo)
addDecorator(storyFn => (
  <>
    <GlobalStyles />
    <Router>
      <Wrapper>{storyFn()}</Wrapper>
    </Router>
  </>
))

const Wrapper = styled.div`
  max-width: 500px;
  max-height: 500px;
  border: 1px solid hotpink;
  padding: 20px;
`
