import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";

export class SilkySifakaAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'SilkySifakaAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.petService = petService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let sifakaPool = [
            "Mammoth", "Lionfish", "Orca", "Sabertooth Tiger",
            "Warthog", "Hydra", "Phoenix", "Bay Cat", "Walrus", "Ammonite"
        ];

        let targetsResp = owner.parent.nearestPetsBehind(2, owner);
        let petsBehind = targetsResp.pets;

        for (let targetPet of petsBehind) {
            let randomPetName = sifakaPool[Math.floor(Math.random() * sifakaPool.length)];
            let newPet = this.petService.createPet({
                name: randomPetName,
                attack: targetPet.attack,
                health: targetPet.health,
                mana: targetPet.mana,
                exp: owner.minExpForLevel,
                equipment: targetPet.equipment
            }, owner.parent);

            owner.parent.transformPet(targetPet, newPet);

            this.logService.createLog({
                message: `${owner.name} transformed ${targetPet.name} into level ${owner.level} ${newPet.name}`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: true
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SilkySifakaAbility {
        return new SilkySifakaAbility(newOwner, this.logService, this.petService);
    }
}