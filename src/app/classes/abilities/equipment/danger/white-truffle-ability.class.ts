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
        let statGain = 4;

        for (let i = 0; i < this.equipment.multiplier; i++) {
            // Jump-attack the highest attack enemy
             // Apply stat gain to transformed pet if transformed, otherwise use Silly-aware self-targeting
             if (owner.transformed && owner.transformedInto) {
                let selfTargetResp = owner.parent.getThis(owner.transformedInto);
                if (selfTargetResp.pet) {
                    owner.transformedInto.increaseAttack(statGain);
                    this.logService.createLog({
                        message: `${owner.name} gave ${owner.transformedInto.name} ${statGain} attack`,
                        type: 'ability',
                        player: owner.parent,
                        tiger: tiger,
                        randomEvent: selfTargetResp.random
                    });
                }
            } else {
                let selfTargetResp = owner.parent.getThis(owner);
                if (selfTargetResp.pet) {
                    selfTargetResp.pet.increaseAttack(statGain);
                    this.logService.createLog({
                        message: `${owner.name} gave ${selfTargetResp.pet.name} ${statGain} attack`,
                        type: 'ability',
                        player: owner.parent,
                        tiger: tiger,
                        randomEvent: selfTargetResp.random
                    });
                }
            }
            let targetResp = owner.parent.opponent.getHighestAttackPet(undefined, owner);
            if (targetResp.pet) {
                owner.jumpAttackPrep(targetResp.pet);
                owner.jumpAttack(targetResp.pet, tiger, null, targetResp.random);
            }
        }
        owner.removePerk();
    }
}