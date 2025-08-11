import { TestBed } from '@angular/core/testing';
import { Durian } from '../../app/classes/equipment/golden/durian.class';
import { LogService } from '../../app/services/log.service';
import { AbilityService } from '../../app/services/ability.service';
import { Pet } from '../../app/classes/pet.class';
import { Panther } from '../../app/classes/pets/puppy/tier-5/panther.class';
import { Player } from '../../app/classes/player.class';

describe('Durian Equipment', () => {
    let equipment: Durian;
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
            health: 15
        });
        
        // Create mock players
        mockPlayer = jasmine.createSpyObj('Player', ['getLastPet', 'getHighestHealthPet', 'getLowestHealthPet']);
        mockOpponent = jasmine.createSpyObj('Player', ['getLastPet', 'getHighestHealthPet', 'getLowestHealthPet']);
        
        // Set up getHighestHealthPet to return our target with random flag
        mockOpponent.getHighestHealthPet.and.returnValue({ 
            pet: mockTargetPet, 
            random: false 
        });
        
        // Create game API mock
        gameApi = {
            player: mockPlayer,
            opponet: mockOpponent
        };

        // Create mock pets
        mockPet = jasmine.createSpyObj('Pet', ['givePetEquipment'], {
            name: 'TestPet',
            parent: mockPlayer,
            equipment: { name: 'Durian' },
            originalBeforeAttack: null
        });

        mockPanther = jasmine.createSpyObj('Panther', ['givePetEquipment'], {
            name: 'TestPanther',
            parent: mockPlayer,
            equipment: { name: 'Durian' },
            level: 2,
            originalBeforeAttack: null
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: LogService, useValue: mockLogService },
                { provide: AbilityService, useValue: mockAbilityService }
            ]
        });

        equipment = new Durian(mockLogService, mockAbilityService);
    });

    it('should be created', () => {
        expect(equipment).toBeTruthy();
        expect(equipment.name).toBe('Durian');
        expect(equipment.equipmentClass).toBe('beforeAttack');
    });

    it('should reduce highest health pet by 33%', () => {
        mockTargetPet.health = 15;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify targeting and health reduction
        expect(mockOpponent.getHighestHealthPet).toHaveBeenCalled();
        // Health should be reduced to 67% (15 * 0.67 = 10.05, floored = 10)
        expect(mockTargetPet.health).toBe(10);
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'Durian reduced TargetPet health by 33% (10)',
            type: 'ability',
            player: mockPlayer,
            randomEvent: false
        });
    });

    it('should not reduce health below 1', () => {
        mockTargetPet.health = 2;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Health should not go below 1 (2 * 0.67 = 1.34, floored = 1, but max(1, 1) = 1)
        expect(mockTargetPet.health).toBe(1);
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'Durian reduced TargetPet health by 33% (1)',
            type: 'ability',
            player: mockPlayer,
            randomEvent: false
        });
    });

    it('should repeat for Panther level + 1 times', () => {
        mockTargetPet.health = 15;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPanther);
        
        // Call the beforeAttack method
        mockPanther.beforeAttack(gameApi);
        
        // Verify health reduction called 3 times (level 2 + 1 = 3)
        expect(mockOpponent.getHighestHealthPet).toHaveBeenCalledTimes(3);
        expect(mockLogService.createLog).toHaveBeenCalledTimes(3);
        
        // After 3 applications: 15 -> 10 -> 6 -> 4
        expect(mockTargetPet.health).toBe(4);
        
        // Check that Panther message appears in subsequent attacks
        const calls = mockLogService.createLog.calls.all();
        expect(calls[0].args[0].message).toBe('Durian reduced TargetPet health by 33% (10)');
        expect(calls[1].args[0].message).toBe('Durian reduced TargetPet health by 33% (6) (Panther)');
        expect(calls[2].args[0].message).toBe('Durian reduced TargetPet health by 33% (4) (Panther)');
    });

    it('should not trigger if equipment is removed', () => {
        // Remove equipment
        mockPet.equipment = null;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify no health reduction or logging
        expect(mockOpponent.getHighestHealthPet).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should not trigger if different equipment is equipped', () => {
        // Change equipment
        mockPet.equipment = { name: 'Other Equipment', equipmentClass: 'beforeAttack' as any, callback: () => {}, reset: () => {} };
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify no health reduction or logging
        expect(mockOpponent.getHighestHealthPet).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
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
        // No highest health pet available
        mockOpponent.getHighestHealthPet.and.returnValue({ pet: null, random: false });
        spyOn(console, 'warn');
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify warning and no health reduction
        expect(console.warn).toHaveBeenCalledWith("durian didn't find target");
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should handle random event flag', () => {
        // Set random flag to true
        mockOpponent.getHighestHealthPet.and.returnValue({ 
            pet: mockTargetPet, 
            random: true 
        });
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify random event flag is passed to log
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'Durian reduced TargetPet health by 33% (10)',
            type: 'ability',
            player: mockPlayer,
            randomEvent: true
        });
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

    it('should handle edge case where health becomes exactly 1', () => {
        mockTargetPet.health = 3;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // 3 * 0.67 = 2.01, floored = 2, max(1, 2) = 2
        expect(mockTargetPet.health).toBe(2);
    });
});