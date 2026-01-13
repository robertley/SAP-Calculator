import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment.service";
import { InjectorService } from "app/services/injector.service";

export class SeagullAbility extends Ability {
    private logService: LogService;
    private usesThisTurn = 0;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SeagullAbility',
            owner: owner,
            triggers: ['FriendSummoned', 'StartTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { triggerPet, tiger, pteranodon, trigger } = context;const owner = this.owner;

        if (trigger === 'StartTurn') {
            this.usesThisTurn = 0;
            return;
        }

        if (!triggerPet || !owner.equipment || this.usesThisTurn >= this.level) {
            this.triggerTigerExecution(context);
            return;
        }

        const equipmentService = InjectorService.getInjector().get(EquipmentService);
        const baseEquipment = owner.equipment;
        const equipmentInstance = equipmentService.getInstanceOfAllEquipment().get(baseEquipment.name);

        if (!equipmentInstance) {
            this.triggerTigerExecution(context);
            return;
        }

        triggerPet.givePetEquipment(equipmentInstance);
        this.usesThisTurn++;

        this.logService.createLog({
            message: `${owner.name} gave ${triggerPet.name} a ${baseEquipment.name}`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SeagullAbility {
        return new SeagullAbility(newOwner, this.logService);
    }
}
