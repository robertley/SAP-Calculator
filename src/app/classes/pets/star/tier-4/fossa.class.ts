import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Fossa extends Pet {
    name = "Fossa";
    tier = 4;
    pack: Pack = 'Star';
    attack = 4;
    health = 5;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        const isPlayer = this.parent === gameApi.player;
        const rollAmount = isPlayer ? gameApi.playerRollAmount : gameApi.opponentRollAmount;

        if (rollAmount <= 0) {
            return;
        }

        const healthToRemove = this.level * rollAmount;

        let targetResp = this.parent.getFurthestUpPets(2, null, this);
        let targets = targetResp.pets
        if (targets.length == 0){
            return;
        }

        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} removed ${healthToRemove} health from ${target.name}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });

            target.increaseHealth(-healthToRemove);           
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