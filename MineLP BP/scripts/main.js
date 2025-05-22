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
        "race": Player.getProperty("minelp:race"),
        "muzzle": Player.getProperty("minelp:muzzle_type"),
        "tailLength": Player.getProperty("minelp:tail_length"),
        "tailShape": Player.getProperty("minelp:tail_shape"),
        "size": Player.getProperty("minelp:pony_size"),
        "wearables1": Player.getProperty("minelp:pony_gear_first"),
        "wearables2": Player.getProperty("minelp:pony_gear_second"),
        "wearables3": Player.getProperty("minelp:pony_gear_third")
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
        { translate: "race.reformedChangeling" },
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
        { translate: "size.squat" },
        { translate: "size.stocky" },
        { translate: "size.normal" },
        { translate: "size.lanky" },
        { translate: "size.bulky" },
        { translate: "size.tall" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.size" }, sizeOptions, lastSelected.size);

    const wearables1Options = [
        { translate: "wearables.none" },
        { translate: "wearables.crown" },
        { translate: "wearables.muffin" },
        { translate: "wearables.hat" },
        { translate: "wearables.antlers" },
        { translate: "wearables.saddleBagLeft" },
        { translate: "wearables.saddleBagRight" },
        { translate: "wearables.saddleBags" },
        { translate: "wearables.stetson" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.wearables1" }, wearables1Options, lastSelected.wearables1);

    system.runTimeout(() => {
        ponyMenu.show(Player).then(result => {
            const ponySizeEvents = [
                "minelp:size_foal",
                "minelp:size_yearling",
                "minelp:size_squat",
                "minelp:size_stocky",
                "minelp:size_normal",
                "minelp:size_lanky",
                "minelp:size_bulky",
                "minelp:size_tall"
            ];
            if (!result.canceled) {
                Player.setProperty("minelp:race", result.formValues[0]);
                Player.setProperty("minelp:is_pony", checkIfPony(result.formValues[0]));
                Player.setProperty("minelp:muzzle_type", result.formValues[1]);
                Player.setProperty("minelp:tail_length", result.formValues[2]);
                Player.setProperty("minelp:tail_shape", result.formValues[3]);
                Player.setProperty("minelp:pony_size", result.formValues[4]);
                Player.triggerEvent(ponySizeEvents[result.formValues[4]]);
                Player.setProperty("minelp:pony_gear_first", result.formValues[5]);
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