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
            this.superStartOfBattle(gameApi, tiger);
            return;
        }

        const healthToRemove = this.level * rollAmount;

        const targets = this.parent.opponent.petArray.slice(0, 2);

        for (const target of targets) {
            if (target?.alive) {
                this.logService.createLog({
                    message: `${this.name} removed ${healthToRemove} health from ${target.name}.`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });

                target.health -= healthToRemove;
            }
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