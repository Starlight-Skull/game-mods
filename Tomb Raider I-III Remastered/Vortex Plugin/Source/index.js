const winapi = require("winapi-bindings");
// const path = require("path");
const { fs, util } = require("vortex-api");

const GAME_ID = "tombraidertrilogyremastered";
const STEAMAPP_ID = "2478970";
const GOGAPP_ID = "1407750955";

function main(context) {
  context.registerGame({
    id: GAME_ID,
    name: "Tomb Raider I-III Remastered",
    mergeMods: true,
    queryPath: findGame,
    supportedTools: [],
    queryModPath: () => "",
    logo: "gameart.png",
    executable: () => "tomb123.exe",
    requiredFiles: ["tomb123.exe", "1/tomb1.dll", "2/tomb2.dll", "3/tomb3.dll"],
    setup: prepareForModding,
    environment: {
      SteamAPPId: STEAMAPP_ID,
    },
    details: {
      steamAppId: STEAMAPP_ID,
      gogAppId: GOGAPP_ID,
      stopPatterns: ["(^|/)1(/|$)", "(^|/)2(/|$)", "(^|/)3(/|$)"],
    },
  });
  return true;
}

function findGame() {
  try {
    const instPath = winapi.RegGetValue(
      "HKEY_LOCAL_MACHINE",
      "SOFTWARE\\WOW6432Node\\GOG.com\\Games\\" + GOGAPP_ID,
      "PATH"
    );
    if (!instPath) {
      throw new Error("empty registry key");
    }
    return Promise.resolve(instPath.value);
  } catch (err) {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID, GOGAPP_ID]).then(
      (game) => game.gamePath
    );
  }
}

function prepareForModding(discovery) {
  return fs.ensureDirWritableAsync(discovery.path);
}

module.exports = {
  default: main,
};
