import { copyFile, exists, readdir, readJson, writeJson } from 'fs-extra';
import config from './config';
import { join } from 'path';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const sha1File = util.promisify(require('sha1-file'));

export async function getProfileFileNames() {
    const files = await readdir(config.PROFILE_LOCATION);

    return files.reduce(
        (profiles, file) => file.match(/\.plist$/) ? [
            ...profiles,
            file
        ] : profiles
        , []);
}

function getProfileFromFileName(
    fileName,
    activeProfile
) {
    const location = join(config.PROFILE_LOCATION, fileName);
    const name = fileName.match(/^(.*)\.plist$/)[1];
    const active = activeProfile.name === name;

    return { name, active, location };
}


export async function getProfiles(
    activeProfilePromise = getActiveProfile()
) {
    const activeProfile = await activeProfilePromise;
    const profileNames = await getProfileFileNames();

    return profileNames.map(file => getProfileFromFileName(file, activeProfile));
}

export async function getActiveProfile() {
    if (!await exists(config.DOCK_FILE_LOCATION) || !await exists(config.ACTIVE_PROFILE_NAME_LOCATION)) {
        return null;
    }

    const { activeProfileName } = await readJson(config.ACTIVE_PROFILE_NAME_LOCATION);

    return (await getProfiles({ name: activeProfileName })).find(({ active }) => active) || null;
}

export async function createDefaultProfile(
) {
    await copyFile(config.DOCK_FILE_LOCATION, join(config.PROFILE_LOCATION, 'default.plist'));
    await writeJson(config.ACTIVE_PROFILE_NAME_LOCATION, {
        activeProfileName: 'default'
    });
}

export async function cloneProfile(newProfileName, profilePromise = getActiveProfile()) {
    const profile = await profilePromise;

    await copyFile(profile.location, join(config.PROFILE_LOCATION, `${newProfileName}.plist`));
}

export async function updateProfile(
    profilePromise = getActiveProfile()
) {
    const profile = await profilePromise;

    if (!profile) {
        throw new Error(`Cannot find profile to update`);
    }

    await killDock();
    await copyFile(config.DOCK_FILE_LOCATION, profile.location);

    if (!await verifyProfile()) {
        throw new Error(`Updating profile ${profile.name} failed`);
    }
}

export async function verifyProfile(
    profilePromise = getActiveProfile()
) {
    const profile = await profilePromise;
    await killDock();
    return await sha1File(config.DOCK_FILE_LOCATION) === await sha1File(profile.location);
}

async function killDock() {
    await exec('killall Dock');

    await new Promise(r => setTimeout(r, config.DOCK_KILL_WAIT_TIME));
}

export async function activateProfile(profileName) {
    const profiles = await getProfiles();
    const profile = profiles.find(({ name }) => name === profileName);

    if (!profile) {
        throw new Error(`Cannot find profile ${profileName}`);
    }

    if (profile.active) {
        throw new Error(`Profile ${profileName} already active`);
    }

    await updateProfile();
    await copyFile(profile.location, config.DOCK_FILE_LOCATION);

    if (!await verifyProfile(profile)) {
        throw new Error(`Activating profile ${profileName} failed`);
    }

    await writeJson(config.ACTIVE_PROFILE_NAME_LOCATION, {
        activeProfileName: profileName
    });
}
