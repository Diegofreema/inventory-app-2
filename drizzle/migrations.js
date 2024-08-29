// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_last_network.sql';
import m0001 from './0001_regular_dagger.sql';
import m0002 from './0002_woozy_shatterstar.sql';
import m0003 from './0003_sparkling_skaar.sql';
import m0004 from './0004_lying_typhoid_mary.sql';

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
  