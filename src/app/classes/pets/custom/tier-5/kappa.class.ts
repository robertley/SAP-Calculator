import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { shuffle } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Kappa extends Pet {
    name = "Kappa";
    tier = 5;
    pack: Pack = 'Custom';
    attack = 4;
    health = 5;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let petPool = this.parent == gameApi.player ? gameApi.playerPetPool : gameApi.opponentPetPool;
        let tier3Pets = petPool.get(3);
        for (let i = 0; i < this.level; i++) {
            let playerSpawn = tier3Pets[Math.floor(Math.random()*tier3Pets.length)];
            let opponentSpawn = tier3Pets[Math.floor(Math.random()*tier3Pets.length)];
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let spawn = this.petService.createPet(
                        {
                            attack: 14,
                            equipment: null,
                            exp: 0,
                            health: 16,
                            mana: 0,
                            name: playerSpawn
                        }, this.parent
                    );
            
                    this.logService.createLog(
                        {
                            message: `${this.name} spawned a ${spawn.name} (14/16).`,
                            type: "ability",
                            player: this.parent,
                            tiger: tiger,
                            pteranodon: pteranodon,
                            randomEvent: true
                        }
                    )
    
                    if (this.parent.summonPet(spawn, this.savedPosition)) {
                        this.abilityService.triggerSummonedEvents(spawn);
                    }
                },
                priority: this.attack
            });

            this.abilityService.setSpawnEvent({
                callback: () => {
                    let spawn = this.petService.createPet(
                        {
                            attack: 14,
                            equipment: null,
                            exp: 0,
                            health: 16,
                            mana: 0,
                            name: opponentSpawn
                        }, this.parent.opponent
                    );
            
                    this.logService.createLog(
                        {
                            message: `${this.name} spawned a ${spawn.name} (14/16) for the opponent.`,
                            type: "ability",
                            player: this.parent,
                            tiger: tiger,
                            pteranodon: pteranodon,
                            randomEvent: true
                        }
                    )
    
                    if (this.parent.opponent.summonPet(spawn, this.savedPosition)) {
                        this.abilityService.triggerSummonedEvents(spawn);
                    }
                },
                priority: this.attack
            });
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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