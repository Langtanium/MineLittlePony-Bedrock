import { world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

world.events.itemDefinitionEvent.subscribe(data => {
    const { eventName, source } = data;

    if (eventName == "options_popup") {
        let pony_menu = new ModalFormData();
        let on_click = [];

        pony_menu.title("Pony Options");

        pony_menu.dropdown("Race", ["Human", "Earth pony", "Pegasus", "Unicorn", "Alicorn", "Changeling", "Zebra", "Reformed Changeling", "Gryphon", "Hippogriff", "Kirin", "Batpony"], 1);

        pony_menu.slider("Tail length", 0, 4, 1, 4);

        pony_menu.dropdown("Snout shape", ["Round", "Square", "Flat"], 0);

        pony_menu.show(source).then(r => {
            // ".canceled" does not work, but returns 0 to ".selection"
            if (r.selection === 0) {
                // Do something when the player closes the form or presses "button2"
                return;
            };

            // Do something when player presses "button1"
            console.warn(r.formValues);
            let [dropdown, slider, dropdown2] = r.formValues;

            if (r.formValues[dropdown] == "Human") {
                world.getAllPlayers(parent).runCommandAsync("function set_human")
            };
            if (r.formValues[dropdown] == "Earth pony") {
                world.getAllPlayers(parent).runCommandAsync("function set_earth_pony")
            };
            if (r.formValues[dropdown] == "Pegasus") {
                world.getAllPlayers(parent).runCommandAsync("function set_pegasus")
            };

            if (r.formValues[slider] == 0) {
                world.getAllPlayers(parent).runCommandAsync("function tail_stub")
            };
            if (r.formValues[slider] == 1) {
                world.getAllPlayers(parent).runCommandAsync("function tail_quarter")
            };
            if (r.formValues[slider] == 2) {
                world.getAllPlayers(parent).runCommandAsync("function tail_half")
            };
            if (r.formValues[slider] == 3) {
                world.getAllPlayers(parent).runCommandAsync("function tail_three_quarters")
            };
            if (r.formValues[slider] == 4) {
                world.getAllPlayers(parent).runCommandAsync("function tail_full")
            };

            if (r.formValues[dropdown2] == "Round") {
                world.getAllPlayers(parent).runCommandAsync("function snout_round")
            };
            if (r.formValues[dropdown2] == "Square") {
                world.getAllPlayers(parent).runCommandAsync("function snout_square")
            };
            if (r.formValues[dropdown2] == "Flat") {
                world.getAllPlayers(parent).runCommandAsync("function snout_flat")
            };

        }).catch(e => {
            console.error(e, e.stack);
        });

    };
});