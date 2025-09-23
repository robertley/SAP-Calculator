import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";

export class RedLippedBatfishAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'RedLippedBatfishAbility',
            owner: owner,
            triggers: ['StartBattle'],
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

        // Get the opposite enemy at the same position
        let target = owner.parent.opponent.getPetAtPosition(owner.position);

        if (!target || !target.alive) {
            return;
        }

        // Calculate target tier: target's tier - level (1/2/3 tiers below)
        let targetTier = Math.max(1, target.tier - this.level);

        // Get random faint pet from the target tier
        let faintPet = this.petService.getRandomFaintPet(target.parent, targetTier);

        // Create new pet with the faint pet's name but original target's stats
        let newPet = this.petService.createPet({
            name: faintPet.name,
            attack: target.attack,
            health: target.health,
            exp: target.exp,
            equipment: target.equipment,
            mana: target.mana
        }, target.parent);

        // Use proper transformPet method
        this.logService.createLog({
            message: `${owner.name} transformed ${target.name} into ${faintPet.name}.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: true
        });
        target.parent.transformPet(target, newPet);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): RedLippedBatfishAbility {
        return new RedLippedBatfishAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}