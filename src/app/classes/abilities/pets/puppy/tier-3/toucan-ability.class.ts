import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment.service";
import { InjectorService } from "app/services/injector.service";
import { Equipment } from "../../../../equipment.class";

export class ToucanAbility extends Ability {
    private logService: LogService;
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ToucanAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (context: AbilityContext): boolean => {
                const { triggerPet, tiger, pteranodon } = context;
                const owner = this.owner;
                return this.owner.timesAttacked < 1;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let newEquipmentInstance: Equipment;
        if (owner.equipment == null || owner.equipment.tier > 5) {
            newEquipmentInstance = InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment().get('Egg');
        } else {
            newEquipmentInstance = InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment().get(owner.equipment.name);
        }

        let excludePets = owner.parent.getPetsWithEquipment(newEquipmentInstance.name);
        let targetsResp = owner.parent.nearestPetsBehind(this.level, owner, excludePets);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${newEquipmentInstance.name}`,
                type: 'ability',
                player: owner.parent,
                randomEvent: false,
                tiger: tiger,
                pteranodon: pteranodon
            });

            target.givePetEquipment(newEquipmentInstance);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): ToucanAbility {
        return new ToucanAbility(newOwner, this.logService);
    }
}