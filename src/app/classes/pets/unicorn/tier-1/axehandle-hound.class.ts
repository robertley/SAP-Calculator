import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class AxehandleHound extends Pet {
    name = "Axehandle Hound";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 1;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let oppponetPets = this.parent.opponent.petArray;
        let petMap: Map<string, Pet[]> = new Map();

        for (let pet of oppponetPets) {
            if (petMap.has(pet.name)) {
                petMap.get(pet.name).push(pet);
            } else {
                petMap.set(pet.name, [pet]);
            }
        }

        let targets = [];
        for (let [key, value] of petMap) {
            if (value.length > 1) {
                targets.push(...value);
            }
        }

        if (targets.length == 0) {
            return;
        }
        
        let target = targets[Math.floor(Math.random() * targets.length)];

        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} sniped ${target.name} for ${this.level * 10} damage`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        })

        this.snipePet(target, this.level * 10, true, tiger);

        this.superStartOfBattle(gameApi, tiger);
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
}