import { cloneDeep, shuffle, sum } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { PetService } from "../../../../services/pet.service";

export class Pteranodon extends Pet {
    name = "Pteranodon";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 5;
    health = 3;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (pet.name == this.name) {
            return;
        }
        this.abilityService.setSpawnEvent({
            callback: () => {
                let summonPet = this.petService.createPet(
                    {
                        attack: 1,
                        health: 1,
                        equipment: null,
                        exp: pet.exp,
                        name: pet.name
                    }, this.parent
                );
                this.logService.createLog({
                    message: `${this.name} summoned a 1/1 ${pet.name} behind it.`,
                    type: 'ability',
                    player: this.parent,
                    randomEvent: false,
                    tiger: tiger
                })
                if (this.parent.summonPet(summonPet, this.position)) {
                    this.abilityService.triggerSummonedEvents(summonPet);
                }
            },
            priority: this.attack
        })
        this.abilityUses++;
        //debug 
        this.logService.printState(gameApi.player, gameApi.opponet);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }

}