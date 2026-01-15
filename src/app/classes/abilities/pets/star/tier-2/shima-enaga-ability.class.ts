import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";

export class ShimaEnagaAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'ShimaEnagaAbility',
            owner: owner,
            triggers: ['FriendDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            condition: (context: AbilityContext) => {
                const { triggerPet, tiger, pteranodon } = context;
                const owner = this.owner;
                return triggerPet && triggerPet.equipment?.name == 'Strawberry';
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let power = this.level * 2;

        let newPet = this.petService.createPet({
            name: owner.name,
            attack: power,
            health: power,
            equipment: null,
            exp: 0,
            mana: 0
        }, owner.parent);

        let summonResult = owner.parent.summonPet(newPet, triggerPet.position, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} summoned a (${power}/${power}) Shima Enaga`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: true
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): ShimaEnagaAbility {
        return new ShimaEnagaAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}
