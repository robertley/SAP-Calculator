import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Falcon extends Pet {
    name = "Falcon";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 5;
    health = 5;
    maxAbilityUses: number = 3;
    knockOut(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        this.abilityService.setSpawnEvent({
            callback: () => {
                let power = this.level * 3;
                let summonPet = this.petService.createPet({
                    attack: power,
                    health: power,
                    name: pet.name,
                    exp: this.minExpForLevel,
                    equipment: null
                }, this.parent);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned ${summonPet.name} ${power}/${power} Level ${this.level}`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger
                    }
                )

                if (this.parent.summonPet(summonPet, this.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(summonPet);
                }
            },
            priority: this.attack
        })
        this.abilityUses++;
        super.superKnockOut(gameApi, pet, tiger);
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
}