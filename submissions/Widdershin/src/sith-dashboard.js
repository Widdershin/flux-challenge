import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import {DOM} from 'rx-dom';
import TimeTravel from 'cycle-time-travel';
import _ from 'lodash';

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

  const upButtonClick$ = DOM.select('.css-button-up').events('click');
  const downButtonClick$ = DOM.select('.css-button-down').events('click');

  const scroll$ = Rx.Observable.merge(
    upButtonClick$.map(_ => -1),
    downButtonClick$.map(_ => +1)
  ).scan((total, change) => total + change)
   .startWith(0);

  const sithRange$ = scroll$.map(currentScroll => _.range(currentScroll, currentScroll + 5));

  const sith$ = HTTP
    .flatMap(
      response$ => response$,
      (response$, response) => ({response, request: response$.request})
    )
    .scan((sithLords, {response, request}) => {
      let sith = JSON.parse(response.text);

      sithLords[request.index] = sith;

      return sithLords;
    }, {})
    .startWith({});

  const sithToDisplay$ = Rx.Observable.combineLatest(sith$, sithRange$, (sith, sithRange) => {
    return sithRange.map(index => sith[index] || null);
  });

  function nextLookupId (indexRange, sithLords) {
    const nextLookupIndex = _.first(indexRange.filter(index => sithLords[index] === null || sithLords[index] === undefined));

    const master = sithLords[nextLookupIndex - 1];
    const apprentice = sithLords[nextLookupIndex + 1];

    if (master) {
      return {index: nextLookupIndex, id: master.apprentice.id};
    }

    if (apprentice) {
      return {index: nextLookupIndex, id: apprentice.master.id};
    }
  }

  const sithRequest$ = Rx.Observable.combineLatest(sithRange$, sith$,
      (range, sithLords) => nextLookupId(range, sithLords)
    )
    .filter(request => !!request)
    .filter(request => !!request.id)
    .map(request => Object.assign({}, {url: fetchSith(request.id)}, request))
    .startWith({index: 0, id: FIRST_SITH_ID, url: fetchSith(FIRST_SITH_ID)});

  const timeTravel = TimeTravel(DOM, [
    {stream: HTTP.mergeAll(), label: 'HTTP'},
    {stream: sithRange$, label: 'sithRange$'},
    {stream: sithToDisplay$, label: 'sithToDisplay$', feature: true},
    {stream: sith$, label: 'sith$', feature: false},
    {stream: planet$, label: 'planet$'},
    {stream: scroll$, label: 'scroll$'},
    {stream: sithRequest$, label: 'sithRequest$'}
  ]);

  return {
    DOM: Rx.Observable.combineLatest(
      dashboardView(timeTravel.timeTravel.planet$, timeTravel.timeTravel.sithToDisplay$),
      timeTravel.DOM,
      function (dashboard, bar) { return h('.app-container', [dashboard, bar]); }
    ),
    HTTP: sithRequest$
  };
}
