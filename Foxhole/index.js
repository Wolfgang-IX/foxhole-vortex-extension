// Nexus Mods domain for the game. e.g. nexusmods.com/bloodstainedritualofthenight
const GAME_ID = 'foxhole';

//Steam Application ID, you can get this from https://steamdb.info/apps/
const STEAMAPP_ID = '505460';

//GOG Application ID, you can get this from https://www.gogdb.org/
//const GOGAPP_ID = '';

//Add this to the top of the file
const winapi = require('winapi-bindings');
//Detect game
function findGame() {
  try {
    const instPath = winapi.RegGetValue(
      'HKEY_LOCAL_MACHINE',
      'PATH');
    if (!instPath) {
      throw new Error('empty registry key');
    }
    return Promise.resolve(instPath.value);
  } catch (err) {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID])
      .then(game => game.gamePath);
  }
}
//Checking the required folder
function prepareForModding(discovery) {
    return fs.ensureDirWritableAsync(path.join(discovery.path, 'War', 'Content', 'Paks'));
}

//Import some assets from Vortex we'll need.
const path = require('path');
const { fs, log, util } = require('vortex-api');

function main(context) {
	//This is the main function Vortex will run when detecting the game extension. 
	context.registerGame({
        id: GAME_ID,
        name: 'Foxhole',
        mergeMods: true,
        queryPath: findGame,
        supportedTools: [],
        queryModPath: () => 'War/Content/Paks',
        logo: 'gameart.jpg',
        executable: () => 'War.exe',
        requiredFiles: [
          'War.exe',
          'War/Binaries/Win64/War-Win64-Shipping.exe',
        ],
        setup: prepareForModding,
        environment: {
          SteamAPPId: STEAMAPP_ID,
        },
        details: {
          steamAppId: STEAMAPP_ID,
          //gogAppId: GOGAPP_ID,
        },
      });
	return true;
}

module.exports = {
    default: main,
};