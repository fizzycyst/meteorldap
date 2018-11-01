import React  from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import Foundation from 'foundation-sites';
import $ from 'jquery'

import App from '../imports/App.jsx';

$(document).foundation();
Meteor.startup(() => {
  console.log('Sgtarting')
  render(<App />, document.getElementById('render-target'));
});
