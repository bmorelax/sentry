import React from 'react';
import {storiesOf} from '@storybook/react';
import styled from '@emotion/styled';
import {select} from '@storybook/addon-knobs';
import {action} from '@storybook/addon-actions';

import NumberDragControl from 'app/components/numberDragControl';

const onChange = action('onChange');

// eslint-disable-next-line
storiesOf('Forms|Controls', module).add('NumberDragControl', () => (
  <Container>
    <NumberDragControl
      axis={select('Direction', {x: 'x', y: 'y'}, 'x')}
      onChange={delta => onChange(delta)}
    />
  </Container>
));

const Container = styled('div')`
  display: inline-block;
`;
