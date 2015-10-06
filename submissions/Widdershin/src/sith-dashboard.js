import {Rx} from '@cycle/core';
import {DOM} from 'rx-dom';

import dashboardView from './view/dashboard';

Rx.DOM = DOM;

const PLANET_SOCKET_ADDRESS = 'ws://localhost:4000';
const FIRST_SITH_ID = 3616;

export default function sithDashboard ({DOM, HTTP}) {
  const planet$ = Rx.DOM.fromWebSocket(PLANET_SOCKET_ADDRESS)
    .map(message => JSON.parse(message.data))
    .startWith({id: 0, name: 'Earth'});

  HTTP
    .mergeAll()
    .map(response => JSON.parse(response.text))
    .forEach(console.log.bind(console, 'sith response'));

  return {
    DOM: dashboardView(planet$),
    HTTP: Rx.Observable.just('http://localhost:3000/dark-jedis')
  };
}
