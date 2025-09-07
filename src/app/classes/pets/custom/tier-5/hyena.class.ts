import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { shuffle } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hyena extends Pet {
    name = "Hyena";
    tier = 5;
    pack: Pack = 'Custom';
    attack = 5;
    health = 5;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        switch(this.level) {
            case 1:
                this.level1Ability(gameApi, tiger);
                break;
            case 2:
                this.level2Ability(gameApi, tiger);
                break;
            case 3:
                this.level3Ability(gameApi, tiger);
                break;
        }
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }

    level1Ability(gameApi: GameAPI, tiger?: boolean): void {
        let allPetsResp = this.parent.getAll(true, this);
        for (let pet of allPetsResp.pets) {
            let health = pet.health;
            let attack = pet.attack;
            pet.health = attack;
            pet.attack = health;
        }
        this.logService.createLog({
            message: `${this.name} swapped all pets attack and health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
    }

    level2Ability(gameApi: GameAPI, tiger?: boolean): void {
        this.shufflePets(gameApi.player);
        this.shufflePets(gameApi.opponet);
        this.logService.createLog({
            message: `${this.name} shuffled positions of all pets.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: true
        })
    }

    level3Ability(gameApi: GameAPI, tiger?: boolean): void {
        this.level1Ability(gameApi, tiger);
        this.level2Ability(gameApi, tiger);
    }

    shufflePets(player: Player) {
        let pets = player.petArray;
        shuffle(pets);
        for (let i = 0; i < pets.length; i++) {
            player[`pet${i}`] = pets[i];
        }
    }
}