using System;
using Il2CppDummyDll;

namespace Spacewood.Core.Enums
{
	// Token: 0x0200043B RID: 1083
	[Token(Token = "0x200043B")]
	public enum TriggerEnum
	{
		// Token: 0x04001E63 RID: 7779
		[Token(Token = "0x4001E63")]
		None,
		// Token: 0x04001E64 RID: 7780
		[Token(Token = "0x4001E64")]
		Composite,
		// Token: 0x04001E65 RID: 7781
		[Token(Token = "0x4001E65")]
		StartTurn,
		// Token: 0x04001E66 RID: 7782
		[Token(Token = "0x4001E66")]
		EndTurn,
		// Token: 0x04001E67 RID: 7783
		[Token(Token = "0x4001E67")]
		StartBattle,
		// Token: 0x04001E68 RID: 7784
		[Token(Token = "0x4001E68")]
		ShopUpgrade,
		// Token: 0x04001E69 RID: 7785
		[Token(Token = "0x4001E69")]
		ThisBought,
		// Token: 0x04001E6A RID: 7786
		[Token(Token = "0x4001E6A")]
		ThisSold,
		// Token: 0x04001E6B RID: 7787
		[Token(Token = "0x4001E6B")]
		FoodBought,
		// Token: 0x04001E6C RID: 7788
		[Token(Token = "0x4001E6C")]
		FoodEatenByAny,
		// Token: 0x04001E6D RID: 7789
		[Token(Token = "0x4001E6D")]
		ThisSummoned,
		// Token: 0x04001E6E RID: 7790
		[Token(Token = "0x4001E6E")]
		OtherSummoned,
		// Token: 0x04001E6F RID: 7791
		[Token(Token = "0x4001E6F")]
		EnemySummoned,
		// Token: 0x04001E70 RID: 7792
		[Token(Token = "0x4001E70")]
		FriendSummoned,
		// Token: 0x04001E71 RID: 7793
		[Token(Token = "0x4001E71")]
		ThisTransformed,
		// Token: 0x04001E72 RID: 7794
		[Token(Token = "0x4001E72")]
		EnemyPushed,
		// Token: 0x04001E73 RID: 7795
		[Token(Token = "0x4001E73")]
		BeforeThisAttacks,
		// Token: 0x04001E74 RID: 7796
		[Token(Token = "0x4001E74")]
		BeforeFriendAttacks,
		// Token: 0x04001E75 RID: 7797
		[Token(Token = "0x4001E75")]
		ThisDied,
		// Token: 0x04001E76 RID: 7798
		[Token(Token = "0x4001E76")]
		BeforeThisDies,
		// Token: 0x04001E77 RID: 7799
		[Token(Token = "0x4001E77")]
		ThisDiesForPerks,
		// Token: 0x04001E78 RID: 7800
		[Token(Token = "0x4001E78")]
		FriendDied,
		// Token: 0x04001E79 RID: 7801
		[Token(Token = "0x4001E79")]
		ThisKilled,
		// Token: 0x04001E7A RID: 7802
		[Token(Token = "0x4001E7A")]
		ThisHurt,
		// Token: 0x04001E7B RID: 7803
		[Token(Token = "0x4001E7B")]
		EnemyHurt,
		// Token: 0x04001E7C RID: 7804
		[Token(Token = "0x4001E7C")]
		ThisLeveledUp,
		// Token: 0x04001E7D RID: 7805
		[Token(Token = "0x4001E7D")]
		FriendLeveledUp,
		// Token: 0x04001E7E RID: 7806
		[Token(Token = "0x4001E7E")]
		AnyLeveledUp,
		// Token: 0x04001E7F RID: 7807
		[Token(Token = "0x4001E7F")]
		ShopRolled,
		// Token: 0x04001E80 RID: 7808
		[Token(Token = "0x4001E80")]
		FriendAheadDied,
		// Token: 0x04001E81 RID: 7809
		[Token(Token = "0x4001E81")]
		Tier1FriendBought,
		// Token: 0x04001E82 RID: 7810
		[Token(Token = "0x4001E82")]
		FoodEatenByThis,
		// Token: 0x04001E83 RID: 7811
		[Token(Token = "0x4001E83")]
		FriendSold,
		// Token: 0x04001E84 RID: 7812
		[Token(Token = "0x4001E84")]
		FriendAheadAttacked,
		// Token: 0x04001E85 RID: 7813
		[Token(Token = "0x4001E85")]
		FriendBought,
		// Token: 0x04001E86 RID: 7814
		[Token(Token = "0x4001E86")]
		FriendHurt,
		// Token: 0x04001E87 RID: 7815
		[Token(Token = "0x4001E87")]
		FriendlyLeveledUp,
		// Token: 0x04001E88 RID: 7816
		[Token(Token = "0x4001E88")]
		CompositeEnemySummonedOrPushed,
		// Token: 0x04001E89 RID: 7817
		[Token(Token = "0x4001E89")]
		AppleEatenByThis,
		// Token: 0x04001E8A RID: 7818
		[Token(Token = "0x4001E8A")]
		AdjacentFriendsDie,
		// Token: 0x04001E8B RID: 7819
		[Token(Token = "0x4001E8B")]
		EnemyDied,
		// Token: 0x04001E8C RID: 7820
		[Token(Token = "0x4001E8C")]
		FriendAheadHurt,
		// Token: 0x04001E8D RID: 7821
		[Token(Token = "0x4001E8D")]
		SpendGold12,
		// Token: 0x04001E8E RID: 7822
		[Token(Token = "0x4001E8E")]
		FriendDied3,
		// Token: 0x04001E8F RID: 7823
		[Token(Token = "0x4001E8F")]
		TwoFriendsDied,
		// Token: 0x04001E90 RID: 7824
		[Token(Token = "0x4001E90")]
		FriendSummoned2,
		// Token: 0x04001E91 RID: 7825
		[Token(Token = "0x4001E91")]
		FriendSummoned3,
		// Token: 0x04001E92 RID: 7826
		[Token(Token = "0x4001E92")]
		SpendGold7,
		// Token: 0x04001E93 RID: 7827
		[Token(Token = "0x4001E93")]
		ThisGainedPerk,
		// Token: 0x04001E94 RID: 7828
		[Token(Token = "0x4001E94")]
		ThisLostPerk,
		// Token: 0x04001E95 RID: 7829
		[Token(Token = "0x4001E95")]
		ThisAttacked,
		// Token: 0x04001E96 RID: 7830
		[Token(Token = "0x4001E96")]
		ClearFront,
		// Token: 0x04001E97 RID: 7831
		[Token(Token = "0x4001E97")]
		AllEnemiesDied,
		// Token: 0x04001E98 RID: 7832
		[Token(Token = "0x4001E98")]
		FriendAttacked,
		// Token: 0x04001E99 RID: 7833
		[Token(Token = "0x4001E99")]
		FriendlyAttacked3,
		// Token: 0x04001E9A RID: 7834
		[Token(Token = "0x4001E9A")]
		FriendlyAttacked2,
		// Token: 0x04001E9B RID: 7835
		[Token(Token = "0x4001E9B")]
		FriendAttacked4,
		// Token: 0x04001E9C RID: 7836
		[Token(Token = "0x4001E9C")]
		FriendAttacked5,
		// Token: 0x04001E9D RID: 7837
		[Token(Token = "0x4001E9D")]
		BuyFromShop,
		// Token: 0x04001E9E RID: 7838
		[Token(Token = "0x4001E9E")]
		SpendGold8,
		// Token: 0x04001E9F RID: 7839
		[Token(Token = "0x4001E9F")]
		SpendGold,
		// Token: 0x04001EA0 RID: 7840
		[Token(Token = "0x4001EA0")]
		SpendGold2,
		// Token: 0x04001EA1 RID: 7841
		[Token(Token = "0x4001EA1")]
		SpendGold3,
		// Token: 0x04001EA2 RID: 7842
		[Token(Token = "0x4001EA2")]
		SpendGold4,
		// Token: 0x04001EA3 RID: 7843
		[Token(Token = "0x4001EA3")]
		SpendGold5,
		// Token: 0x04001EA4 RID: 7844
		[Token(Token = "0x4001EA4")]
		SpendGold6,
		// Token: 0x04001EA5 RID: 7845
		[Token(Token = "0x4001EA5")]
		SpendGold9,
		// Token: 0x04001EA6 RID: 7846
		[Token(Token = "0x4001EA6")]
		SpendGold10,
		// Token: 0x04001EA7 RID: 7847
		[Token(Token = "0x4001EA7")]
		SpendGold11,
		// Token: 0x04001EA8 RID: 7848
		[Token(Token = "0x4001EA8")]
		Roll2,
		// Token: 0x04001EA9 RID: 7849
		[Token(Token = "0x4001EA9")]
		Roll3,
		// Token: 0x04001EAA RID: 7850
		[Token(Token = "0x4001EAA")]
		Roll4,
		// Token: 0x04001EAB RID: 7851
		[Token(Token = "0x4001EAB")]
		Roll5,
		// Token: 0x04001EAC RID: 7852
		[Token(Token = "0x4001EAC")]
		Roll6,
		// Token: 0x04001EAD RID: 7853
		[Token(Token = "0x4001EAD")]
		Roll7,
		// Token: 0x04001EAE RID: 7854
		[Token(Token = "0x4001EAE")]
		Roll8,
		// Token: 0x04001EAF RID: 7855
		[Token(Token = "0x4001EAF")]
		Roll9,
		// Token: 0x04001EB0 RID: 7856
		[Token(Token = "0x4001EB0")]
		Roll10,
		// Token: 0x04001EB1 RID: 7857
		[Token(Token = "0x4001EB1")]
		FriendBought2,
		// Token: 0x04001EB2 RID: 7858
		[Token(Token = "0x4001EB2")]
		FriendBought3,
		// Token: 0x04001EB3 RID: 7859
		[Token(Token = "0x4001EB3")]
		FriendBought4,
		// Token: 0x04001EB4 RID: 7860
		[Token(Token = "0x4001EB4")]
		FriendGainsAilment,
		// Token: 0x04001EB5 RID: 7861
		[Token(Token = "0x4001EB5")]
		ToyBroke,
		// Token: 0x04001EB6 RID: 7862
		[Token(Token = "0x4001EB6")]
		ToySummoned,
		// Token: 0x04001EB7 RID: 7863
		[Token(Token = "0x4001EB7")]
		ThisBroke,
		// Token: 0x04001EB8 RID: 7864
		[Token(Token = "0x4001EB8")]
		AfterTurns2,
		// Token: 0x04001EB9 RID: 7865
		[Token(Token = "0x4001EB9")]
		AfterTurns3,
		// Token: 0x04001EBA RID: 7866
		[Token(Token = "0x4001EBA")]
		AfterTurns4,
		// Token: 0x04001EBB RID: 7867
		[Token(Token = "0x4001EBB")]
		ThisGainedPerkOrAilment,
		// Token: 0x04001EBC RID: 7868
		[Token(Token = "0x4001EBC")]
		FriendGainsPerk,
		// Token: 0x04001EBD RID: 7869
		[Token(Token = "0x4001EBD")]
		ThisHurtOrFaint,
		// Token: 0x04001EBE RID: 7870
		[Token(Token = "0x4001EBE")]
		FriendSold2,
		// Token: 0x04001EBF RID: 7871
		[Token(Token = "0x4001EBF")]
		FriendSold3,
		// Token: 0x04001EC0 RID: 7872
		[Token(Token = "0x4001EC0")]
		FriendSold4,
		// Token: 0x04001EC1 RID: 7873
		[Token(Token = "0x4001EC1")]
		FriendSold5,
		// Token: 0x04001EC2 RID: 7874
		[Token(Token = "0x4001EC2")]
		ThisBoughtOrToyBroke,
		// Token: 0x04001EC3 RID: 7875
		[Token(Token = "0x4001EC3")]
		StartBattleOrTurn,
		// Token: 0x04001EC4 RID: 7876
		[Token(Token = "0x4001EC4")]
		AllFriendsFainted,
		// Token: 0x04001EC5 RID: 7877
		[Token(Token = "0x4001EC5")]
		BeforeStartBattle,
		// Token: 0x04001EC6 RID: 7878
		[Token(Token = "0x4001EC6")]
		FriendlyToyBroke,
		// Token: 0x04001EC7 RID: 7879
		[Token(Token = "0x4001EC7")]
		FriendlyToySummoned,
		// Token: 0x04001EC8 RID: 7880
		[Token(Token = "0x4001EC8")]
		EndTurn2,
		// Token: 0x04001EC9 RID: 7881
		[Token(Token = "0x4001EC9")]
		EndTurn3,
		// Token: 0x04001ECA RID: 7882
		[Token(Token = "0x4001ECA")]
		EndTurn4,
		// Token: 0x04001ECB RID: 7883
		[Token(Token = "0x4001ECB")]
		EndTurn5,
		// Token: 0x04001ECC RID: 7884
		[Token(Token = "0x4001ECC")]
		FriendlyGainsPerk,
		// Token: 0x04001ECD RID: 7885
		[Token(Token = "0x4001ECD")]
		FoodBought2,
		// Token: 0x04001ECE RID: 7886
		[Token(Token = "0x4001ECE")]
		FoodBought3,
		// Token: 0x04001ECF RID: 7887
		[Token(Token = "0x4001ECF")]
		FoodBought4,
		// Token: 0x04001ED0 RID: 7888
		[Token(Token = "0x4001ED0")]
		FoodBought5,
		// Token: 0x04001ED1 RID: 7889
		[Token(Token = "0x4001ED1")]
		FriendJumped,
		// Token: 0x04001ED2 RID: 7890
		[Token(Token = "0x4001ED2")]
		FriendJumped2,
		// Token: 0x04001ED3 RID: 7891
		[Token(Token = "0x4001ED3")]
		FriendJumped3,
		// Token: 0x04001ED4 RID: 7892
		[Token(Token = "0x4001ED4")]
		FriendGainedAttack,
		// Token: 0x04001ED5 RID: 7893
		[Token(Token = "0x4001ED5")]
		FriendGainedHealth,
		// Token: 0x04001ED6 RID: 7894
		[Token(Token = "0x4001ED6")]
		ThisGainedAttack,
		// Token: 0x04001ED7 RID: 7895
		[Token(Token = "0x4001ED7")]
		ThisGainedHealth,
		// Token: 0x04001ED8 RID: 7896
		[Token(Token = "0x4001ED8")]
		FriendSummoned4,
		// Token: 0x04001ED9 RID: 7897
		[Token(Token = "0x4001ED9")]
		FriendSummoned5,
		// Token: 0x04001EDA RID: 7898
		[Token(Token = "0x4001EDA")]
		ShopRewardStocked,
		// Token: 0x04001EDB RID: 7899
		[Token(Token = "0x4001EDB")]
		ThisGainedMana,
		// Token: 0x04001EDC RID: 7900
		[Token(Token = "0x4001EDC")]
		EnemyGainedAilment,
		// Token: 0x04001EDD RID: 7901
		[Token(Token = "0x4001EDD")]
		FriendlyLeveledUp2,
		// Token: 0x04001EDE RID: 7902
		[Token(Token = "0x4001EDE")]
		ThisGainedAilment,
		// Token: 0x04001EDF RID: 7903
		[Token(Token = "0x4001EDF")]
		ThisGainedStrawberry,
		// Token: 0x04001EE0 RID: 7904
		[Token(Token = "0x4001EE0")]
		EnemyHurtOrPushed,
		// Token: 0x04001EE1 RID: 7905
		[Token(Token = "0x4001EE1")]
		AnyoneAttack,
		// Token: 0x04001EE2 RID: 7906
		[Token(Token = "0x4001EE2")]
		ThisKilledEnemy,
		// Token: 0x04001EE3 RID: 7907
		[Token(Token = "0x4001EE3")]
		BeforeSell,
		// Token: 0x04001EE4 RID: 7908
		[Token(Token = "0x4001EE4")]
		SellFriend,
		// Token: 0x04001EE5 RID: 7909
		[Token(Token = "0x4001EE5")]
		FriendSoldOrFaint,
		// Token: 0x04001EE6 RID: 7910
		[Token(Token = "0x4001EE6")]
		FriendHurt2,
		// Token: 0x04001EE7 RID: 7911
		[Token(Token = "0x4001EE7")]
		FriendHurt3,
		// Token: 0x04001EE8 RID: 7912
		[Token(Token = "0x4001EE8")]
		FriendHurt4,
		// Token: 0x04001EE9 RID: 7913
		[Token(Token = "0x4001EE9")]
		FriendHurt5,
		// Token: 0x04001EEA RID: 7914
		[Token(Token = "0x4001EEA")]
		Level3FriendSold,
		// Token: 0x04001EEB RID: 7915
		[Token(Token = "0x4001EEB")]
		FriendTransformed,
		// Token: 0x04001EEC RID: 7916
		[Token(Token = "0x4001EEC")]
		Disabled137,
		// Token: 0x04001EED RID: 7917
		[Token(Token = "0x4001EED")]
		Disabled138,
		// Token: 0x04001EEE RID: 7918
		[Token(Token = "0x4001EEE")]
		Disabled139,
		// Token: 0x04001EEF RID: 7919
		[Token(Token = "0x4001EEF")]
		Disabled140,
		// Token: 0x04001EF0 RID: 7920
		[Token(Token = "0x4001EF0")]
		Disabled141,
		// Token: 0x04001EF1 RID: 7921
		[Token(Token = "0x4001EF1")]
		Disabled142,
		// Token: 0x04001EF2 RID: 7922
		[Token(Token = "0x4001EF2")]
		Disabled143,
		// Token: 0x04001EF3 RID: 7923
		[Token(Token = "0x4001EF3")]
		Disabled144,
		// Token: 0x04001EF4 RID: 7924
		[Token(Token = "0x4001EF4")]
		SpendAttack,
		// Token: 0x04001EF5 RID: 7925
		[Token(Token = "0x4001EF5")]
		SpendHealth,
		// Token: 0x04001EF6 RID: 7926
		[Token(Token = "0x4001EF6")]
		FriendSpendAttack,
		// Token: 0x04001EF7 RID: 7927
		[Token(Token = "0x4001EF7")]
		FriendSpendHealth,
		// Token: 0x04001EF8 RID: 7928
		[Token(Token = "0x4001EF8")]
		FriendSpendsAttackOrHealth,
		// Token: 0x04001EF9 RID: 7929
		[Token(Token = "0x4001EF9")]
		FriendTransformed3,
		// Token: 0x04001EFA RID: 7930
		[Token(Token = "0x4001EFA")]
		EnemyHurt10,
		// Token: 0x04001EFB RID: 7931
		[Token(Token = "0x4001EFB")]
		EnemyHurt20,
		// Token: 0x04001EFC RID: 7932
		[Token(Token = "0x4001EFC")]
		FriendTransformed5,
		// Token: 0x04001EFD RID: 7933
		[Token(Token = "0x4001EFD")]
		ThisHurt5,
		// Token: 0x04001EFE RID: 7934
		[Token(Token = "0x4001EFE")]
		CompositeStartOfBattleOrTransformed,
		// Token: 0x04001EFF RID: 7935
		[Token(Token = "0x4001EFF")]
		CompositeBuyOrStartTurn,
		// Token: 0x04001F00 RID: 7936
		[Token(Token = "0x4001F00")]
		FriendHurtOrFaint,
		// Token: 0x04001F01 RID: 7937
		[Token(Token = "0x4001F01")]
		EnemyHurt5,
		// Token: 0x04001F02 RID: 7938
		[Token(Token = "0x4001F02")]
		FriendFainted5,
		// Token: 0x04001F03 RID: 7939
		[Token(Token = "0x4001F03")]
		FriendTransformedInBattle,
		// Token: 0x04001F04 RID: 7940
		[Token(Token = "0x4001F04")]
		FriendLostPerk,
		// Token: 0x04001F05 RID: 7941
		[Token(Token = "0x4001F05")]
		LostStrawberry,
		// Token: 0x04001F06 RID: 7942
		[Token(Token = "0x4001F06")]
		FriendLostStrawberry,
		// Token: 0x04001F07 RID: 7943
		[Token(Token = "0x4001F07")]
		FriendGainedStrawberry,
		// Token: 0x04001F08 RID: 7944
		[Token(Token = "0x4001F08")]
		ThisHurt2,
		// Token: 0x04001F09 RID: 7945
		[Token(Token = "0x4001F09")]
		ThisHurt3,
		// Token: 0x04001F0A RID: 7946
		[Token(Token = "0x4001F0A")]
		ThisHurt4,
		// Token: 0x04001F0B RID: 7947
		[Token(Token = "0x4001F0B")]
		BeeSummoned,
		// Token: 0x04001F0C RID: 7948
		[Token(Token = "0x4001F0C")]
		FriendFlung,
		// Token: 0x04001F0D RID: 7949
		[Token(Token = "0x4001F0D")]
		ThisSummonedLate,
		// Token: 0x04001F0E RID: 7950
		[Token(Token = "0x4001F0E")]
		AnythingBought,
		// Token: 0x04001F0F RID: 7951
		[Token(Token = "0x4001F0F")]
		AnyoneGainedAilment,
		// Token: 0x04001F10 RID: 7952
		[Token(Token = "0x4001F10")]
		Eat2,
		// Token: 0x04001F11 RID: 7953
		[Token(Token = "0x4001F11")]
		Eat3,
		// Token: 0x04001F12 RID: 7954
		[Token(Token = "0x4001F12")]
		Eat4,
		// Token: 0x04001F13 RID: 7955
		[Token(Token = "0x4001F13")]
		Eat5,
		// Token: 0x04001F14 RID: 7956
		[Token(Token = "0x4001F14")]
		CornEatenByThis,
		// Token: 0x04001F15 RID: 7957
		[Token(Token = "0x4001F15")]
		CornEatenByFriend,
		// Token: 0x04001F16 RID: 7958
		[Token(Token = "0x4001F16")]
		AnyoneFlung,
		// Token: 0x04001F17 RID: 7959
		[Token(Token = "0x4001F17")]
		GainExp,
		// Token: 0x04001F18 RID: 7960
		[Token(Token = "0x4001F18")]
		FriendGainedExp,
		// Token: 0x04001F19 RID: 7961
		[Token(Token = "0x4001F19")]
		AppleEatenByThis2,
		// Token: 0x04001F1A RID: 7962
		[Token(Token = "0x4001F1A")]
		BeforeRoll,
		// Token: 0x04001F1B RID: 7963
		[Token(Token = "0x4001F1B")]
		PleaseDontShowUpInLocalizationFiles,
		// Token: 0x04001F1C RID: 7964
		[Token(Token = "0x4001F1C")]
		FriendDied4,
		// Token: 0x04001F1D RID: 7965
		[Token(Token = "0x4001F1D")]
		FriendDied5,
		// Token: 0x04001F1E RID: 7966
		[Token(Token = "0x4001F1E")]
		FriendlyGainedStrawberry,
		// Token: 0x04001F1F RID: 7967
		[Token(Token = "0x4001F1F")]
		FoodEatenByFriend,
		// Token: 0x04001F20 RID: 7968
		[Token(Token = "0x4001F20")]
		FoodEatenByFriendly,
		// Token: 0x04001F21 RID: 7969
		[Token(Token = "0x4001F21")]
		AnyoneHurt,
		// Token: 0x04001F22 RID: 7970
		[Token(Token = "0x4001F22")]
		FriendlyAttacked,
		// Token: 0x04001F23 RID: 7971
		[Token(Token = "0x4001F23")]
		ShopFoodEatenByThis,
		// Token: 0x04001F24 RID: 7972
		[Token(Token = "0x4001F24")]
		FriendlyGainedExp,
		// Token: 0x04001F25 RID: 7973
		[Token(Token = "0x4001F25")]
		PetDied,
		// Token: 0x04001F26 RID: 7974
		[Token(Token = "0x4001F26")]
		FriendlyAbilityActivated,
		// Token: 0x04001F27 RID: 7975
		[Token(Token = "0x4001F27")]
		FriendlyAbilityActivated5,
		// Token: 0x04001F28 RID: 7976
		[Token(Token = "0x4001F28")]
		EnemyAttacked8,
		// Token: 0x04001F29 RID: 7977
		[Token(Token = "0x4001F29")]
		EnemyAbilityActivated,
		// Token: 0x04001F2A RID: 7978
		[Token(Token = "0x4001F2A")]
		FriendHurt6,
		// Token: 0x04001F2B RID: 7979
		[Token(Token = "0x4001F2B")]
		FriendAheadGainedHealth,
		// Token: 0x04001F2C RID: 7980
		[Token(Token = "0x4001F2C")]
		AdjacentFriendAttacked,
		// Token: 0x04001F2D RID: 7981
		[Token(Token = "0x4001F2D")]
		BeforeAdjacentFriendAttacked,
		// Token: 0x04001F2E RID: 7982
		[Token(Token = "0x4001F2E")]
		LostAttack,
		// Token: 0x04001F2F RID: 7983
		[Token(Token = "0x4001F2F")]
		EnemyAttacked2,
		// Token: 0x04001F30 RID: 7984
		[Token(Token = "0x4001F30")]
		AdjacentFriendsHurt,
		// Token: 0x04001F31 RID: 7985
		[Token(Token = "0x4001F31")]
		EnemyAttacked10,
		// Token: 0x04001F32 RID: 7986
		[Token(Token = "0x4001F32")]
		AnyoneBehindHurt,
		// Token: 0x04001F33 RID: 7987
		[Token(Token = "0x4001F33")]
		AnyoneJumped,
		// Token: 0x04001F34 RID: 7988
		[Token(Token = "0x4001F34")]
		BeforeFriendTransformed,
		// Token: 0x04001F35 RID: 7989
		[Token(Token = "0x4001F35")]
		EnemyAttacked,
		// Token: 0x04001F36 RID: 7990
		[Token(Token = "0x4001F36")]
		FriendJumpedOrTransformed,
		// Token: 0x04001F37 RID: 7991
		[Token(Token = "0x4001F37")]
		EnemyAttacked5,
		// Token: 0x04001F38 RID: 7992
		[Token(Token = "0x4001F38")]
		AnyoneGainedWeak,
		// Token: 0x04001F39 RID: 7993
		[Token(Token = "0x4001F39")]
		ThisFirstAttack,
		// Token: 0x04001F3A RID: 7994
		[Token(Token = "0x4001F3A")]
		PetSold,
		// Token: 0x04001F3B RID: 7995
		[Token(Token = "0x4001F3B")]
		PetGainedAilment,
		// Token: 0x04001F3C RID: 7996
		[Token(Token = "0x4001F3C")]
		PetLostPerk,
		// Token: 0x04001F3D RID: 7997
		[Token(Token = "0x4001F3D")]
		BeforeFirstAttack,
		// Token: 0x04001F3E RID: 7998
		[Token(Token = "0x4001F3E")]
		BeforeFriendlyAttack
	}
}
