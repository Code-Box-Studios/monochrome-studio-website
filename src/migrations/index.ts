import * as migration_20260908_080146_initial from './20260908_080146_initial';
import * as migration_20260908_090357_faq_note_count_token from './20260908_090357_faq_note_count_token';

export const migrations = [
  {
    up: migration_20260908_080146_initial.up,
    down: migration_20260908_080146_initial.down,
    name: '20260908_080146_initial',
  },
  {
    up: migration_20260908_090357_faq_note_count_token.up,
    down: migration_20260908_090357_faq_note_count_token.down,
    name: '20260908_090357_faq_note_count_token'
  },
];
