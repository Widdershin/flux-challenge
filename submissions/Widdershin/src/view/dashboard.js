import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function planetMonitor (planet) {
  return h('h1.css-planet-monitor', `Obi Wan is currently on ${planet.name}`);
}

function scrollButtons () {
  return (
    h('.css-scroll-buttons', [
      h('button.css-button-up'),
      h('button.css-button-down')
    ])
  );
}

function sithSlot (sithLord) {
  if (Object.keys(sithLord).length === 0) {
    return h('li.css-slot');
  }

  return (
    h('li.css-slot', [
      h('h3', sithLord.name),
      h('h6', `Homeworld: ${sithLord.homeworld.name}`)
    ])
  );
}

function sithSlots (sithLords) {
  return (
    h('ul.css-slots', sithLords.map(sithSlot))
  );
}

function sithList (sithLords) {
  return (
    h('section.css-scrollable-list', [
      sithSlots(sithLords),
      scrollButtons()
    ])
  );
}

export default function dashboardView (planet$, sith$) {
  return Rx.Observable.combineLatest(planet$, sith$, (planet, sithLords) =>
    h('.css-root', [
      planetMonitor(planet),

      sithList(sithLords)
    ])
  );
}

