import { join } from 'path';

const { env } = process;

const TEST = false;
const PROFILE_LOCATION = env.PROFILE_LOCATION || join(env.HOME, '.dockSwitcher');
const BACKUP_LOCATION = env.PROFILE_LOCATION || join(PROFILE_LOCATION, 'backups');
const REAL_DOCK_FILE_LOCATION = join(env.HOME, 'Library', 'Preferences', 'com.apple.dock.plist');
const DOCK_FILE_LOCATION = env.DOCK_FILE_LOCATION ||
    TEST ? join(process.cwd(), 'testDockFile.plist') : REAL_DOCK_FILE_LOCATION;

const ACTIVE_PROFILE_NAME_LOCATION = env.ACTIVE_PROFILE_NAME_LOCATION || join(PROFILE_LOCATION, 'profile');
const VERBOSE = !!env.VERBOSE;
const DOCK_KILL_WAIT_TIME = Number(env.DOCK_KILL_WAIT_TIME) || 2000;

const config = {
    PROFILE_LOCATION,
    BACKUP_LOCATION,
    DOCK_FILE_LOCATION,
    REAL_DOCK_FILE_LOCATION,
    ACTIVE_PROFILE_NAME_LOCATION,
    TEST,
    VERBOSE,
    DOCK_KILL_WAIT_TIME
};

export default config;
