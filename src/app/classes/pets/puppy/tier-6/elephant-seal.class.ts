import { random } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class ElephantSeal extends Pet {
    name = "Elephant Seal";
    tier = 6;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 8;
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

    GainedPerk(gameApi: GameAPI, pet, tiger?: boolean): void {
        if (pet != this) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let power = this.level * 5;
        let targets = this.parent.getRandomPets(3, [this], true, false);
        for (let target of targets) {
            target.increaseAttack(power);
            target.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: true
            })
        }
        this.abilityUses++;
        this.superGainedPerk(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 1;
    }
}