using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using Il2CppDummyDll;
using Spacewood.Core.Models;
using Spacewood.Core.Models.Abilities;
using Spacewood.Core.Models.Item;
using Spacewood.SpacewoodCore.Enums;

namespace Spacewood.Core.Enums
{
	// Token: 0x020003F5 RID: 1013
	[Token(Token = "0x20003F5")]
	public class MinionTemplate : ItemTemplate
	{
		// Token: 0x1700045F RID: 1119
		// (get) Token: 0x06001A19 RID: 6681 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06001A1A RID: 6682 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700045F")]
		public List<TribeEnum> Tribes
		{
			[Token(Token = "0x6001A19")]
			[Address(RVA = "0x46E120", Offset = "0x46C720", VA = "0x18046E120")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6001A1A")]
			[Address(RVA = "0x46E130", Offset = "0x46C730", VA = "0x18046E130")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000460 RID: 1120
		// (get) Token: 0x06001A1B RID: 6683 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x17000460")]
		public TargetsBase Aim
		{
			[Token(Token = "0x6001A1B")]
			[Address(RVA = "0x46DFD0", Offset = "0x46C5D0", VA = "0x18046DFD0")]
			get
			{
				return null;
			}
		}

		// Token: 0x06001A1C RID: 6684 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x6001A1C")]
		[Address(RVA = "0x46DED0", Offset = "0x46C4D0", VA = "0x18046DED0")]
		public MinionTemplate(MinionEnum @enum)
		{
		}

		// Token: 0x06001A1D RID: 6685 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A1D")]
		[Address(RVA = "0x46CDF0", Offset = "0x46B3F0", VA = "0x18046CDF0")]
		public MinionTemplate AddAbility(AbilityEnum ability)
		{
			return null;
		}

		// Token: 0x06001A1E RID: 6686 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A1E")]
		[Address(RVA = "0x46DBC0", Offset = "0x46C1C0", VA = "0x18046DBC0")]
		public MinionTemplate SetStats(int attack, int health)
		{
			return null;
		}

		// Token: 0x06001A1F RID: 6687 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A1F")]
		[Address(RVA = "0x46DB20", Offset = "0x46C120", VA = "0x18046DB20")]
		public MinionTemplate SetStatsMax(int attack, int health)
		{
			return null;
		}

		// Token: 0x06001A20 RID: 6688 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A20")]
		[Address(RVA = "0x46D9A0", Offset = "0x46BFA0", VA = "0x18046D9A0")]
		public MinionTemplate SetPower(int power)
		{
			return null;
		}

		// Token: 0x06001A21 RID: 6689 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A21")]
		[Address(RVA = "0x46DEB0", Offset = "0x46C4B0", VA = "0x18046DEB0")]
		public MinionTemplate SetUnreleased()
		{
			return null;
		}

		// Token: 0x06001A22 RID: 6690 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A22")]
		[Address(RVA = "0x46D6D0", Offset = "0x46BCD0", VA = "0x18046D6D0")]
		public MinionTemplate SetAttack(int value)
		{
			return null;
		}

		// Token: 0x06001A23 RID: 6691 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A23")]
		[Address(RVA = "0x46D7A0", Offset = "0x46BDA0", VA = "0x18046D7A0")]
		public MinionTemplate SetHealth(int value)
		{
			return null;
		}

		// Token: 0x06001A24 RID: 6692 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A24")]
		[Address(RVA = "0x46D540", Offset = "0x46BB40", VA = "0x18046D540")]
		public MinionTemplate SetActive(bool value)
		{
			return null;
		}

		// Token: 0x06001A25 RID: 6693 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A25")]
		[Address(RVA = "0x46D520", Offset = "0x46BB20", VA = "0x18046D520")]
		public MinionTemplate SetAbout(string value)
		{
			return null;
		}

		// Token: 0x06001A26 RID: 6694 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A26")]
		[Address(RVA = "0x46D7D0", Offset = "0x46BDD0", VA = "0x18046D7D0")]
		public MinionTemplate SetName(string value)
		{
			return null;
		}

		// Token: 0x06001A27 RID: 6695 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A27")]
		[Address(RVA = "0x46D780", Offset = "0x46BD80", VA = "0x18046D780")]
		public MinionTemplate SetElusive()
		{
			return null;
		}

		// Token: 0x06001A28 RID: 6696 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A28")]
		[Address(RVA = "0x46D7F0", Offset = "0x46BDF0", VA = "0x18046D7F0")]
		public MinionTemplate SetNote(string value)
		{
			return null;
		}

		// Token: 0x06001A29 RID: 6697 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A29")]
		[Address(RVA = "0x46DBE0", Offset = "0x46C1E0", VA = "0x18046DBE0")]
		public MinionTemplate SetTier(int value, [Optional] int? max)
		{
			return null;
		}

		// Token: 0x06001A2A RID: 6698 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A2A")]
		[Address(RVA = "0x46D6F0", Offset = "0x46BCF0", VA = "0x18046D6F0")]
		public MinionTemplate SetCountdown(int value)
		{
			return null;
		}

		// Token: 0x06001A2B RID: 6699 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A2B")]
		[Address(RVA = "0x46D770", Offset = "0x46BD70", VA = "0x18046D770")]
		public MinionTemplate SetDifficulty(Difficulty value)
		{
			return null;
		}

		// Token: 0x06001A2C RID: 6700 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A2C")]
		[Address(RVA = "0x46DA90", Offset = "0x46C090", VA = "0x18046DA90")]
		public MinionTemplate SetRollable(bool value)
		{
			return null;
		}

		// Token: 0x06001A2D RID: 6701 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A2D")]
		[Address(RVA = "0x46DC50", Offset = "0x46C250", VA = "0x18046DC50")]
		public MinionTemplate SetToken()
		{
			return null;
		}

		// Token: 0x06001A2E RID: 6702 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A2E")]
		[Address(RVA = "0x46D6E0", Offset = "0x46BCE0", VA = "0x18046D6E0")]
		public MinionTemplate SetBad()
		{
			return null;
		}

		// Token: 0x06001A2F RID: 6703 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A2F")]
		[Address(RVA = "0x46D930", Offset = "0x46BF30", VA = "0x18046D930")]
		public MinionTemplate SetPerkAffiliation(Perk perk)
		{
			return null;
		}

		// Token: 0x06001A30 RID: 6704 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A30")]
		[Address(RVA = "0x46CFC0", Offset = "0x46B5C0", VA = "0x18046CFC0")]
		public MinionTemplate AddPack(Pack pack)
		{
			return null;
		}

		// Token: 0x06001A31 RID: 6705 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A31")]
		[Address(RVA = "0x46D8B0", Offset = "0x46BEB0", VA = "0x18046D8B0")]
		public MinionTemplate SetPack(Pack pack)
		{
			return null;
		}

		// Token: 0x06001A32 RID: 6706 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A32")]
		[Address(RVA = "0x46CF60", Offset = "0x46B560", VA = "0x18046CF60")]
		public MinionTemplate AddPackOwnership(Pack pack)
		{
			return null;
		}

		// Token: 0x06001A33 RID: 6707 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A33")]
		[Address(RVA = "0x46D830", Offset = "0x46BE30", VA = "0x18046D830")]
		public MinionTemplate SetPackOwnership(Pack pack)
		{
			return null;
		}

		// Token: 0x06001A34 RID: 6708 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A34")]
		[Address(RVA = "0x46D670", Offset = "0x46BC70", VA = "0x18046D670")]
		public MinionTemplate SetArchetypeProducer(params Archetype[] archetypes)
		{
			return null;
		}

		// Token: 0x06001A35 RID: 6709 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A35")]
		[Address(RVA = "0x46D550", Offset = "0x46BB50", VA = "0x18046D550")]
		public MinionTemplate SetArchetypeConsumer(params Archetype[] archetypes)
		{
			return null;
		}

		// Token: 0x06001A36 RID: 6710 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A36")]
		[Address(RVA = "0x46D610", Offset = "0x46BC10", VA = "0x18046D610")]
		public MinionTemplate SetArchetypeCustom(params Archetype[] archetypes)
		{
			return null;
		}

		// Token: 0x06001A37 RID: 6711 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A37")]
		[Address(RVA = "0x46D5B0", Offset = "0x46BBB0", VA = "0x18046D5B0")]
		public MinionTemplate SetArchetypeCustomFilter(params Archetype[] archetypes)
		{
			return null;
		}

		// Token: 0x06001A38 RID: 6712 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A38")]
		[Address(RVA = "0x46DA30", Offset = "0x46C030", VA = "0x18046DA30")]
		public MinionTemplate SetRoles(params Role[] roles)
		{
			return null;
		}

		// Token: 0x06001A39 RID: 6713 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A39")]
		[Address(RVA = "0x46DA20", Offset = "0x46C020", VA = "0x18046DA20")]
		public MinionTemplate SetRewardless(bool value = true)
		{
			return null;
		}

		// Token: 0x06001A3A RID: 6714 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A3A")]
		[Address(RVA = "0x46D820", Offset = "0x46BE20", VA = "0x18046D820")]
		public MinionTemplate SetOldSkin(bool value = true)
		{
			return null;
		}

		// Token: 0x06001A3B RID: 6715 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A3B")]
		[Address(RVA = "0x46DEC0", Offset = "0x46C4C0", VA = "0x18046DEC0")]
		public MinionTemplate SetWeeklyDisabled()
		{
			return null;
		}

		// Token: 0x06001A3C RID: 6716 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A3C")]
		[Address(RVA = "0x46DC60", Offset = "0x46C260", VA = "0x18046DC60")]
		public MinionTemplate SetTribeElements()
		{
			return null;
		}

		// Token: 0x06001A3D RID: 6717 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A3D")]
		[Address(RVA = "0x46DAB0", Offset = "0x46C0B0", VA = "0x18046DAB0")]
		public MinionTemplate SetSoundEnum(MinionEnum value)
		{
			return null;
		}

		// Token: 0x06001A3E RID: 6718 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A3E")]
		[Address(RVA = "0x46DAA0", Offset = "0x46C0A0", VA = "0x18046DAA0")]
		public MinionTemplate SetSoundDisabled()
		{
			return null;
		}

		// Token: 0x06001A3F RID: 6719 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A3F")]
		[Address(RVA = "0x46D020", Offset = "0x46B620", VA = "0x18046D020")]
		public MinionTemplate AddStackRule(MinionStackRule rule)
		{
			return null;
		}

		// Token: 0x06001A40 RID: 6720 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A40")]
		[Address(RVA = "0x46D210", Offset = "0x46B810", VA = "0x18046D210")]
		public MinionStackRule FindStackRule(MinionEnum target)
		{
			return null;
		}

		// Token: 0x06001A41 RID: 6721 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A41")]
		[Address(RVA = "0x46D7C0", Offset = "0x46BDC0", VA = "0x18046D7C0")]
		public MinionTemplate SetIncludeVersionChange(int value)
		{
			return null;
		}

		// Token: 0x06001A42 RID: 6722 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A42")]
		[Address(RVA = "0x46D7B0", Offset = "0x46BDB0", VA = "0x18046D7B0")]
		public MinionTemplate SetIgnoreVersionChange(int value)
		{
			return null;
		}

		// Token: 0x06001A43 RID: 6723 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A43")]
		[Address(RVA = "0x46D760", Offset = "0x46BD60", VA = "0x18046D760")]
		public MinionTemplate SetCustomDisabled()
		{
			return null;
		}

		// Token: 0x06001A44 RID: 6724 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A44")]
		[Address(RVA = "0x46D370", Offset = "0x46B970", VA = "0x18046D370")]
		public ItemRelations GetAbilityRelations()
		{
			return null;
		}

		// Token: 0x06001A45 RID: 6725 RVA: 0x00009A38 File Offset: 0x00007C38
		[Token(Token = "0x6001A45")]
		[Address(RVA = "0x46D4C0", Offset = "0x46BAC0", VA = "0x18046D4C0")]
		public MinionEnum GetSoundEnum()
		{
			return MinionEnum.Ant;
		}

		// Token: 0x06001A46 RID: 6726 RVA: 0x00009A50 File Offset: 0x00007C50
		[Token(Token = "0x6001A46")]
		[Address(RVA = "0x46D140", Offset = "0x46B740", VA = "0x18046D140")]
		public bool CanAppearWeekly()
		{
			return default(bool);
		}

		// Token: 0x06001A47 RID: 6727 RVA: 0x00009A68 File Offset: 0x00007C68
		[Token(Token = "0x6001A47")]
		[Address(RVA = "0x46D1D0", Offset = "0x46B7D0", VA = "0x18046D1D0")]
		public bool CheckEnum(string value)
		{
			return default(bool);
		}

		// Token: 0x06001A48 RID: 6728 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A48")]
		[Address(RVA = "0x46D9B0", Offset = "0x46BFB0", VA = "0x18046D9B0")]
		public MinionTemplate SetPremium(bool value = true)
		{
			return null;
		}

		// Token: 0x06001A49 RID: 6729 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A49")]
		[Address(RVA = "0x46DEA0", Offset = "0x46C4A0", VA = "0x18046DEA0")]
		public MinionTemplate SetUnique()
		{
			return null;
		}

		// Token: 0x06001A4A RID: 6730 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A4A")]
		[Address(RVA = "0x46D9C0", Offset = "0x46BFC0", VA = "0x18046D9C0")]
		public MinionTemplate SetReleaseVersion(int value)
		{
			return null;
		}

		// Token: 0x06001A4B RID: 6731 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6001A4B")]
		[Address(RVA = "0x46D790", Offset = "0x46BD90", VA = "0x18046D790")]
		public MinionTemplate SetForceActivateImmune(bool value = true)
		{
			return null;
		}

		// Token: 0x04001B2B RID: 6955
		[Token(Token = "0x4001B2B")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xB8")]
		public MinionEnum Enum;

		// Token: 0x04001B2C RID: 6956
		[Token(Token = "0x4001B2C")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xBC")]
		public MinionEnum? SoundEnum;

		// Token: 0x04001B2D RID: 6957
		[Token(Token = "0x4001B2D")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xC4")]
		public bool SoundDisabled;

		// Token: 0x04001B2E RID: 6958
		[Token(Token = "0x4001B2E")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xC8")]
		public int Attack;

		// Token: 0x04001B2F RID: 6959
		[Token(Token = "0x4001B2F")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xCC")]
		public int? AttackMax;

		// Token: 0x04001B30 RID: 6960
		[Token(Token = "0x4001B30")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xD4")]
		public int Health;

		// Token: 0x04001B31 RID: 6961
		[Token(Token = "0x4001B31")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xD8")]
		public int? HealthMax;

		// Token: 0x04001B32 RID: 6962
		[Token(Token = "0x4001B32")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xE0")]
		public int? Countdown;

		// Token: 0x04001B33 RID: 6963
		[Token(Token = "0x4001B33")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xE8")]
		public bool Rewardless;

		// Token: 0x04001B34 RID: 6964
		[Token(Token = "0x4001B34")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xE9")]
		public bool WeeklyDisabled;

		// Token: 0x04001B35 RID: 6965
		[Token(Token = "0x4001B35")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xEC")]
		public Perk? PerkAffiliation;

		// Token: 0x04001B36 RID: 6966
		[Token(Token = "0x4001B36")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xF4")]
		public MinionType Type;

		// Token: 0x04001B37 RID: 6967
		[Token(Token = "0x4001B37")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xF8")]
		public RelicType RelicType;

		// Token: 0x04001B38 RID: 6968
		[Token(Token = "0x4001B38")]
		[Il2CppDummyDll.FieldOffset(Offset = "0xFC")]
		public Difficulty Difficulty;

		// Token: 0x04001B39 RID: 6969
		[Token(Token = "0x4001B39")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x100")]
		public int TierMax;

		// Token: 0x04001B3A RID: 6970
		[Token(Token = "0x4001B3A")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x104")]
		public bool HasOldSkin;

		// Token: 0x04001B3C RID: 6972
		[Token(Token = "0x4001B3C")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x110")]
		public string Note;

		// Token: 0x04001B3D RID: 6973
		[Token(Token = "0x4001B3D")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x118")]
		public bool AttackWithHealth;

		// Token: 0x04001B3E RID: 6974
		[Token(Token = "0x4001B3E")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x120")]
		public List<MinionStackRule> StackRules;

		// Token: 0x04001B3F RID: 6975
		[Token(Token = "0x4001B3F")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x128")]
		public bool ForceActivateImmune;

		// Token: 0x04001B40 RID: 6976
		[Token(Token = "0x4001B40")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x130")]
		public List<AbilityEnum> AbilityEnums;

		// Token: 0x04001B41 RID: 6977
		[Token(Token = "0x4001B41")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x138")]
		public List<MinionAbilityModel> Abilities;
	}
}
