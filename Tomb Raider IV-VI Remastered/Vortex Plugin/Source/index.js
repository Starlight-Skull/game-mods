const winapi = require("winapi-bindings");
// const path = require("path");
const { fs, util } = require("vortex-api");

const GAME_ID = "tombraidertrilogy2remastered";
const STEAMAPP_ID = "2525380";
const GOGAPP_ID = "1446538488";

function main(context) {
  context.registerGame({
    id: GAME_ID,
    name: "Tomb Raider IV-VI Remastered",
    mergeMods: true,
    queryPath: findGame,
    supportedTools: [],
    queryModPath: () => "",
    logo: "gameart.jpg",
    executable: () => "tomb456.exe",
    requiredFiles: ["tomb456.exe", "4/tomb4.dll", "5/tomb5.dll", "6/tomb6.dll"],
    setup: prepareForModding,
    environment: {
      SteamAPPId: STEAMAPP_ID,
    },
    details: {
      steamAppId: STEAMAPP_ID,
      gogAppId: GOGAPP_ID,
      stopPatterns: ["(^|/)4(/|$)", "(^|/)5(/|$)", "(^|/)6(/|$)"],
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
