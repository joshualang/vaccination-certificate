import React from 'react'
import styled from 'styled-components/macro'
import Title from './text/Title'

export default function ToggleSwitchInput({ children, checked, name }) {
  return (
    <Switch>
      <label htmlFor={children}>
        <Title>{children}</Title>
      </label>
      <Background active={checked} className="switch">
        <input
          id={children}
          type="checkbox"
          name={name}
          defaultChecked={checked}
        />
        <div></div>
      </Background>
    </Switch>
  )
}

const Switch = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  padding-right: 0.1em;

  .switch input {
    position: absolute;
    opacity: 0;
  }
  .switch div {
    height: 1.1em;
    width: 1.1em;
    border-radius: 50%;
    transform: translate(-0.05em, -0.05em);
    background: #fff;
    box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.3);
    transition: all 200ms;
  }

  .switch input:checked + div {
    transform: translate3d(100%, 0, 0);
  }
`

const Background = styled.label`
  display: inline-block;
  font-size: 1em;
  height: 1em;
  width: 2em;
  background: ${props => (props.active ? 'green' : 'crimson')};
  border-radius: 1em;
`
