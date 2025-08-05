import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class TabbyCat extends Pet {
    name = "Tabby Cat";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 4;
    health = 3;
    friendGainedPerk(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let targets = this.parent.getRandomPets(2, [this], true, false);
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} increased ${target.name}'s health by ${this.level}.`,
                type: 'ability',
                player: this.parent,
                randomEvent: true,
                tiger: tiger
            });
            target.increaseHealth(this.level);
        }

        this.superFriendGainedPerk(gameApi, pet, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}