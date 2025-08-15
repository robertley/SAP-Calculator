import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Honey } from "app/classes/equipment/turtle/honey.class";

export class Bear extends Pet {
    name = "Bear";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 3;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        const range = this.level;
        const bearPosition = this.savedPosition;
        const targets: Pet[] = [];

        // Check friend pets
        for (const pet of this.parent.petArray) {
            if (pet.alive) {
                const distance = Math.abs(pet.position - bearPosition);
                if (distance > 0 && distance <= range) {
                    targets.push(pet);
                }
            }
        }

        // Check opponent pets
        for (const pet of this.parent.opponent.petArray) {
            if (pet.alive) {
                const distance = bearPosition + pet.position + 1;
                if (distance <= range) {
                    targets.push(pet);
                }
            }
        }

        for (let target of targets) {
            target.givePetEquipment(new Honey(this.logService, this.abilityService));
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Honey.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
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