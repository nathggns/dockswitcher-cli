import init from './init';
import {
    activateProfile,
    backupProfile,
    cloneProfile,
    getActiveProfile,
    getProfiles, restoreProfile,
    updateProfile,
    verifyProfile
} from './profiles';
import config from './config';

async function main() {
    const [ command, ...rawArgs ] = process.argv.slice(2);
    const args = rawArgs.filter(arg => !arg.startsWith('-'));
    const switches = rawArgs.filter(arg => arg.startsWith('-'));

    await init();

    if (config.VERBOSE) {
        console.log('DockSwitcher debug info:');
        console.log('Using config', config);
        console.log('Active profile', await getActiveProfile());
    }

    switch (command) {
        case 'activate':
            await activateProfile(args[0], switches.includes('-f'));
            break;

        case 'restore':
            if (args.length === 1) {
                await restoreProfile(args[0]);
            } else {
                await restoreProfile(args[0], parseInt(args[1]));
            }
            console.log('restored');
            break;

        case 'update':
            await updateProfile();
            console.log('Updated and verified');
            break;

        case 'verify':
            console.log(await verifyProfile());
            break;

        case 'list':
            console.log(await getProfiles());
            break;

        case 'list-jsoyn':
            console.log(JSON.stringify(await getProfiles()));
            break;

        case 'backup':
            await backupProfile();
            console.log('Backed up');
            break;

        case 'get':
            console.log(await getActiveProfile());
            break;

        case 'current':
            console.log((await getActiveProfile()).name);
            break;

        case 'new':
            await cloneProfile(args[0]);
            break;

        default: {
            const usedCommand = process.argv[1].match(/\/([^\/]+)$/)[1];
            console.error(`Usage: ${usedCommand} [command]`);
            process.exit(1);
        }
    }
}

main().catch(err => console.error(err.stack));
