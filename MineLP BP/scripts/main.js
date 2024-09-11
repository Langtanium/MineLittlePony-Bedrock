import { system, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

world.beforeEvents.itemUse.subscribe(data => {
    const { itemStack } = data;

    if (itemStack.typeId == "minelp:options") {
        ponyOptions(data);
        data.cancel = true;
    }
});

/**
* @param {import("@minecraft/server").ItemUseBeforeEvent} data
*/
function ponyOptions(data) {
    const Player = data.source;
    // Remember changes so change the pony options isn't so tedious
    let lastSelected = {
        "race": Player.getProperty("property:race"),
        "muzzle": Player.getProperty("property:muzzle_type"),
        "tailLength": Player.getProperty("property:tail_length"),
        "tailShape": Player.getProperty("property:tail_shape"),
        "size": Player.getProperty("property:pony_size"),
        "cape": Player.getProperty("property:cape")
    };
    // Create the pony options menu
    const ponyMenu = new ModalFormData();

    ponyMenu.title({ translate: "ponyMenu.title" });

    const raceOptions = [
        { translate: "race.human" },
        { translate: "race.earth_pony" },
        { translate: "race.pegasus" },
        { translate: "race.unicorn" },
        { translate: "race.alicorn" },
        { translate: "race.changeling" },
        { translate: "race.zebra" },
        { translate: "race.reformed_changeling" },
        { translate: "race.griffin" },
        { translate: "race.hippogriff" },
        { translate: "race.kirin" },
        { translate: "race.batpony" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.race" }, raceOptions, lastSelected.race);

    const muzzleOptions = [
        { translate: "muzzle.round" },
        { translate: "muzzle.square" },
        { translate: "muzzle.flat" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.muzzle" }, muzzleOptions, lastSelected.muzzle);

    ponyMenu.slider({ translate: "ponyMenu.tailLength" }, 0, 4, 1, lastSelected.tailLength);

    const shapeOptions = [
        { translate: "shape.straight" },
        { translate: "shape.bumpy" },
        { translate: "shape.swirly" },
        { translate: "shape.spiky" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.tailShape" }, shapeOptions, lastSelected.tailShape);

    const sizeOptions = [
        { translate: "size.foal" },
        { translate: "size.yearling" },
        { translate: "size.normal" },
        { translate: "size.lanky" },
        { translate: "size.bulky" },
        { translate: "size.tall" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.size" }, sizeOptions, lastSelected.size);

    const capeOptions = [
        { translate: "cape.mojang" },
        { translate: "cape.pancape" },
        { translate: "cape.minecon2019" },
        { translate: "cape.pride" },
        { translate: "cape.vanilla" },
        { translate: "cape.cherry" },
        { translate: "cape.tiktok" },
        { translate: "cape.twitch" },
        { translate: "cape.fifteenth_anniversary" },
        { translate: "cape.minecraft_championship" }
    ];
    //ponyMenu.dropdown({ translate: "ponyMenu.cape" }, capeOptions, lastSelected.cape);

    system.runTimeout(() => {
        ponyMenu.show(Player).then(result => {
            const ponySizeEvents = [
                "minelp:size_foal",
                "minelp:size_yearling",
                "minelp:size_normal",
                "minelp:size_lanky",
                "minelp:size_bulky",
                "minelp:size_tall"
            ];
            if (!result.canceled) {
                Player.setProperty("property:race", result.formValues[0]);
                Player.setProperty("property:is_pony", checkIfPony(result.formValues[0]));
                Player.setProperty("property:muzzle_type", result.formValues[1]);
                Player.setProperty("property:tail_length", result.formValues[2]);
                Player.setProperty("property:tail_shape", result.formValues[3]);
                //Player.setProperty("property:pony_size", result.formValues[4]);
                Player.triggerEvent(ponySizeEvents[result.formValues[4]]);
                //Player.setProperty("property:cape", result.formValues[5]);
            }
        });
    }, 1);
}

/**
* @param {string | number | boolean} race
*/
function checkIfPony(race) {
    if (race == 0) {
        return 0;
    } else {
        return 1;
    }
}