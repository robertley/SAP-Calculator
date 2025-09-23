import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { EquipmentService } from "app/services/equipment.service";
import { InjectorService } from "app/services/injector.service";

export class HareAbility extends Ability {
    private logService: LogService;

    reset(): void {
        this.maxUses = this.owner.level;
        super.reset();
    }

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'HareAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        // get all equipment from enemy pets
        let enemyPets = owner.parent.opponent.petArray;
        let equipmentPets: Pet[] = [];
        for (let pet of enemyPets) {
            if (pet.equipment) {
                if (InjectorService.getInjector().get(EquipmentService).isUsefulPerk(pet.equipment.name)) {
                    equipmentPets.push(pet);
                }
            }
        }
        if (equipmentPets.length == 0) {
            return;
        }
        // get random equipment
        let randomEquipmentPet = equipmentPets[Math.floor(Math.random() * equipmentPets.length)];
        let equipment = randomEquipmentPet.equipment;

        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        owner.givePetEquipment(equipment);
        this.logService.createLog({
            message: `${owner.name} copied ${equipment.name} to ${target.name} from ${randomEquipmentPet.name}.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: equipmentPets.length > 0
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): HareAbility {
        return new HareAbility(newOwner, this.logService);
    }
}