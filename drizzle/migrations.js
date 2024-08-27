// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_productive_franklin_richards.sql';
import m0001 from './0001_watery_boomerang.sql';
import m0002 from './0002_friendly_sebastian_shaw.sql';
import m0003 from './0003_bumpy_jack_power.sql';
import m0004 from './0004_military_imperial_guard.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  