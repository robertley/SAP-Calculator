import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Anubis extends Pet {
    name = "Anubis";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 3;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let faintPets = this.parent.petArray.filter(pet => pet.faintPet);
        for (let pet of faintPets) {
            if (!pet.alive) {
                continue;
            }
            if (pet.tier <= this.level * 2) {
                this.logService.createLog({
                    message: `${this.name} activated ${pet.name}'s faint ability.`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });
                this.abilityService.setFaintEvent(
                    {
                        callback: () => {
                            pet.faint(gameApi, false, false);
                        },
                        priority: 100 - pet.position
                    }
                )
            }
        }
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