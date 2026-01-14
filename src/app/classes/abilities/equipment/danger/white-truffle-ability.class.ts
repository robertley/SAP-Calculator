import { Ability, AbilityContext } from "../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";

export class WhiteTruffleAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    constructor(owner: Pet, equipment: Equipment, logService: LogService) {
        super({
            name: 'WhiteTruffleAbility',
            owner: owner,
            triggers: ['FriendDied'],
            abilityType: 'Equipment',
            native: true,
            maxUses: 1, // Equipment is removed after one use
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, faintedPet, tiger } = context;
        const owner = this.owner;

        for (let i = 0; i < this.equipment.multiplier; i++) {
            let targetResp = owner.parent.opponent.getHighestAttackPet(undefined, owner);
            if (targetResp.pet) {
                owner.jumpAttackPrep(targetResp.pet);
                owner.jumpAttack(targetResp.pet, tiger, null, targetResp.random);
            }
        }
        owner.removePerk();
    }
}
