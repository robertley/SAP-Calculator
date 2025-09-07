import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class AxehandleHound extends Pet {
    //TO DO: needs update
    name = "Axehandle Hound";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 1;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let oppponetPets = this.parent.opponent.petArray;
        let petSet: Set<string> = new Set();
        let duplicate = false;
        for (let pet of oppponetPets) {
            if (petSet.has(pet.name)) {
                duplicate = true;
                break;
            } else {
                petSet.add(pet.name)
            }
        }
        if (duplicate == false) {
            return;
        }
        let targetsResp = this.parent.opponent.getAll(false, this);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            this.snipePet(target, this.level * 2, true, tiger);
        }      
        this.abilityUses++;
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
    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 1;
    }
}