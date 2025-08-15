import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Lemur } from "../../puppy/tier-2/lemur.class";

export class AyeAye extends Pet {
    name = "Aye-aye";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 3;
    health = 5;
    private attackCounter = 0;

    enemyAttack(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        
        if (!tiger) {
            this.attackCounter++;
        }
        
        // Check if counter reached (every 8 attacks)
        if (this.attackCounter % 8 != 0) {
            this.superEnemyAttack(gameApi, pet, tiger);
            return;
        }
        
        this.abilityService.setCounterEvent({
            callback: () => {
                // Summon two Lemurs
                for (let i = 0; i < 2; i++) {
                    let lemurAttack = 3; // Base Lemur stats
                    let lemurHealth = 3; // Base Lemur stats
                    let lemur = new Lemur(this.logService, this.abilityService, this.parent, lemurHealth, lemurAttack, 0, 0);
                    
                    if (this.parent.summonPet(lemur, this.savedPosition)) {
                        this.logService.createLog({
                            message: `${this.name} summoned a ${lemurAttack}/${lemurHealth} ${lemur.name}.`,
                            type: 'ability',
                            player: this.parent,
                            tiger: tiger
                        });
                    }
                }
                
                // Give all friends +attack and +health
                let statGain = this.level * 3; // 3/6/9 based on level
                for (let friend of this.parent.petArray.filter(pet => pet != this && pet.alive)) {
                    friend.increaseAttack(statGain);
                    friend.increaseHealth(statGain);
                    this.logService.createLog({
                        message: `${this.name} gave ${friend.name} +${statGain} attack and +${statGain} health.`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger
                    });
                }
            },
            priority: this.attack
        });
        
        this.superEnemyAttack(gameApi, pet, tiger);
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