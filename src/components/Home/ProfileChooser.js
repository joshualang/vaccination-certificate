import React, { useState, useRef } from 'react'
import styled from 'styled-components/macro'
import useHeight from '../../hooks/useHeight'
import SectionText from '../common/text/SectionText'
import Line from '../common/Line'

export default function ProfileChooser({
  profiles,
  currentProfileId,
  setProfileId,
}) {
  const [isProfileChooserOpen, setIsProfileChooserOpen] = useState(false)

  const profilesEl = useRef()
  const maxHeight = useHeight(profilesEl)
  function onUserClick() {
    setIsProfileChooserOpen(!isProfileChooserOpen)
  }
  const currentProfileIndex = profiles.findIndex(
    profile => profile._id === currentProfileId
  )
  return (
    <div>
      <User onClick={() => onUserClick()}>
        <Profiles
          ref={profilesEl}
          active={isProfileChooserOpen}
          maxHeight={maxHeight}
        >
          <SectionText>{profiles[currentProfileIndex].name}</SectionText>
          <Line></Line>
          {profiles.map(item => (
            <SectionText
              onClick={() => setProfileId(item._id)}
              style={{ marginBottom: '8px', cursor: 'pointer' }}
              key={item._id}
            >
              {item.name}
            </SectionText>
          ))}
        </Profiles>
        <div
          className={isProfileChooserOpen ? 'arrow-down active' : 'arrow-down'}
        />
      </User>
    </div>
  )
}

const User = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .arrow-down {
    width: 20px;
    height: 20px;
    position: relative;
  }
  .arrow-down.active {
    margin-bottom: 8px;
  }

  .arrow-down:before,
  .arrow-down:after {
    content: '';
    display: block;
    width: 10px;
    height: 3px;
    background: black;
    position: absolute;
    top: 10px;
    transition: transform 0.5s;
  }

  .arrow-down:before {
    right: 5px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    transform: rotate(45deg);
  }

  .arrow-down:after {
    right: 0px;
    transform: rotate(-45deg);
  }

  .arrow-down.active:before {
    transform: rotate(-45deg);
  }

  .arrow-down.active:after {
    transform: rotate(45deg);
  }
`
const Profiles = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  transition: height 0.3s ease-in-out;
  height: ${props => (props.active ? props.maxHeight + 'px' : '21px')};
`
