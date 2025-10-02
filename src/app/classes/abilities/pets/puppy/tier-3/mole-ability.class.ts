import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Mole } from "../../../../pets/puppy/tier-3/mole.class";

export class MoleAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'MoleAbility',
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

        let power = this.level * 6;
        let equipmentPets: Pet[] = [];
        for (let pet of owner.parent.petArray) {
            if (pet == owner) {
                continue;
            }
            if (pet.equipment) {
                equipmentPets.push(pet);
            }
        }
        const ownerPos = owner.position;
        equipmentPets.sort((a, b) => {
            const da = Math.abs(a.position - ownerPos);
            const db = Math.abs(b.position - ownerPos);
            if (da !== db) return da - db;
            return a.position - b.position;
        });
        equipmentPets = equipmentPets.slice(0, 2);
        if (equipmentPets.length < 2) {
            return;
        }
        for (let pet of equipmentPets) {
            this.logService.createLog({
                message: `${owner.name} removed ${pet.name}'s equipment.`,
                type: 'ability',
                player: owner.parent,
                pteranodon: pteranodon,
            })
            pet.removePerk();
        }
        let mole = new Mole(this.logService, this.abilityService, owner.parent, power, power);

        let summonResult = owner.parent.summonPet(mole, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} summoned a ${power}/${power} Mole.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: summonResult.randomEvent
            });

            this.abilityService.triggerFriendSummonedEvents(mole);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MoleAbility {
        return new MoleAbility(newOwner, this.logService, this.abilityService);
    }
}