import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { shuffle } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Mothman extends Pet {
    name = "Mothman";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 2;

    // This private method handles the core logic to avoid code duplication.
    private onAilmentGained(pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        const power = this.level;

        this.logService.createLog({
            message: `${this.name} gained +${power} attack and +${power} health because ${pet.name} gained an ailment.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

        this.increaseAttack(power);
        this.increaseHealth(power);

        this.abilityUses++;
    }

    friendGainedAilment(gameApi: GameAPI, pet?: Pet): void {
        // We pass `false` for the tiger flag because the base 'friendGainedAilment' doesn't support it.
        this.onAilmentGained(pet, false);
    }

    enemyGainedAilment(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        this.onAilmentGained(pet, tiger);
        this.superEnemyGainedAilment(gameApi, pet, tiger);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 5;
    }
}