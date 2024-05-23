import { Power } from "../../../../interfaces/power.interface";
import { Pack, Pet } from "../../../pet.class";

export class Ant extends Pet {

    name = "Ant"
    tier = 1;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;

    foo= 'bar';

    faint(gameApi, tiger, pteranodon?: boolean) {
        let power: Power = this.level == 1 ? { health: 1, attack: 1 } :
            this.level == 2 ? { health: 2, attack: 2 } : { health: 3, attack: 3 };

        let boostPet = this.parent.getRandomPet([this], true, false, true);
        if (boostPet == null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} gave ${boostPet.name} ${power.attack} attack and ${power.health} health.`,
            type: "ability",
            randomEvent: true,
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        })

        boostPet.increaseAttack(power.attack);
        boostPet.increaseHealth(power.health);

        this.superFaint(gameApi, tiger);
        this.done = true;
    }

}