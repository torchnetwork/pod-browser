import React from 'react';
import { shallow } from 'enzyme';

import HelloWorld from './index';


test('renders a container with some typography and a button', () => {
  const wrap = shallow(<HelloWorld />);
  expect(wrap).toMatchSnapshot();
});
