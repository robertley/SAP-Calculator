import { TestBed } from '@angular/core/testing';
import { Tomato } from '../../app/classes/equipment/golden/tomato.class';
import { LogService } from '../../app/services/log.service';
import { AbilityService } from '../../app/services/ability.service';
import { Pet } from '../../app/classes/pet.class';
import { Panther } from '../../app/classes/pets/puppy/tier-5/panther.class';
import { Player } from '../../app/classes/player.class';

describe('Tomato Equipment', () => {
    let equipment: Tomato;
    let mockLogService: jasmine.SpyObj<LogService>;
    let mockAbilityService: jasmine.SpyObj<AbilityService>;
    let mockPet: jasmine.SpyObj<Pet>;
    let mockPanther: jasmine.SpyObj<Panther>;
    let mockTargetPet: jasmine.SpyObj<Pet>;
    let mockPlayer: jasmine.SpyObj<Player>;
    let mockOpponent: jasmine.SpyObj<Player>;
    let gameApi: any;

    beforeEach(() => {
        // Create mock services
        mockLogService = jasmine.createSpyObj('LogService', ['createLog']);
        mockAbilityService = jasmine.createSpyObj('AbilityService', [
            'setHurtEvent', 'setKnockOutEvent', 
            'triggerFriendHurtEvents', 'triggerEnemyHurtEvents'
        ]);
        
        // Create mock target pet
        mockTargetPet = jasmine.createSpyObj('Pet', ['useDefenseEquipment'], {
            name: 'TargetPet',
            health: 15,
            alive: true,
            parent: mockOpponent,
            hurt: jasmine.createSpy('hurt')
        });
        
        // Create mock players
        mockPlayer = jasmine.createSpyObj('Player', ['getLastPet', 'getHighestHealthPet', 'getLowestHealthPet']);
        mockOpponent = jasmine.createSpyObj('Player', ['getLastPet', 'getHighestHealthPet', 'getLowestHealthPet']);
        
        // Set up getLastPet to return our target
        mockOpponent.getLastPet.and.returnValue(mockTargetPet);
        
        // Create game API mock
        gameApi = {
            player: mockPlayer,
            opponet: mockOpponent
        };

        // Create mock pets
        mockPet = jasmine.createSpyObj('Pet', [
            'calculateDamgae', 'getManticoreMult', 'givePetEquipment'
        ], {
            name: 'TestPet',
            parent: mockPlayer,
            equipment: { name: 'Tomato' },
            originalBeforeAttack: null,
            attack: 7,
            knockOut: null
        });

        mockPanther = jasmine.createSpyObj('Panther', [
            'calculateDamgae', 'getManticoreMult', 'givePetEquipment'
        ], {
            name: 'TestPanther',
            parent: mockPlayer,
            equipment: { name: 'Tomato' },
            level: 2,
            attack: 7,
            originalBeforeAttack: null,
            knockOut: null
        });

        // Mock damage calculation
        mockPet.calculateDamgae.and.returnValue({ 
            damage: 10, 
            defenseEquipment: null, 
            attackEquipment: null, 
            fortuneCookie: false, 
            nurikabe: 0 
        });
        mockPanther.calculateDamgae.and.returnValue({ 
            damage: 10, 
            defenseEquipment: null, 
            attackEquipment: null, 
            fortuneCookie: false, 
            nurikabe: 0 
        });
        
        mockPet.getManticoreMult.and.returnValue([]);
        mockPanther.getManticoreMult.and.returnValue([]);

        TestBed.configureTestingModule({
            providers: [
                { provide: LogService, useValue: mockLogService },
                { provide: AbilityService, useValue: mockAbilityService }
            ]
        });

        equipment = new Tomato(mockLogService, mockAbilityService);
    });

    it('should be created', () => {
        expect(equipment).toBeTruthy();
        expect(equipment.name).toBe('Tomato');
        expect(equipment.equipmentClass).toBe('beforeAttack');
    });

    it('should deal damage to last enemy pet', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify targeting and damage
        expect(mockOpponent.getLastPet).toHaveBeenCalled();
        expect(mockPet.calculateDamgae).toHaveBeenCalledWith(mockTargetPet, [], 10, true);
        expect(mockTargetPet.health).toBe(5); // 15 - 10 = 5
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'TestPet sniped TargetPet for 10 (Tomato).',
            type: 'attack',
            player: mockPlayer
        });
    });

    it('should repeat for Panther level + 1 times', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPanther);
        
        // Call the beforeAttack method
        mockPanther.beforeAttack(gameApi);
        
        // Verify damage calculation called 3 times (level 2 + 1 = 3)
        expect(mockPanther.calculateDamgae).toHaveBeenCalledTimes(3);
        expect(mockTargetPet.health).toBe(-15); // 15 - (10 * 3) = -15
        expect(mockLogService.createLog).toHaveBeenCalledTimes(3);
        
        // Check that Panther message appears in subsequent attacks
        const calls = mockLogService.createLog.calls.all();
        expect(calls[0].args[0].message).toBe('TestPanther sniped TargetPet for 10 (Tomato).');
        expect(calls[1].args[0].message).toBe('TestPanther sniped TargetPet for 10 (Tomato) (Panther).');
        expect(calls[2].args[0].message).toBe('TestPanther sniped TargetPet for 10 (Tomato) (Panther).');
    });

    it('should not trigger if equipment is removed', () => {
        // Remove equipment
        mockPet.equipment = null;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify no damage calculation or logging
        expect(mockPet.calculateDamgae).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should not trigger if different equipment is equipped', () => {
        // Change equipment
        mockPet.equipment = { name: 'Other Equipment', equipmentClass: 'beforeAttack' as any, callback: () => {}, reset: () => {} };
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify no damage calculation or logging
        expect(mockPet.calculateDamgae).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should handle defense equipment', () => {
        const mockDefenseEquipment = { name: 'Armor', power: -3, equipmentClass: 'defense' as any, callback: () => {}, reset: () => {} };
        mockPet.calculateDamgae.and.returnValue({ 
            damage: 7, 
            defenseEquipment: mockDefenseEquipment,
            attackEquipment: null,
            fortuneCookie: false,
            nurikabe: 0
        });
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify defense equipment interaction
        expect(mockTargetPet.useDefenseEquipment).toHaveBeenCalled();
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'TestPet sniped TargetPet for 7 (Armor +3) (Tomato).',
            type: 'attack',
            player: mockPlayer
        });
    });

    it('should trigger hurt events', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify hurt event is set
        expect(mockAbilityService.setHurtEvent).toHaveBeenCalledWith({
            callback: jasmine.any(Function),
            priority: 7,
            player: mockOpponent,
            callbackPet: mockTargetPet
        });
    });

    it('should trigger friend and enemy hurt events if target is alive and damage > 0', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify friend and enemy hurt events
        expect(mockAbilityService.triggerFriendHurtEvents).toHaveBeenCalledWith(mockOpponent, mockTargetPet);
        expect(mockAbilityService.triggerEnemyHurtEvents).toHaveBeenCalledWith(mockPlayer, mockTargetPet);
    });

    it('should trigger knockout event if target health drops below 1', () => {
        mockTargetPet.health = 5;
        mockPet.knockOut = jasmine.createSpy('knockOut');
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify knockout event is set (health goes from 5 to -5)
        expect(mockAbilityService.setKnockOutEvent).toHaveBeenCalledWith({
            callback: jasmine.any(Function),
            priority: 7,
            callbackPet: mockTargetPet
        });
    });

    it('should remove equipment after use', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify equipment is removed
        expect(mockPet.givePetEquipment).toHaveBeenCalledWith(null);
    });

    it('should handle no available targets', () => {
        // No last pet available
        mockOpponent.getLastPet.and.returnValue(null);
        spyOn(console, 'warn');
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify warning and no damage
        expect(console.warn).toHaveBeenCalledWith("tomato didn't find target");
        expect(mockPet.calculateDamgae).not.toHaveBeenCalled();
    });

    it('should not trigger enemy hurt events if damage is 0', () => {
        // Set damage to 0
        mockPet.calculateDamgae.and.returnValue({ 
            damage: 0, 
            defenseEquipment: null,
            attackEquipment: null,
            fortuneCookie: false,
            nurikabe: 0
        });
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify friend hurt events still trigger but not enemy hurt events
        expect(mockAbilityService.triggerFriendHurtEvents).toHaveBeenCalledWith(mockOpponent, mockTargetPet);
        expect(mockAbilityService.triggerEnemyHurtEvents).not.toHaveBeenCalled();
    });

    it('should call original beforeAttack if it exists', () => {
        const originalBeforeAttack = jasmine.createSpy('originalBeforeAttack');
        mockPet.originalBeforeAttack = originalBeforeAttack;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify original beforeAttack was called
        expect(originalBeforeAttack).toHaveBeenCalledWith(gameApi);
    });
});