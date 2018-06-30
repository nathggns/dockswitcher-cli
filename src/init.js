import { copyFile, exists, mkdir } from 'fs-extra';
import config from './config';
import { createDefaultProfile, getActiveProfile } from './profiles';

export default async function init(
) {
    if (!await exists(config.PROFILE_LOCATION)) {
        await mkdir(config.PROFILE_LOCATION);
    }

    if (!await exists(config.BACKUP_LOCATION)) {
        await mkdir(config.BACKUP_LOCATION);
    }

    if (config.TEST && !await exists(config.DOCK_FILE_LOCATION)) {
        await copyFile(config.REAL_DOCK_FILE_LOCATION, config.DOCK_FILE_LOCATION);
    }

    if (!await getActiveProfile()) {
        await createDefaultProfile();
    }
}
