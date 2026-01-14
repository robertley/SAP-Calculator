import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Rice } from "../../../../equipment/puppy/rice.class";

export class FrigatebirdAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FrigatebirdAbility',
            owner: owner,
            triggers: ['FriendGainsAilment'],
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

        const equipment = triggerPet?.equipment;
        if (!equipment || !equipment.equipmentClass?.startsWith('ailment')) {
            return;
        }
        triggerPet.removePerk();
        triggerPet.givePetEquipment(new Rice());
        this.logService.createLog({
            message: `${owner.name} removed ${equipment.name} from ${triggerPet.name} and gave ${triggerPet.name} Rice.`,
            type: 'ability',
            player: owner.parent
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }
    reset(): void {
        this.maxUses = this.level;
        super.reset();
    }
    copy(newOwner: Pet): FrigatebirdAbility {
        return new FrigatebirdAbility(newOwner, this.logService);
    }
}
