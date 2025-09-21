import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";

export class SabertoothTigerAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'SabertoothTigerAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
        this.petService = petService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let totalHurt = owner.timesHurt;
        if (totalHurt > 0) {
            for (let i = 0; i < this.level; i++) { // 1/2/3 Mammoths based on level
                let mammothAttack = Math.min(2 * totalHurt, 50);
                let mammothHealth = Math.min(3 * totalHurt, 50);

                let mammoth = this.petService.createPet({
                    name: "Mammoth",
                    attack: mammothAttack,
                    health: mammothHealth,
                    equipment: null,
                    mana: 0,
                    exp: 0
                }, owner.parent);

                let summonResult = owner.parent.summonPet(mammoth, owner.savedPosition, false, owner);
                if (summonResult.success) {
                    this.logService.createLog({
                        message: `${owner.name} summoned ${mammoth.name} (${mammothAttack}/${mammothHealth}).`,
                        type: 'ability',
                        player: owner.parent,
                        tiger: tiger,
                        pteranodon: pteranodon,
                        randomEvent: summonResult.randomEvent
                    });

                    this.abilityService.triggerFriendSummonedEvents(mammoth);
                }
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SabertoothTigerAbility {
        return new SabertoothTigerAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}