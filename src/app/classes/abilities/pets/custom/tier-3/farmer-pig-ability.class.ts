import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment/equipment.service";
import { EquipmentFactoryService } from "app/services/equipment/equipment-factory.service";
import { Corncob } from "../../../../equipment/custom/corncob.class";
import { InjectorService } from "app/services/injector.service";

export class FarmerPigAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Farmer Pig Ability',
            owner: owner,
            triggers: ['StartBattle'],
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

        const friends = [owner.petAhead, owner.petBehind()].filter(p => p !== null && p.alive);

        for (const friend of friends) {
            friend.applyEquipment(new Corncob());
        }

        if (friends.length > 0) {
            this.logService.createLog({
                message: `${owner.name} fed adjacent friends Corncob.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): FarmerPigAbility {
        return new FarmerPigAbility(newOwner, this.logService);
    }
}
