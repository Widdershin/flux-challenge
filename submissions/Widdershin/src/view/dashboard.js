import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function last (array) {
  return array[array.length - 1];
}

function planetMonitor (planet) {
  return h('h1.css-planet-monitor', `Obi Wan is currently on ${planet.name}`);
}

function scrollButtons (sithLords) {
  let downButtonExtraClasses = '';

  const actualSithLords = sithLords.filter(sithLord => !!sithLord);

  if (actualSithLords.length < 5 || !last(actualSithLords).apprentice.id) {;
    downButtonExtraClasses = '.css-button-disabled';
  }

  return (
    h('.css-scroll-buttons', [
      h('button.css-button-up'),
      h('button.css-button-down' + downButtonExtraClasses)
    ])
  );
}

function sithSlot (sithLord) {
  if (sithLord === null) {;
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
      scrollButtons(sithLords)
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

