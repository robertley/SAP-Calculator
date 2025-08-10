import { clone, cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tapir extends Pet {
    name = "Tapir";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let excludePets = this.parent.petArray.filter(pet => {
            return pet.name == "Tapir";
        });
        let target = this.parent.getRandomPet(excludePets, true);
        if (target == null) {
            super.superAfterFaint(gameApi, tiger, pteranodon);
            return;
        }

        target = clone(target);

         
        target.exp = this.minExpForLevel;
        let spawnPet = this.petService.createDefaultVersionOfPet(target);
        this.logService.createLog(
            {
                message: `${this.name} spawned a ${spawnPet.name} level ${spawnPet.level}.`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: true
            }
        )

        if (this.parent.summonPet(spawnPet, this.savedPosition)) {
            this.abilityService.triggerSummonedEvents(target);
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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