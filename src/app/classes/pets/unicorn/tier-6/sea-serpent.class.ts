import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO investigate tiger interaction
export class SeaSerpent extends Pet {
    name = "Sea Serpent";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 6;
    health = 6;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.mana == 0) {
            return;
        }

        let power = this.mana;
        let mana = this.mana;
        this.logService.createLog({
            message: `${this.name} spent ${mana} mana.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        })

        this.mana = 0;

        // First, snipe the most healthy enemy
        let highestHealthResult = this.parent.opponent.getHighestHealthPet(undefined, this);
        if (highestHealthResult.pet != null) {
            this.snipePet(highestHealthResult.pet, power, highestHealthResult.random, tiger, pteranodon);
        }

        // Then snipe level number of random enemies (excluding the first target)
        let randomTargetsResp = this.parent.opponent.getRandomPets(this.level, [highestHealthResult.pet], null, true, this);
        for (let target of randomTargetsResp.pets) {
            if (target != null) {
                this.snipePet(target, power, randomTargetsResp.random, tiger, pteranodon);
            }
        }

        this.superFaint(gameApi, tiger);
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