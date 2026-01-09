import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Inked } from "app/classes/equipment/ailments/inked.class";

export class CuttlefishAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'CuttlefishAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
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

        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;

        let targetsResp = owner.parent.opponent.getLastPets(this.level, undefined, owner);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        let power = 3;

        for (let target of targets) {
            target.increaseHealth(-power);
            this.logService.createLog({
                message: `${owner.name} reduced ${target.name} health by ${power}`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsResp.random
            });
        }

        let InkTargetsResp = owner.parent.opponent.getLastPets(this.level, undefined, owner);
        let InkTargets = InkTargetsResp.pets;
        if (InkTargets.length == 0) {
            return;
        }

        for (let target of InkTargets) {
            target.givePetEquipment(new Inked());
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} Inked.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: InkTargetsResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): CuttlefishAbility {
        return new CuttlefishAbility(newOwner, this.logService);
    }
}