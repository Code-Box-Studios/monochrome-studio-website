import * as migration_20260908_080146_initial from './20260908_080146_initial';

export const migrations = [
  {
    up: migration_20260908_080146_initial.up,
    down: migration_20260908_080146_initial.down,
    name: '20260908_080146_initial'
  },
];
