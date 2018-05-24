import { timer } from 'rxjs/observable/timer';
import { combineLatest } from 'rxjs/observable/combineLatest';
import {startWith} from 'rxjs/operators/startWith';
import {switchMap} from 'rxjs/operators/switchMap';
import {map} from 'rxjs/operators/map';

const options = timer(1000, 4000);
const paginator = timer(2000, 4000);
const filters = timer(3000, 4000);
const sorters = timer(4000, 4000);

const main = combineLatest(paginator, filters, sorters);
const combined = combineLatest(options, main);

const subscribe = combined.subscribe(
  ([optionsData, [paginatorData, filtersData, sortersData]]) => {
    let result = {
      optionsData,
      paginatorData,
      filtersData,
      sortersData
    };

    console.log("_________________________");
    console.log(result);
  }
);
