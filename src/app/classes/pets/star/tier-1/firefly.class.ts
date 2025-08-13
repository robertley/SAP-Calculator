import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Firefly extends Pet {
    name = "Firefly";
    tier = 1;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        const range = this.level;
        const fireflyPosition = this.savedPosition;
        const targets: Pet[] = [];

        for (const pet of this.parent.petArray) {
            if (pet.alive) {
                const distance = Math.abs(pet.position - fireflyPosition);
                if (distance > 0 && distance <= range) {
                    targets.push(pet);
                }
            }
        }

        for (const pet of this.parent.opponent.petArray) {
            if (pet.alive) {
                const distance = fireflyPosition + pet.position + 1;
                if (distance <= range) {
                    targets.push(pet);
                }
            }
        }

        if (targets.length > 0) {
            this.logService.createLog({
                message: `${this.name} dealt 1 damage to ${targets.length} pets.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });

            for (const target of targets) {
                this.snipePet(target, 1, false, tiger, pteranodon);
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