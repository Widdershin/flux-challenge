import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

export default function sithDashboard ({DOM}) {
  return {
    DOM: Rx.Observable.just([]).map(sithLords => (
      h('.sithLords', sithLords.join())
    ))
  };
}
