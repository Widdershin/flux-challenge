import {Rx} from '@cycle/core';
import {DOM} from 'rx-dom';
import {h} from '@cycle/dom';

Rx.DOM = DOM;

const PLANET_SOCKET_ADDRESS = 'ws://localhost:4000';

export default function sithDashboard ({DOM}) {
  const planet$ = Rx.DOM.fromWebSocket(PLANET_SOCKET_ADDRESS)
    .map(message => JSON.parse(message.data))
    .startWith({id: 0, name: 'Earth'});

  return {
    DOM: planet$.map(planet => {
      return (
        h('.css-root', [
          h('h1.css-planet-monitor', `Obi Wan is currently on ${planet.name}`)
        ])
      );
    })
  };
}
