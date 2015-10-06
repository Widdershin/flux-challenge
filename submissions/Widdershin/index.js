import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';

import sithDashboard from './src/sith-dashboard';

const drivers = {
  DOM: makeDOMDriver('.app'),
  HTTP: makeHTTPDriver()
};

run(sithDashboard, drivers);
