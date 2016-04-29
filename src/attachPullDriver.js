import {ReplaySubject} from 'rx'
import {makeRequest$, attachDispose} from './attachPull'

export const attachPullDriver = (driver, helperName) =>
  (request$) => {
    var subs = []
    let response$$ = driver(request$)
    response$$[helperName] = (request, sampler$) => {
      let request$ = makeRequest$(request, sampler$)
      let sink = new ReplaySubject(1)
      subs.push(request$.subscribe(sink))
      return driver(sink)
    }
    return attachDispose(response$$, subs)
  }