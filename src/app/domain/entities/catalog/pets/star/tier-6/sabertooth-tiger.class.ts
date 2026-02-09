import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';


export class SabertoothTiger extends Pet {
  name = 'Sabertooth Tiger';
  tier = 6;
  pack: Pack = 'Star';
  attack = 4;
  health = 5;
  initAbilities(): void {
    this.addAbility(
      new SabertoothTigerAbility(
        this,
        this.logService,
        this.abilityService,
        this.petService,
      ),
    );
    super.initAbilities();
  }

  resetPet(): void {
    super.resetPet();
  }
  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    protected petService: PetService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
    timesHurt?: number,
  ) {
    super(logService, abilityService, parent);
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    this.timesHurt = timesHurt ?? 0;
    this.originalTimesHurt = this.timesHurt;
  }
}


export class SabertoothTigerAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private petService: PetService;
  private timesHurtOverride: number | null;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    petService: PetService,
    timesHurtOverride?: number,
  ) {
    super({
      name: 'SabertoothTigerAbility',
      owner: owner,
      triggers: ['PostRemovalFaint'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.petService = petService;
    this.timesHurtOverride = timesHurtOverride ?? null;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;

    let totalHurt = this.timesHurtOverride ?? owner.timesHurt;
    if (totalHurt > 0) {
      for (let i = 0; i < this.level; i++) {
        // 1/2/3 Mammoths based on level
        let mammothAttack = Math.min(2 * totalHurt, 50);
        let mammothHealth = Math.min(3 * totalHurt, 50);

        let mammoth = this.petService.createPet(
          {
            name: 'Mammoth',
            attack: mammothAttack,
            health: mammothHealth,
            equipment: null,
            mana: 0,
            exp: 0,
          },
          owner.parent,
        );

        let summonResult = owner.parent.summonPet(
          mammoth,
          owner.savedPosition,
          false,
          owner,
        );
        if (summonResult.success) {
          this.logService.createLog({
            message: `${owner.name} summoned ${mammoth.name} (${mammothAttack}/${mammothHealth}).`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: summonResult.randomEvent,
          });
        }
      }
    }

    // Tiger system: trigger Tiger execution at the end
    this.triggerTigerExecution(context);
  }

  copy(newOwner: Pet): SabertoothTigerAbility {
    return new SabertoothTigerAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.petService,
      this.timesHurtOverride ?? this.owner.timesHurt,
    );
  }
}



