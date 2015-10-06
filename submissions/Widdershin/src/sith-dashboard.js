import {Rx} from '@cycle/core';
import {DOM} from 'rx-dom';

import dashboardView from './view/dashboard';

Rx.DOM = DOM;

Rx.config.longStackSupport = true;

const PLANET_SOCKET_ADDRESS = 'ws://localhost:4000';
const FIRST_SITH_ID = 3616;
const SITH_ENDPOINT = 'http://localhost:3000/dark-jedis';

function last (array) {
  return array[array.length - 1];
}

function fetchSith (sithId) {
  return `${SITH_ENDPOINT}/${sithId}`;
}

export default function sithDashboard ({DOM, HTTP}) {
  const planet$ = Rx.DOM.fromWebSocket(PLANET_SOCKET_ADDRESS)
    .map(message => JSON.parse(message.data))
    .startWith({id: 0, name: 'Earth'});

  const sith$ = HTTP
    .mergeAll()
    .map(response => JSON.parse(response.text))
    .scan((sithLords, sith) => {
      return sithLords.concat([sith]);
    }, [])
    .map(sithLords => Array.from(sithLords))
    .startWith([{}, {}, {}, {}, {}]);

  const sithRequest$ = sith$
    .map(last)
    .filter(sithLord => sithLord !== undefined)
    .filter(sithLord => 'apprentice' in sithLord && !!sithLord.apprentice.id)
    .map(sithLord => sithLord.apprentice.id)
    .startWith(FIRST_SITH_ID)
    .map(fetchSith);

  return {
    DOM: dashboardView(planet$, sith$),
    HTTP: sithRequest$
  };
}
