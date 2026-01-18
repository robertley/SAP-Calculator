import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { Dolphin } from "../../../../pets/turtle/tier-3/dolphin.class";
import { Rice } from "../../../../equipment/puppy/rice.class";

export class BelugaSturgeonAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'BelugaSturgeonAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        for (let i = 0; i < this.level; i++) {
            let dolphin = new Dolphin(this.logService, this.abilityService, owner.parent, 3, 2, 0, 0, null);

            let summonResult = owner.parent.summonPet(dolphin, 4, false, owner);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} summoned a 2/3 Dolphin in the back.`,
                    type: 'ability',
                    player: owner.parent,
                    randomEvent: summonResult.randomEvent,
                    tiger: tiger,
                    pteranodon: pteranodon
                });
                dolphin.givePetEquipment(new Rice());
                this.logService.createLog({
                    message: `${owner.name} gave ${dolphin.name} Rice.`,
                    type: 'ability',
                    player: owner.parent,
                    randomEvent: false,
                    tiger: tiger,
                    pteranodon: pteranodon
                });
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BelugaSturgeonAbility {
        return new BelugaSturgeonAbility(newOwner, this.logService, this.abilityService);
    }
}
