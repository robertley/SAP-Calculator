import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { shuffle } from "../../../../../util/helper-functions";

export class HyenaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'HyenaAbility',
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
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        switch(this.level) {
            case 1:
                this.level1Ability(gameApi, tiger, pteranodon);
                break;
            case 2:
                this.level2Ability(gameApi, tiger, pteranodon);
                break;
            case 3:
                this.level3Ability(gameApi, tiger, pteranodon);
                break;
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    private level1Ability(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;
        let allPetsResp = owner.parent.getAll(true, owner);
        for (let pet of allPetsResp.pets) {
            let health = pet.health;
            let attack = pet.attack;
            pet.health = attack;
            pet.attack = health;
        }
        this.logService.createLog({
            message: `${owner.name} swapped all pets attack and health.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });
    }

    private level2Ability(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;
        this.shufflePets(gameApi.player);
        this.shufflePets(gameApi.opponet);
        this.logService.createLog({
            message: `${owner.name} shuffled positions of all pets.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: true
        });
    }

    private level3Ability(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        this.level1Ability(gameApi, tiger, pteranodon);
        this.level2Ability(gameApi, tiger, pteranodon);
    }

    private shufflePets(player: any) {
        let pets = player.petArray;
        shuffle(pets);
        for (let i = 0; i < pets.length; i++) {
            player[`pet${i}`] = pets[i];
        }
    }

    copy(newOwner: Pet): HyenaAbility {
        return new HyenaAbility(newOwner, this.logService);
    }
}