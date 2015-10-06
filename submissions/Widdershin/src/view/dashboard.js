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

function sithList () {
  return (
    h('section.css-scrollable-list', [
      sithSlots([]),
      scrollButtons()
    ])
  );
}

export default function dashboardView (planet$) {
  return planet$.map(planet =>
    h('.css-root', [
      planetMonitor(planet),

      sithList()
    ])
  );
}
