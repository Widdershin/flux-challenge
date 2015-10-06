import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import sithDashboard from './src/sith-dashboard';

const drivers = {
  DOM: makeDOMDriver('.app')
};

run(sithDashboard, drivers);
