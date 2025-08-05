import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bat extends Pet {
    name = "Bat";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let excludePets = opponent.getPetsWithEquipment('Weak');
        let targets = opponent.getRandomPets(this.level, excludePets, null, true);
        for (let target of targets) {
            target.givePetEquipment(new Weak());
            this.logService.createLog({
                message: `${this.name} made ${target.name} weak.`,
                type: 'ability',
                player: this.parent,
                randomEvent: true,
                tiger: tiger
            })
        }
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