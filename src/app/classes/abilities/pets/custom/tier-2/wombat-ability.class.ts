import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WombatAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Wombat Ability',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;

        // Find the first enemy with a faint ability
        const opponentPets = owner.parent.opponent.petArray;
        const target = opponentPets.find(p => p.alive && p.isFaintPet());

        if (target) {
            // Copy its faint abilities
            const faintAbilities = target.getAbilities().filter(a =>
                a.matchesTrigger('ThisDied') || a.matchesTrigger('BeforeThisDies')
            );

            for (const abilityToCopy of faintAbilities) {
                const copiedAbility = abilityToCopy.copy(owner);
                if (copiedAbility) {
                    copiedAbility.abilityLevel = this.level;
                    copiedAbility.alwaysIgnorePetLevel = true;
                    copiedAbility.reset();
                    owner.addAbility(copiedAbility);
                }
            }

            this.logService.createLog({
                message: `${owner.name} copied ${target.name}'s faint abilities as level ${this.level}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): WombatAbility {
        return new WombatAbility(newOwner, this.logService);
    }
}