import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment.service";
import { InjectorService } from "app/services/injector.service";

export class RacketTailAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Racket Tail Ability',
            owner: owner,
            triggers: ['BeforeFriendAttacks'],
            abilityType: 'Pet',
            maxUses: owner.level,
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        if (!triggerPet || triggerPet.parent !== owner.parent || !triggerPet.alive) {
            this.triggerTigerExecution(context);
            return;
        }

        const equipmentService = InjectorService.getInjector().get(EquipmentService);
        const strawberry = equipmentService.getInstanceOfAllEquipment().get('Strawberry');
        if (strawberry) {
            triggerPet.givePetEquipment(strawberry);
        }
        const attackBonus = 5;
        triggerPet.increaseAttack(attackBonus);

        this.logService.createLog({
            message: `${owner.name} gave ${triggerPet.name} Strawberry and +${attackBonus} attack before attacking.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): RacketTailAbility {
        return new RacketTailAbility(newOwner, this.logService);
    }
}
