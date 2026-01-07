import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { Walnut } from "../../../equipment/puppy/walnut.class";

export class StickAbility extends Ability {
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'StickAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            abilityFunction: (context: AbilityContext) => {
                const { gameApi } = context;
                // Give Walnut perk to the friend on the middle space.
                const friendResp = owner.parent.getMiddleFriend(owner);
                if (friendResp.pet && friendResp.pet.alive) {
                    const walnut = new Walnut();
                    walnut.power = 2 * this.abilityLevel;
                    walnut.originalPower = walnut.power;
                    friendResp.pet.givePetEquipment(walnut);
                    logService.createLog({
                        message: `${owner.name} gave Walnut to ${friendResp.pet.name} (Stick)`,
                        type: 'ability',
                        player: owner.parent,
                        randomEvent: friendResp.random
                    });
                }
            }
        });
    }
}
