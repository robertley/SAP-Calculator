import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class GuavaAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private used: boolean = false;

    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'GuavaAbility',
            owner: owner,
            triggers: ['BeforeStartBattle'],
            abilityType: 'Equipment',
            native: true,
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        if (this.used) return;
        
        const owner = this.owner;
        const blockAmount = 3;
        const attackBoost = 3;
        
        owner.increaseAttack(attackBoost);
        
        this.logService.createLog({
            message: `${owner.name} gained +${attackBoost} attack from Guava (will block ${blockAmount} damage once)`,
            type: 'ability',
            player: owner.parent
        });
        
        this.used = true;
    }
}
