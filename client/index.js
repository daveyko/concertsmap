import React from 'react'
import ReactDOM from 'react-dom'
import Home from './Home.jsx'
require('babel-core/register');
require('babel-polyfill');

ReactDOM.render(
  <Home />,
  document.getElementById('home')
)
