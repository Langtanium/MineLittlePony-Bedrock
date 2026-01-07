import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

// Custom command to show pony options menu
system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
    customCommandRegistry.registerCommand(
        {
            name: "minelp:pony_options",
            description: "Customize your pony.",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false
        },
        (origin) => {
            if (!origin.sourceEntity) return {
                status: CustomCommandStatus.Failure,
            };
            ponyOptions(origin.sourceEntity);
        }
    );
});

// Use item to show pony options menu
world.beforeEvents.itemUse.subscribe(data => {
    const { itemStack } = data;

    if (itemStack.typeId == "minelp:options") {
        ponyOptions(data.source);
        data.cancel = true;
    }
});

/**
* @param {import("@minecraft/server").Entity} Player
*/
function ponyOptions(Player) {
    // Remember changes so changing the pony options isn't so tedious
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
    let ponyMenu = new ModalFormData();

    ponyMenu.title("minelp:pony_options");

    ponyMenu.header({ translate: "ponyMenu.header" })

    let raceOptions = [
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
    ponyMenu.dropdown({ translate: "ponyMenu.race" }, raceOptions, { defaultValueIndex: lastSelected.race });

    let muzzleOptions = [
        { translate: "muzzle.round" },
        { translate: "muzzle.square" },
        { translate: "muzzle.flat" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.muzzle" }, muzzleOptions, { defaultValueIndex: lastSelected.muzzle });

    ponyMenu.slider({ translate: "ponyMenu.tailLength" }, 0, 4, { valueStep: 1, defaultValue: lastSelected.tailLength });

    let shapeOptions = [
        { translate: "shape.straight" },
        { translate: "shape.bumpy" },
        { translate: "shape.swirly" },
        { translate: "shape.spiky" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.tailShape" }, shapeOptions, { defaultValueIndex: lastSelected.tailShape });

    let sizeOptions = [
        { translate: "size.foal" },
        { translate: "size.yearling" },
        { translate: "size.squat" },
        { translate: "size.stocky" },
        { translate: "size.normal" },
        { translate: "size.lanky" },
        { translate: "size.bulky" },
        { translate: "size.tall" }
    ];
    ponyMenu.dropdown({ translate: "ponyMenu.size" }, sizeOptions, { defaultValueIndex: lastSelected.size });

    let wearables1Options = [
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
    ponyMenu.dropdown({ translate: "ponyMenu.wearables1" }, wearables1Options, { defaultValueIndex: lastSelected.wearables1 });

    ponyMenu.submitButton({ translate: "ponyMenu.submit" });

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
                Player.setProperty("minelp:race", result.formValues[1]);
                Player.setProperty("minelp:is_pony", checkIfPony(result.formValues[1]));
                Player.setProperty("minelp:muzzle_type", result.formValues[2]);
                Player.setProperty("minelp:tail_length", result.formValues[3]);
                Player.setProperty("minelp:tail_shape", result.formValues[4]);
                Player.setProperty("minelp:pony_size", result.formValues[5]);
                Player.triggerEvent(ponySizeEvents[result.formValues[5]]);
                Player.setProperty("minelp:pony_gear_first", result.formValues[6]);
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
