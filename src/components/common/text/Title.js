import styled from 'styled-components/macro'
import colors from '../styles/colors'

export default styled.h3`
  font-family: Helvetica, sans-serif;
  font-size: 1.125rem;
  text-align: ${props => props.textAlign || 'inital'};
  color: ${props => props.color || colors.balck};
  margin: 0;
  cursor: ${props => (props.onClick ? 'pointer' : 'inherit')};
`
