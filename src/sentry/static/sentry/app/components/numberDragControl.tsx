import React from 'react';
import styled from '@emotion/styled';

import {IconArrow} from 'app/icons';
import space from 'app/styles/space';

type NumberDragControlProps = {
  onChange: (delta: number, event: React.MouseEvent<HTMLDivElement>) => void;
  axis?: 'x' | 'y';
};

type Props = Omit<React.HTMLAttributes<HTMLDivElement>, keyof NumberDragControlProps> &
  NumberDragControlProps;

type State = {
  isClicked: boolean;
};

class NumberDragControl extends React.Component<Props, State> {
  state: State = {
    isClicked: false,
  };

  render() {
    const {onChange, axis, ...props} = this.props;
    const isX = (axis ?? 'x') === 'x';

    return (
      <Wrapper
        {...props}
        onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
          if (event.button !== 0) {
            return;
          }
          event.currentTarget.requestPointerLock();
          this.setState({isClicked: true});
        }}
        onMouseUp={() => {
          document.exitPointerLock();
          this.setState({isClicked: false});
        }}
        onMouseMove={(event: React.MouseEvent<HTMLDivElement>) =>
          this.state.isClicked &&
          onChange(isX ? event.movementX : event.movementY * -1, event)
        }
        isActive={this.state.isClicked}
        isX={isX}
      >
        <IconArrow direction={isX ? 'left' : 'up'} size="8px" />
        <IconArrow direction={isX ? 'right' : 'down'} size="8px" />
      </Wrapper>
    );
  }
}

const Wrapper = styled('div')<{isActive: boolean; isX: boolean}>`
  display: grid;
  padding: ${space(0.5)};
  ${p =>
    p.isX
      ? 'grid-template-columns: max-content max-content'
      : 'grid-template-rows: max-content max-content'};
  cursor: ${p => (p.isX ? 'ew-resize' : 'ns-resize')};
  color: ${p => (p.isActive ? p.theme.gray800 : p.theme.gray500)};
  background: ${p => p.isActive && p.theme.gray200};
  border-radius: 2px;
`;

export default NumberDragControl;
