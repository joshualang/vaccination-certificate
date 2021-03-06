import React from 'react'
import styled from 'styled-components/macro'
import Headline from '../common/text/Headline'
import menu from '../../img/menu.svg'
import plus from '../../img/plus.svg'
import { Link } from 'react-router-dom'

export default function Header({ onMenuClick }) {
  return (
    <HeaderStyled>
      <div>
        <img onClick={() => onMenuClick()} src={menu} alt="menu"></img>
        <Link to="addvaccination">
          <img width="18px" height="18px" src={plus} alt="more"></img>
        </Link>
      </div>
      <Headline>Dein Impfpass</Headline>
    </HeaderStyled>
  )
}
const HeaderStyled = styled.header`
  position: absolute;
  top: 0;
  height: 20vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  div {
    position: fixed;
    top: 0;
    width: 100%;
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-self: flex-start;
  }
`
