import { Ceremony } from '@service/entity';
import { Stage } from '@service/value';

export const Route = {
  home: '/',
  [Stage.Nomination]: function (ceremony: Ceremony, index: number) {
    return `/${ceremony.year}/nomination/${ceremony.departments[index]}`;
  },
  [Stage.Voting]: function (ceremony: Ceremony, index: number | 'start' | 'thanks') {
    if (index === 'start' || index === 'thanks') {
      return `/${ceremony.year}/voting/${index}`;
    } else {
      return `/${ceremony.year}/voting/${ceremony.departments[index]}`;
    }
  },
  [Stage.Award]: function (ceremony: Ceremony) {
    return `/${ceremony.year}/award`;
  },
};

export const defaultRoute = function (ceremony: Ceremony, at: Date, logged: boolean): string {
  switch (ceremony.stageAt(at)) {
    case Stage.Nomination:
      return Route[Stage.Nomination](ceremony, 0);
    case Stage.Voting:
      if (logged) {
        return Route[Stage.Voting](ceremony, 0);
      } else {
        return Route[Stage.Voting](ceremony, 'start');
      }
    case Stage.Award:
      return Route[Stage.Award](ceremony);
    default:
      return Route.home;
  }
};
