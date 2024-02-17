import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
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
        let hasDuplicate = false;
        for (let petX of oppponetPets) {
            for (let petY of oppponetPets) {
                if (petX == petY) {
                    continue;
                }

                if (petX.name == petY.name) {
                    hasDuplicate = true;
                    break;
                }
            }
        }

        if (!hasDuplicate) {
            return;
        }

        let target = this.parent.opponent.getRandomPet();
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