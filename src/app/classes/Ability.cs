using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using BoardEvents.Interfaces;
using Il2CppDummyDll;
using Spacewood.Core.Enums;
using Spacewood.Core.Models.Abilities.Parameters;
using Spacewood.Core.Models.Item;
using Spacewood.SpacewoodCore.Models.Ability;

namespace Spacewood.Core.Models.Abilities
{
	// Token: 0x02000218 RID: 536
	[Token(Token = "0x2000218")]
	public class Ability
	{
		// Token: 0x17000316 RID: 790
		// (get) Token: 0x06000BAD RID: 2989 RVA: 0x00007098 File Offset: 0x00005298
		// (set) Token: 0x06000BAE RID: 2990 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000316")]
		public AbilityEnum Enum
		{
			[Token(Token = "0x6000BAD")]
			[Address(RVA = "0x366DD0", Offset = "0x3653D0", VA = "0x180366DD0")]
			[CompilerGenerated]
			get
			{
				return AbilityEnum.None;
			}
			[Token(Token = "0x6000BAE")]
			[Address(RVA = "0x3700E0", Offset = "0x36E6E0", VA = "0x1803700E0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000317 RID: 791
		// (get) Token: 0x06000BAF RID: 2991 RVA: 0x000070B0 File Offset: 0x000052B0
		// (set) Token: 0x06000BB0 RID: 2992 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000317")]
		public int Level
		{
			[Token(Token = "0x6000BAF")]
			[Address(RVA = "0x371700", Offset = "0x36FD00", VA = "0x180371700")]
			[CompilerGenerated]
			get
			{
				return 0;
			}
			[Token(Token = "0x6000BB0")]
			[Address(RVA = "0x49E5F0", Offset = "0x49CBF0", VA = "0x18049E5F0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000318 RID: 792
		// (get) Token: 0x06000BB1 RID: 2993 RVA: 0x000070C8 File Offset: 0x000052C8
		// (set) Token: 0x06000BB2 RID: 2994 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000318")]
		public bool Active
		{
			[Token(Token = "0x6000BB1")]
			[Address(RVA = "0x496C80", Offset = "0x495280", VA = "0x180496C80")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BB2")]
			[Address(RVA = "0x496CA0", Offset = "0x4952A0", VA = "0x180496CA0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000319 RID: 793
		// (get) Token: 0x06000BB3 RID: 2995 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BB4 RID: 2996 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000319")]
		public string About
		{
			[Token(Token = "0x6000BB3")]
			[Address(RVA = "0x3E2730", Offset = "0x3E0D30", VA = "0x1803E2730")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BB4")]
			[Address(RVA = "0x3E2740", Offset = "0x3E0D40", VA = "0x1803E2740")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700031A RID: 794
		// (get) Token: 0x06000BB5 RID: 2997 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BB6 RID: 2998 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700031A")]
		public string AboutLocoKey
		{
			[Token(Token = "0x6000BB5")]
			[Address(RVA = "0x491E20", Offset = "0x490420", VA = "0x180491E20")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BB6")]
			[Address(RVA = "0x491E30", Offset = "0x490430", VA = "0x180491E30")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700031B RID: 795
		// (get) Token: 0x06000BB7 RID: 2999 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BB8 RID: 3000 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700031B")]
		public object[] AboutArgs
		{
			[Token(Token = "0x6000BB7")]
			[Address(RVA = "0x492660", Offset = "0x490C60", VA = "0x180492660")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BB8")]
			[Address(RVA = "0x492690", Offset = "0x490C90", VA = "0x180492690")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700031C RID: 796
		// (get) Token: 0x06000BB9 RID: 3001 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BBA RID: 3002 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700031C")]
		public string FinePrint
		{
			[Token(Token = "0x6000BB9")]
			[Address(RVA = "0x4941C0", Offset = "0x4927C0", VA = "0x1804941C0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BBA")]
			[Address(RVA = "0x496E70", Offset = "0x495470", VA = "0x180496E70")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700031D RID: 797
		// (get) Token: 0x06000BBB RID: 3003 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BBC RID: 3004 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700031D")]
		public string FinePrintLocoKey
		{
			[Token(Token = "0x6000BBB")]
			[Address(RVA = "0x45CF70", Offset = "0x45B570", VA = "0x18045CF70")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BBC")]
			[Address(RVA = "0x3D1B00", Offset = "0x3D0100", VA = "0x1803D1B00")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700031E RID: 798
		// (get) Token: 0x06000BBD RID: 3005 RVA: 0x000070E0 File Offset: 0x000052E0
		// (set) Token: 0x06000BBE RID: 3006 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700031E")]
		public int? Repeat
		{
			[Token(Token = "0x6000BBD")]
			[Address(RVA = "0x381650", Offset = "0x37FC50", VA = "0x180381650")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BBE")]
			[Address(RVA = "0x494290", Offset = "0x492890", VA = "0x180494290")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700031F RID: 799
		// (get) Token: 0x06000BBF RID: 3007 RVA: 0x000070F8 File Offset: 0x000052F8
		// (set) Token: 0x06000BC0 RID: 3008 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700031F")]
		public RepeatText RepeatText
		{
			[Token(Token = "0x6000BBF")]
			[Address(RVA = "0x467A80", Offset = "0x466080", VA = "0x180467A80")]
			[CompilerGenerated]
			get
			{
				return RepeatText.None;
			}
			[Token(Token = "0x6000BC0")]
			[Address(RVA = "0x56C490", Offset = "0x56AA90", VA = "0x18056C490")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000320 RID: 800
		// (get) Token: 0x06000BC1 RID: 3009 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BC2 RID: 3010 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000320")]
		public ParameterInt RepeatParameter
		{
			[Token(Token = "0x6000BC1")]
			[Address(RVA = "0x36ACF0", Offset = "0x3692F0", VA = "0x18036ACF0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BC2")]
			[Address(RVA = "0x4EA990", Offset = "0x4E8F90", VA = "0x1804EA990")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000321 RID: 801
		// (get) Token: 0x06000BC3 RID: 3011 RVA: 0x00007110 File Offset: 0x00005310
		// (set) Token: 0x06000BC4 RID: 3012 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000321")]
		public bool RepeatFromAuraDisabled
		{
			[Token(Token = "0x6000BC3")]
			[Address(RVA = "0x6419B0", Offset = "0x63FFB0", VA = "0x1806419B0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BC4")]
			[Address(RVA = "0x6419E0", Offset = "0x63FFE0", VA = "0x1806419E0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000322 RID: 802
		// (get) Token: 0x06000BC5 RID: 3013 RVA: 0x00007128 File Offset: 0x00005328
		// (set) Token: 0x06000BC6 RID: 3014 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000322")]
		public int? TriggerLimit
		{
			[Token(Token = "0x6000BC5")]
			[Address(RVA = "0x55D360", Offset = "0x55B960", VA = "0x18055D360")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BC6")]
			[Address(RVA = "0x55D370", Offset = "0x55B970", VA = "0x18055D370")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000323 RID: 803
		// (get) Token: 0x06000BC7 RID: 3015 RVA: 0x00007140 File Offset: 0x00005340
		// (set) Token: 0x06000BC8 RID: 3016 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000323")]
		public TriggerLimitFormat TriggerLimitFormat
		{
			[Token(Token = "0x6000BC7")]
			[Address(RVA = "0x5F4E40", Offset = "0x5F3440", VA = "0x1805F4E40")]
			[CompilerGenerated]
			get
			{
				return TriggerLimitFormat.Long;
			}
			[Token(Token = "0x6000BC8")]
			[Address(RVA = "0x5F4E70", Offset = "0x5F3470", VA = "0x1805F4E70")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000324 RID: 804
		// (get) Token: 0x06000BC9 RID: 3017 RVA: 0x00007158 File Offset: 0x00005358
		// (set) Token: 0x06000BCA RID: 3018 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000324")]
		public bool TriggerLevel
		{
			[Token(Token = "0x6000BC9")]
			[Address(RVA = "0x37DF40", Offset = "0x37C540", VA = "0x18037DF40")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BCA")]
			[Address(RVA = "0x37E1B0", Offset = "0x37C7B0", VA = "0x18037E1B0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000325 RID: 805
		// (get) Token: 0x06000BCB RID: 3019 RVA: 0x00007170 File Offset: 0x00005370
		// (set) Token: 0x06000BCC RID: 3020 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000325")]
		public int? Charges
		{
			[Token(Token = "0x6000BCB")]
			[Address(RVA = "0x56CD90", Offset = "0x56B390", VA = "0x18056CD90")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BCC")]
			[Address(RVA = "0x56CDE0", Offset = "0x56B3E0", VA = "0x18056CDE0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000326 RID: 806
		// (get) Token: 0x06000BCD RID: 3021 RVA: 0x00007188 File Offset: 0x00005388
		// (set) Token: 0x06000BCE RID: 3022 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000326")]
		public int? ChargesMax
		{
			[Token(Token = "0x6000BCD")]
			[Address(RVA = "0x5F4E50", Offset = "0x5F3450", VA = "0x1805F4E50")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BCE")]
			[Address(RVA = "0x5F4E80", Offset = "0x5F3480", VA = "0x1805F4E80")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000327 RID: 807
		// (get) Token: 0x06000BCF RID: 3023 RVA: 0x000071A0 File Offset: 0x000053A0
		// (set) Token: 0x06000BD0 RID: 3024 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000327")]
		public TriggerLimitType TriggerLimitType
		{
			[Token(Token = "0x6000BCF")]
			[Address(RVA = "0x5329B0", Offset = "0x530FB0", VA = "0x1805329B0")]
			[CompilerGenerated]
			get
			{
				return TriggerLimitType.All;
			}
			[Token(Token = "0x6000BD0")]
			[Address(RVA = "0x532A20", Offset = "0x531020", VA = "0x180532A20")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000328 RID: 808
		// (get) Token: 0x06000BD1 RID: 3025 RVA: 0x000071B8 File Offset: 0x000053B8
		// (set) Token: 0x06000BD2 RID: 3026 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000328")]
		public int? GoldPrompt
		{
			[Token(Token = "0x6000BD1")]
			[Address(RVA = "0x5329C0", Offset = "0x530FC0", VA = "0x1805329C0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BD2")]
			[Address(RVA = "0x679310", Offset = "0x677910", VA = "0x180679310")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000329 RID: 809
		// (get) Token: 0x06000BD3 RID: 3027 RVA: 0x000071D0 File Offset: 0x000053D0
		// (set) Token: 0x06000BD4 RID: 3028 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000329")]
		public int? CompoundGoldPrompt
		{
			[Token(Token = "0x6000BD3")]
			[Address(RVA = "0x548100", Offset = "0x546700", VA = "0x180548100")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BD4")]
			[Address(RVA = "0x5BF870", Offset = "0x5BDE70", VA = "0x1805BF870")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700032A RID: 810
		// (get) Token: 0x06000BD5 RID: 3029 RVA: 0x000071E8 File Offset: 0x000053E8
		// (set) Token: 0x06000BD6 RID: 3030 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700032A")]
		public EffectInterruptor Interuptor
		{
			[Token(Token = "0x6000BD5")]
			[Address(RVA = "0x467B80", Offset = "0x466180", VA = "0x180467B80")]
			[CompilerGenerated]
			get
			{
				return EffectInterruptor.FirstZeroTargets;
			}
			[Token(Token = "0x6000BD6")]
			[Address(RVA = "0x59C240", Offset = "0x59A840", VA = "0x18059C240")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700032B RID: 811
		// (get) Token: 0x06000BD7 RID: 3031 RVA: 0x00007200 File Offset: 0x00005400
		// (set) Token: 0x06000BD8 RID: 3032 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700032B")]
		public bool AlwaysIgnoreMinionLevel
		{
			[Token(Token = "0x6000BD7")]
			[Address(RVA = "0x762080", Offset = "0x760680", VA = "0x180762080")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BD8")]
			[Address(RVA = "0x762300", Offset = "0x760900", VA = "0x180762300")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700032C RID: 812
		// (get) Token: 0x06000BD9 RID: 3033 RVA: 0x00007218 File Offset: 0x00005418
		// (set) Token: 0x06000BDA RID: 3034 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700032C")]
		public PowerEnum? Power
		{
			[Token(Token = "0x6000BD9")]
			[Address(RVA = "0x5357D0", Offset = "0x533DD0", VA = "0x1805357D0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BDA")]
			[Address(RVA = "0x62BB30", Offset = "0x62A130", VA = "0x18062BB30")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700032D RID: 813
		// (get) Token: 0x06000BDB RID: 3035 RVA: 0x00007230 File Offset: 0x00005430
		// (set) Token: 0x06000BDC RID: 3036 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700032D")]
		public bool PowerCounter
		{
			[Token(Token = "0x6000BDB")]
			[Address(RVA = "0x6511F0", Offset = "0x64F7F0", VA = "0x1806511F0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BDC")]
			[Address(RVA = "0x651210", Offset = "0x64F810", VA = "0x180651210")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700032E RID: 814
		// (get) Token: 0x06000BDD RID: 3037 RVA: 0x00007248 File Offset: 0x00005448
		// (set) Token: 0x06000BDE RID: 3038 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700032E")]
		public int? PowerGoal
		{
			[Token(Token = "0x6000BDD")]
			[Address(RVA = "0x678C10", Offset = "0x677210", VA = "0x180678C10")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BDE")]
			[Address(RVA = "0x678D20", Offset = "0x677320", VA = "0x180678D20")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700032F RID: 815
		// (get) Token: 0x06000BDF RID: 3039 RVA: 0x00007260 File Offset: 0x00005460
		// (set) Token: 0x06000BE0 RID: 3040 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700032F")]
		public int? PowerMax
		{
			[Token(Token = "0x6000BDF")]
			[Address(RVA = "0x679000", Offset = "0x677600", VA = "0x180679000")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BE0")]
			[Address(RVA = "0x6790B0", Offset = "0x6776B0", VA = "0x1806790B0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000330 RID: 816
		// (get) Token: 0x06000BE1 RID: 3041 RVA: 0x00007278 File Offset: 0x00005478
		// (set) Token: 0x06000BE2 RID: 3042 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000330")]
		public bool Regain
		{
			[Token(Token = "0x6000BE1")]
			[Address(RVA = "0x678BF0", Offset = "0x6771F0", VA = "0x180678BF0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BE2")]
			[Address(RVA = "0x678D00", Offset = "0x677300", VA = "0x180678D00")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000331 RID: 817
		// (get) Token: 0x06000BE3 RID: 3043 RVA: 0x00007290 File Offset: 0x00005490
		// (set) Token: 0x06000BE4 RID: 3044 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000331")]
		public bool HiddenText
		{
			[Token(Token = "0x6000BE3")]
			[Address(RVA = "0x762180", Offset = "0x760780", VA = "0x180762180")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BE4")]
			[Address(RVA = "0x762410", Offset = "0x760A10", VA = "0x180762410")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000332 RID: 818
		// (get) Token: 0x06000BE5 RID: 3045 RVA: 0x000072A8 File Offset: 0x000054A8
		// (set) Token: 0x06000BE6 RID: 3046 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000332")]
		public bool HiddenRender
		{
			[Token(Token = "0x6000BE5")]
			[Address(RVA = "0x762170", Offset = "0x760770", VA = "0x180762170")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BE6")]
			[Address(RVA = "0x762400", Offset = "0x760A00", VA = "0x180762400")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000333 RID: 819
		// (get) Token: 0x06000BE7 RID: 3047 RVA: 0x000072C0 File Offset: 0x000054C0
		// (set) Token: 0x06000BE8 RID: 3048 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000333")]
		public bool HiddenTriggersAndEffects
		{
			[Token(Token = "0x6000BE7")]
			[Address(RVA = "0x762190", Offset = "0x760790", VA = "0x180762190")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BE8")]
			[Address(RVA = "0x762420", Offset = "0x760A20", VA = "0x180762420")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000334 RID: 820
		// (get) Token: 0x06000BE9 RID: 3049 RVA: 0x000072D8 File Offset: 0x000054D8
		// (set) Token: 0x06000BEA RID: 3050 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000334")]
		public bool HiddenAbilityCard
		{
			[Token(Token = "0x6000BE9")]
			[Address(RVA = "0x762130", Offset = "0x760730", VA = "0x180762130")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BEA")]
			[Address(RVA = "0x7623C0", Offset = "0x7609C0", VA = "0x1807623C0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000335 RID: 821
		// (get) Token: 0x06000BEB RID: 3051 RVA: 0x000072F0 File Offset: 0x000054F0
		// (set) Token: 0x06000BEC RID: 3052 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000335")]
		public bool HiddenCharges
		{
			[Token(Token = "0x6000BEB")]
			[Address(RVA = "0x762140", Offset = "0x760740", VA = "0x180762140")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BEC")]
			[Address(RVA = "0x7623D0", Offset = "0x7609D0", VA = "0x1807623D0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000336 RID: 822
		// (get) Token: 0x06000BED RID: 3053 RVA: 0x00007308 File Offset: 0x00005508
		// (set) Token: 0x06000BEE RID: 3054 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000336")]
		public bool HiddenPower
		{
			[Token(Token = "0x6000BED")]
			[Address(RVA = "0x762160", Offset = "0x760760", VA = "0x180762160")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BEE")]
			[Address(RVA = "0x7623F0", Offset = "0x7609F0", VA = "0x1807623F0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000337 RID: 823
		// (get) Token: 0x06000BEF RID: 3055 RVA: 0x00007320 File Offset: 0x00005520
		// (set) Token: 0x06000BF0 RID: 3056 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000337")]
		public bool HiddenMemory
		{
			[Token(Token = "0x6000BEF")]
			[Address(RVA = "0x762150", Offset = "0x760750", VA = "0x180762150")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BF0")]
			[Address(RVA = "0x7623E0", Offset = "0x7609E0", VA = "0x1807623E0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000338 RID: 824
		// (get) Token: 0x06000BF1 RID: 3057 RVA: 0x00007338 File Offset: 0x00005538
		// (set) Token: 0x06000BF2 RID: 3058 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000338")]
		public bool Singleton
		{
			[Token(Token = "0x6000BF1")]
			[Address(RVA = "0x63E4F0", Offset = "0x63CAF0", VA = "0x18063E4F0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BF2")]
			[Address(RVA = "0x63E570", Offset = "0x63CB70", VA = "0x18063E570")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000339 RID: 825
		// (get) Token: 0x06000BF3 RID: 3059 RVA: 0x00007350 File Offset: 0x00005550
		// (set) Token: 0x06000BF4 RID: 3060 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000339")]
		public ParameterLabel ShowParameterLabel
		{
			[Token(Token = "0x6000BF3")]
			[Address(RVA = "0x592D00", Offset = "0x591300", VA = "0x180592D00")]
			[CompilerGenerated]
			get
			{
				return ParameterLabel.SumFriendsLevels;
			}
			[Token(Token = "0x6000BF4")]
			[Address(RVA = "0x592D40", Offset = "0x591340", VA = "0x180592D40")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700033A RID: 826
		// (get) Token: 0x06000BF5 RID: 3061 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BF6 RID: 3062 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700033A")]
		public ParameterInt ShowParameter
		{
			[Token(Token = "0x6000BF5")]
			[Address(RVA = "0x65A840", Offset = "0x658E40", VA = "0x18065A840")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BF6")]
			[Address(RVA = "0x65A8A0", Offset = "0x658EA0", VA = "0x18065A8A0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700033B RID: 827
		// (get) Token: 0x06000BF7 RID: 3063 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BF8 RID: 3064 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700033B")]
		public AbilityCounter ShowGoldSpent
		{
			[Token(Token = "0x6000BF7")]
			[Address(RVA = "0x423390", Offset = "0x421990", VA = "0x180423390")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BF8")]
			[Address(RVA = "0x620140", Offset = "0x61E740", VA = "0x180620140")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700033C RID: 828
		// (get) Token: 0x06000BF9 RID: 3065 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BFA RID: 3066 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700033C")]
		public AbilityCounter ShowRolls
		{
			[Token(Token = "0x6000BF9")]
			[Address(RVA = "0x467980", Offset = "0x465F80", VA = "0x180467980")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BFA")]
			[Address(RVA = "0x678F90", Offset = "0x677590", VA = "0x180678F90")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700033D RID: 829
		// (get) Token: 0x06000BFB RID: 3067 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000BFC RID: 3068 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700033D")]
		public AbilityCounter ShowTransformations
		{
			[Token(Token = "0x6000BFB")]
			[Address(RVA = "0x42FBC0", Offset = "0x42E1C0", VA = "0x18042FBC0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000BFC")]
			[Address(RVA = "0x430570", Offset = "0x42EB70", VA = "0x180430570")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700033E RID: 830
		// (get) Token: 0x06000BFD RID: 3069 RVA: 0x00007368 File Offset: 0x00005568
		// (set) Token: 0x06000BFE RID: 3070 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700033E")]
		public bool ShowSummons
		{
			[Token(Token = "0x6000BFD")]
			[Address(RVA = "0x7622F0", Offset = "0x7608F0", VA = "0x1807622F0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000BFE")]
			[Address(RVA = "0x7625A0", Offset = "0x760BA0", VA = "0x1807625A0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700033F RID: 831
		// (get) Token: 0x06000BFF RID: 3071 RVA: 0x00007380 File Offset: 0x00005580
		// (set) Token: 0x06000C00 RID: 3072 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700033F")]
		public decimal? ShowAttackMultiplied
		{
			[Token(Token = "0x6000BFF")]
			[Address(RVA = "0x762240", Offset = "0x760840", VA = "0x180762240")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C00")]
			[Address(RVA = "0x7624F0", Offset = "0x760AF0", VA = "0x1807624F0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000340 RID: 832
		// (get) Token: 0x06000C01 RID: 3073 RVA: 0x00007398 File Offset: 0x00005598
		// (set) Token: 0x06000C02 RID: 3074 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000340")]
		public decimal? ShowHealthMultiplied
		{
			[Token(Token = "0x6000C01")]
			[Address(RVA = "0x762280", Offset = "0x760880", VA = "0x180762280")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C02")]
			[Address(RVA = "0x762530", Offset = "0x760B30", VA = "0x180762530")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000341 RID: 833
		// (get) Token: 0x06000C03 RID: 3075 RVA: 0x000073B0 File Offset: 0x000055B0
		// (set) Token: 0x06000C04 RID: 3076 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000341")]
		public bool ShowPreviousEnemies
		{
			[Token(Token = "0x6000C03")]
			[Address(RVA = "0x7622C0", Offset = "0x7608C0", VA = "0x1807622C0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C04")]
			[Address(RVA = "0x762570", Offset = "0x760B70", VA = "0x180762570")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000342 RID: 834
		// (get) Token: 0x06000C05 RID: 3077 RVA: 0x000073C8 File Offset: 0x000055C8
		// (set) Token: 0x06000C06 RID: 3078 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000342")]
		public bool ShowPreviousSurvivors
		{
			[Token(Token = "0x6000C05")]
			[Address(RVA = "0x7622E0", Offset = "0x7608E0", VA = "0x1807622E0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C06")]
			[Address(RVA = "0x762590", Offset = "0x760B90", VA = "0x180762590")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000343 RID: 835
		// (get) Token: 0x06000C07 RID: 3079 RVA: 0x000073E0 File Offset: 0x000055E0
		// (set) Token: 0x06000C08 RID: 3080 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000343")]
		public bool ShowPreviousOutcome
		{
			[Token(Token = "0x6000C07")]
			[Address(RVA = "0x7622D0", Offset = "0x7608D0", VA = "0x1807622D0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C08")]
			[Address(RVA = "0x762580", Offset = "0x760B80", VA = "0x180762580")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000344 RID: 836
		// (get) Token: 0x06000C09 RID: 3081 RVA: 0x000073F8 File Offset: 0x000055F8
		// (set) Token: 0x06000C0A RID: 3082 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000344")]
		public bool ShowFinalLevelSold
		{
			[Token(Token = "0x6000C09")]
			[Address(RVA = "0x762260", Offset = "0x760860", VA = "0x180762260")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C0A")]
			[Address(RVA = "0x762510", Offset = "0x760B10", VA = "0x180762510")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000345 RID: 837
		// (get) Token: 0x06000C0B RID: 3083 RVA: 0x00007410 File Offset: 0x00005610
		// (set) Token: 0x06000C0C RID: 3084 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000345")]
		public bool ShowHurtCountsThisTurn
		{
			[Token(Token = "0x6000C0B")]
			[Address(RVA = "0x7622A0", Offset = "0x7608A0", VA = "0x1807622A0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C0C")]
			[Address(RVA = "0x762550", Offset = "0x760B50", VA = "0x180762550")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000346 RID: 838
		// (get) Token: 0x06000C0D RID: 3085 RVA: 0x00007428 File Offset: 0x00005628
		// (set) Token: 0x06000C0E RID: 3086 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000346")]
		public bool ShowFoodEatenThisTurn
		{
			[Token(Token = "0x6000C0D")]
			[Address(RVA = "0x762270", Offset = "0x760870", VA = "0x180762270")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C0E")]
			[Address(RVA = "0x762520", Offset = "0x760B20", VA = "0x180762520")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000347 RID: 839
		// (get) Token: 0x06000C0F RID: 3087 RVA: 0x00007440 File Offset: 0x00005640
		// (set) Token: 0x06000C10 RID: 3088 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000347")]
		public bool ShowLastPositivePerk
		{
			[Token(Token = "0x6000C0F")]
			[Address(RVA = "0x7622B0", Offset = "0x7608B0", VA = "0x1807622B0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C10")]
			[Address(RVA = "0x762560", Offset = "0x760B60", VA = "0x180762560")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000348 RID: 840
		// (get) Token: 0x06000C11 RID: 3089 RVA: 0x00007458 File Offset: 0x00005658
		// (set) Token: 0x06000C12 RID: 3090 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000348")]
		public bool Elite
		{
			[Token(Token = "0x6000C11")]
			[Address(RVA = "0x762110", Offset = "0x760710", VA = "0x180762110")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C12")]
			[Address(RVA = "0x762390", Offset = "0x760990", VA = "0x180762390")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000349 RID: 841
		// (get) Token: 0x06000C13 RID: 3091 RVA: 0x00007470 File Offset: 0x00005670
		// (set) Token: 0x06000C14 RID: 3092 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000349")]
		public bool Asset
		{
			[Token(Token = "0x6000C13")]
			[Address(RVA = "0x762090", Offset = "0x760690", VA = "0x180762090")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C14")]
			[Address(RVA = "0x762310", Offset = "0x760910", VA = "0x180762310")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700034A RID: 842
		// (get) Token: 0x06000C15 RID: 3093 RVA: 0x00007488 File Offset: 0x00005688
		// (set) Token: 0x06000C16 RID: 3094 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700034A")]
		public bool Localization
		{
			[Token(Token = "0x6000C15")]
			[Address(RVA = "0x7621B0", Offset = "0x7607B0", VA = "0x1807621B0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C16")]
			[Address(RVA = "0x762440", Offset = "0x760A40", VA = "0x180762440")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700034B RID: 843
		// (get) Token: 0x06000C17 RID: 3095 RVA: 0x000074A0 File Offset: 0x000056A0
		// (set) Token: 0x06000C18 RID: 3096 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700034B")]
		public int MagicVariable
		{
			[Token(Token = "0x6000C17")]
			[Address(RVA = "0x7621C0", Offset = "0x7607C0", VA = "0x1807621C0")]
			[CompilerGenerated]
			get
			{
				return 0;
			}
			[Token(Token = "0x6000C18")]
			[Address(RVA = "0x762450", Offset = "0x760A50", VA = "0x180762450")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700034C RID: 844
		// (get) Token: 0x06000C19 RID: 3097 RVA: 0x000074B8 File Offset: 0x000056B8
		// (set) Token: 0x06000C1A RID: 3098 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700034C")]
		public bool RememberSpells
		{
			[Token(Token = "0x6000C19")]
			[Address(RVA = "0x762230", Offset = "0x760830", VA = "0x180762230")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C1A")]
			[Address(RVA = "0x7624E0", Offset = "0x760AE0", VA = "0x1807624E0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700034D RID: 845
		// (get) Token: 0x06000C1B RID: 3099 RVA: 0x000074D0 File Offset: 0x000056D0
		// (set) Token: 0x06000C1C RID: 3100 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700034D")]
		public Perk? Perk
		{
			[Token(Token = "0x6000C1B")]
			[Address(RVA = "0x762210", Offset = "0x760810", VA = "0x180762210")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C1C")]
			[Address(RVA = "0x7624C0", Offset = "0x760AC0", VA = "0x1807624C0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700034E RID: 846
		// (get) Token: 0x06000C1D RID: 3101 RVA: 0x000074E8 File Offset: 0x000056E8
		// (set) Token: 0x06000C1E RID: 3102 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700034E")]
		public bool ForceSequentialAbilityRendering
		{
			[Token(Token = "0x6000C1D")]
			[Address(RVA = "0x668F40", Offset = "0x667540", VA = "0x180668F40")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C1E")]
			[Address(RVA = "0x669270", Offset = "0x667870", VA = "0x180669270")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700034F RID: 847
		// (get) Token: 0x06000C1F RID: 3103 RVA: 0x00007500 File Offset: 0x00005700
		// (set) Token: 0x06000C20 RID: 3104 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700034F")]
		public bool IgnoreOwnerWhenRendering
		{
			[Token(Token = "0x6000C1F")]
			[Address(RVA = "0x7621A0", Offset = "0x7607A0", VA = "0x1807621A0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C20")]
			[Address(RVA = "0x762430", Offset = "0x760A30", VA = "0x180762430")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000350 RID: 848
		// (get) Token: 0x06000C21 RID: 3105 RVA: 0x00007518 File Offset: 0x00005718
		// (set) Token: 0x06000C22 RID: 3106 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000350")]
		public bool ForceParallelEffectsRenderings
		{
			[Token(Token = "0x6000C21")]
			[Address(RVA = "0x762120", Offset = "0x760720", VA = "0x180762120")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C22")]
			[Address(RVA = "0x7623B0", Offset = "0x7609B0", VA = "0x1807623B0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000351 RID: 849
		// (get) Token: 0x06000C23 RID: 3107 RVA: 0x00007530 File Offset: 0x00005730
		// (set) Token: 0x06000C24 RID: 3108 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000351")]
		public Perk? ExplainPerk
		{
			[Token(Token = "0x6000C23")]
			[Address(RVA = "0x668F80", Offset = "0x667580", VA = "0x180668F80")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C24")]
			[Address(RVA = "0x6692C0", Offset = "0x6678C0", VA = "0x1806692C0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000352 RID: 850
		// (get) Token: 0x06000C25 RID: 3109 RVA: 0x00007548 File Offset: 0x00005748
		// (set) Token: 0x06000C26 RID: 3110 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000352")]
		public SpellEnum? ExplainSpell
		{
			[Token(Token = "0x6000C25")]
			[Address(RVA = "0x639FA0", Offset = "0x6385A0", VA = "0x180639FA0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C26")]
			[Address(RVA = "0x7623A0", Offset = "0x7609A0", VA = "0x1807623A0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000353 RID: 851
		// (get) Token: 0x06000C27 RID: 3111 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000C28 RID: 3112 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000353")]
		public ItemRelations Relations
		{
			[Token(Token = "0x6000C27")]
			[Address(RVA = "0x42FBE0", Offset = "0x42E1E0", VA = "0x18042FBE0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C28")]
			[Address(RVA = "0x60B6E0", Offset = "0x609CE0", VA = "0x18060B6E0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000354 RID: 852
		// (get) Token: 0x06000C29 RID: 3113 RVA: 0x00007560 File Offset: 0x00005760
		// (set) Token: 0x06000C2A RID: 3114 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000354")]
		public bool ManaSpender
		{
			[Token(Token = "0x6000C29")]
			[Address(RVA = "0x762200", Offset = "0x760800", VA = "0x180762200")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C2A")]
			[Address(RVA = "0x762490", Offset = "0x760A90", VA = "0x180762490")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000355 RID: 853
		// (get) Token: 0x06000C2B RID: 3115 RVA: 0x00007578 File Offset: 0x00005778
		// (set) Token: 0x06000C2C RID: 3116 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000355")]
		public int? ManaSpenderAmount
		{
			[Token(Token = "0x6000C2B")]
			[Address(RVA = "0x7621E0", Offset = "0x7607E0", VA = "0x1807621E0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C2C")]
			[Address(RVA = "0x762470", Offset = "0x760A70", VA = "0x180762470")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000356 RID: 854
		// (get) Token: 0x06000C2D RID: 3117 RVA: 0x00007590 File Offset: 0x00005790
		// (set) Token: 0x06000C2E RID: 3118 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000356")]
		public bool ManaSpenderExcess
		{
			[Token(Token = "0x6000C2D")]
			[Address(RVA = "0x7621F0", Offset = "0x7607F0", VA = "0x1807621F0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C2E")]
			[Address(RVA = "0x762480", Offset = "0x760A80", VA = "0x180762480")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000357 RID: 855
		// (get) Token: 0x06000C2F RID: 3119 RVA: 0x000075A8 File Offset: 0x000057A8
		// (set) Token: 0x06000C30 RID: 3120 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000357")]
		public bool ManaBurstDisabled
		{
			[Token(Token = "0x6000C2F")]
			[Address(RVA = "0x7621D0", Offset = "0x7607D0", VA = "0x1807621D0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C30")]
			[Address(RVA = "0x762460", Offset = "0x760A60", VA = "0x180762460")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000358 RID: 856
		// (get) Token: 0x06000C31 RID: 3121 RVA: 0x000075C0 File Offset: 0x000057C0
		// (set) Token: 0x06000C32 RID: 3122 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000358")]
		public Perk? PerkMultiplier
		{
			[Token(Token = "0x6000C31")]
			[Address(RVA = "0x5E1110", Offset = "0x5DF710", VA = "0x1805E1110")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C32")]
			[Address(RVA = "0x7624B0", Offset = "0x760AB0", VA = "0x1807624B0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000359 RID: 857
		// (get) Token: 0x06000C33 RID: 3123 RVA: 0x000075D8 File Offset: 0x000057D8
		// (set) Token: 0x06000C34 RID: 3124 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000359")]
		public int? MaxHealth
		{
			[Token(Token = "0x6000C33")]
			[Address(RVA = "0x5E1120", Offset = "0x5DF720", VA = "0x1805E1120")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C34")]
			[Address(RVA = "0x7624A0", Offset = "0x760AA0", VA = "0x1807624A0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700035A RID: 858
		// (get) Token: 0x06000C35 RID: 3125 RVA: 0x000075F0 File Offset: 0x000057F0
		// (set) Token: 0x06000C36 RID: 3126 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700035A")]
		public int? MaxAttack
		{
			[Token(Token = "0x6000C35")]
			[Address(RVA = "0x5E1130", Offset = "0x5DF730", VA = "0x1805E1130")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C36")]
			[Address(RVA = "0x669280", Offset = "0x667880", VA = "0x180669280")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700035B RID: 859
		// (get) Token: 0x06000C37 RID: 3127 RVA: 0x00007608 File Offset: 0x00005808
		// (set) Token: 0x06000C38 RID: 3128 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700035B")]
		public bool PersistTargets
		{
			[Token(Token = "0x6000C37")]
			[Address(RVA = "0x668D70", Offset = "0x667370", VA = "0x180668D70")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C38")]
			[Address(RVA = "0x669020", Offset = "0x667620", VA = "0x180669020")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700035C RID: 860
		// (get) Token: 0x06000C39 RID: 3129 RVA: 0x00007620 File Offset: 0x00005820
		// (set) Token: 0x06000C3A RID: 3130 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700035C")]
		public bool PersistLastPositivePerk
		{
			[Token(Token = "0x6000C39")]
			[Address(RVA = "0x762220", Offset = "0x760820", VA = "0x180762220")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C3A")]
			[Address(RVA = "0x7624D0", Offset = "0x760AD0", VA = "0x1807624D0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700035D RID: 861
		// (get) Token: 0x06000C3B RID: 3131 RVA: 0x00007638 File Offset: 0x00005838
		// (set) Token: 0x06000C3C RID: 3132 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700035D")]
		public AuraEnum? AuraEnum
		{
			[Token(Token = "0x6000C3B")]
			[Address(RVA = "0x7620C0", Offset = "0x7606C0", VA = "0x1807620C0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C3C")]
			[Address(RVA = "0x762340", Offset = "0x760940", VA = "0x180762340")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700035E RID: 862
		// (get) Token: 0x06000C3D RID: 3133 RVA: 0x00007650 File Offset: 0x00005850
		// (set) Token: 0x06000C3E RID: 3134 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700035E")]
		public RelativeDirection? AuraDirection
		{
			[Token(Token = "0x6000C3D")]
			[Address(RVA = "0x7620A0", Offset = "0x7606A0", VA = "0x1807620A0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C3E")]
			[Address(RVA = "0x762320", Offset = "0x760920", VA = "0x180762320")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x1700035F RID: 863
		// (get) Token: 0x06000C3F RID: 3135 RVA: 0x00007668 File Offset: 0x00005868
		// (set) Token: 0x06000C40 RID: 3136 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x1700035F")]
		public bool AuraExcludeSelf
		{
			[Token(Token = "0x6000C3F")]
			[Address(RVA = "0x7620D0", Offset = "0x7606D0", VA = "0x1807620D0")]
			[CompilerGenerated]
			get
			{
				return default(bool);
			}
			[Token(Token = "0x6000C40")]
			[Address(RVA = "0x762350", Offset = "0x760950", VA = "0x180762350")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000360 RID: 864
		// (get) Token: 0x06000C41 RID: 3137 RVA: 0x00007680 File Offset: 0x00005880
		// (set) Token: 0x06000C42 RID: 3138 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000360")]
		public MinionType AuraType
		{
			[Token(Token = "0x6000C41")]
			[Address(RVA = "0x762100", Offset = "0x760700", VA = "0x180762100")]
			[CompilerGenerated]
			get
			{
				return MinionType.Minion;
			}
			[Token(Token = "0x6000C42")]
			[Address(RVA = "0x762380", Offset = "0x760980", VA = "0x180762380")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000361 RID: 865
		// (get) Token: 0x06000C43 RID: 3139 RVA: 0x00007698 File Offset: 0x00005898
		// (set) Token: 0x06000C44 RID: 3140 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000361")]
		public int? AuraDistance
		{
			[Token(Token = "0x6000C43")]
			[Address(RVA = "0x7620B0", Offset = "0x7606B0", VA = "0x1807620B0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C44")]
			[Address(RVA = "0x762330", Offset = "0x760930", VA = "0x180762330")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000362 RID: 866
		// (get) Token: 0x06000C45 RID: 3141 RVA: 0x000076B0 File Offset: 0x000058B0
		// (set) Token: 0x06000C46 RID: 3142 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000362")]
		public Team? AuraTeam
		{
			[Token(Token = "0x6000C45")]
			[Address(RVA = "0x7620E0", Offset = "0x7606E0", VA = "0x1807620E0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C46")]
			[Address(RVA = "0x762360", Offset = "0x760960", VA = "0x180762360")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000363 RID: 867
		// (get) Token: 0x06000C47 RID: 3143 RVA: 0x000076C8 File Offset: 0x000058C8
		// (set) Token: 0x06000C48 RID: 3144 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000363")]
		public int? AuraTierMax
		{
			[Token(Token = "0x6000C47")]
			[Address(RVA = "0x7620F0", Offset = "0x7606F0", VA = "0x1807620F0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C48")]
			[Address(RVA = "0x762370", Offset = "0x760970", VA = "0x180762370")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000364 RID: 868
		// (get) Token: 0x06000C49 RID: 3145 RVA: 0x000076E0 File Offset: 0x000058E0
		// (set) Token: 0x06000C4A RID: 3146 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000364")]
		public int? AuraTierMin
		{
			[Token(Token = "0x6000C49")]
			[Address(RVA = "0x668FB0", Offset = "0x6675B0", VA = "0x180668FB0")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C4A")]
			[Address(RVA = "0x6692F0", Offset = "0x6678F0", VA = "0x1806692F0")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x17000365 RID: 869
		// (get) Token: 0x06000C4B RID: 3147 RVA: 0x00002050 File Offset: 0x00000250
		// (set) Token: 0x06000C4C RID: 3148 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x17000365")]
		public HashSet<AbilityEnum> PowerReset
		{
			[Token(Token = "0x6000C4B")]
			[Address(RVA = "0x668E30", Offset = "0x667430", VA = "0x180668E30")]
			[CompilerGenerated]
			get
			{
				return null;
			}
			[Token(Token = "0x6000C4C")]
			[Address(RVA = "0x669140", Offset = "0x667740", VA = "0x180669140")]
			[CompilerGenerated]
			set
			{
			}
		}

		// Token: 0x06000C4D RID: 3149 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x6000C4D")]
		[Address(RVA = "0x761F60", Offset = "0x760560", VA = "0x180761F60")]
		public Ability(AbilityEnum @enum, int level)
		{
		}

		// Token: 0x06000C4E RID: 3150 RVA: 0x000076F8 File Offset: 0x000058F8
		[Token(Token = "0x6000C4E")]
		[Address(RVA = "0x7609A0", Offset = "0x75EFA0", VA = "0x1807609A0")]
		public TriggerResult PowerTriggered(MinionAbilityModel abilityModel, TriggerEvent triggerEvent, BoardModel board, IRandom random, ItemId ownerId)
		{
			return default(TriggerResult);
		}

		// Token: 0x06000C4F RID: 3151 RVA: 0x00007710 File Offset: 0x00005910
		[Token(Token = "0x6000C4F")]
		[Address(RVA = "0x7607B0", Offset = "0x75EDB0", VA = "0x1807607B0")]
		public TriggerResult ChargeTriggered(MinionAbilityModel abilityModel, TriggerEvent triggerEvent, BoardModel board, IRandom random, ItemId ownerId)
		{
			return default(TriggerResult);
		}

		// Token: 0x06000C50 RID: 3152 RVA: 0x00007728 File Offset: 0x00005928
		[Token(Token = "0x6000C50")]
		[Address(RVA = "0x761CA0", Offset = "0x7602A0", VA = "0x180761CA0")]
		public TriggerResult Triggered(MinionAbilityModel minionAbility, TriggerEvent triggerEvent, bool force, BoardModel board, IRandom random, ItemId ownerId)
		{
			return default(TriggerResult);
		}

		// Token: 0x06000C51 RID: 3153 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C51")]
		[Address(RVA = "0x75F120", Offset = "0x75D720", VA = "0x18075F120")]
		public List<IBoardEvent> Activate(TriggerEvent triggerEvent, bool force, BoardModel board, ItemId ownerId, ItemId? aim, IRandom random, List<IBoardEvent> boardEvents, int? effectMultiplier)
		{
			return null;
		}

		// Token: 0x06000C52 RID: 3154 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C52")]
		[Address(RVA = "0x760920", Offset = "0x75EF20", VA = "0x180760920")]
		public List<TriggerEnum> GetTriggerEnums()
		{
			return null;
		}

		// Token: 0x06000C53 RID: 3155 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C53")]
		[Address(RVA = "0x3E2730", Offset = "0x3E0D30", VA = "0x1803E2730")]
		public string GetAbout()
		{
			return null;
		}

		// Token: 0x06000C54 RID: 3156 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C54")]
		[Address(RVA = "0x492660", Offset = "0x490C60", VA = "0x180492660")]
		public object[] GetAboutArgs()
		{
			return null;
		}

		// Token: 0x06000C55 RID: 3157 RVA: 0x00002053 File Offset: 0x00000253
		[Token(Token = "0x6000C55")]
		[Address(RVA = "0x7605A0", Offset = "0x75EBA0", VA = "0x1807605A0")]
		private void AppendTriggerEnums(TriggerBase trigger, List<TriggerEnum> result)
		{
		}

		// Token: 0x06000C56 RID: 3158 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C56")]
		[Address(RVA = "0x7615A0", Offset = "0x75FBA0", VA = "0x1807615A0")]
		public Ability SetPower(PowerEnum? power, TriggerBase trigger)
		{
			return null;
		}

		// Token: 0x06000C57 RID: 3159 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C57")]
		[Address(RVA = "0x761410", Offset = "0x75FA10", VA = "0x180761410")]
		public Ability SetPowerCounter([Optional] int? goal, [Optional] int? max)
		{
			return null;
		}

		// Token: 0x06000C58 RID: 3160 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C58")]
		[Address(RVA = "0x761500", Offset = "0x75FB00", VA = "0x180761500")]
		public Ability SetPowerReset()
		{
			return null;
		}

		// Token: 0x06000C59 RID: 3161 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C59")]
		[Address(RVA = "0x7614A0", Offset = "0x75FAA0", VA = "0x1807614A0")]
		public Ability SetPowerReset(params AbilityEnum[] powers)
		{
			return null;
		}

		// Token: 0x06000C5A RID: 3162 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C5A")]
		[Address(RVA = "0x761430", Offset = "0x75FA30", VA = "0x180761430")]
		public Ability SetPowerLabel(PowerEnum power)
		{
			return null;
		}

		// Token: 0x06000C5B RID: 3163 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C5B")]
		[Address(RVA = "0x760B10", Offset = "0x75F110", VA = "0x180760B10")]
		public Ability SetAimAndTrigger([Optional] TargetsBase aim)
		{
			return null;
		}

		// Token: 0x06000C5C RID: 3164 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C5C")]
		[Address(RVA = "0x761C60", Offset = "0x760260", VA = "0x180761C60")]
		public Ability SetTrigger(TriggerBase trigger)
		{
			return null;
		}

		// Token: 0x06000C5D RID: 3165 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C5D")]
		[Address(RVA = "0x761B80", Offset = "0x760180", VA = "0x180761B80")]
		public Ability SetTriggerCharged(TriggerBase trigger, int charges, TriggerEnum triggerEnum)
		{
			return null;
		}

		// Token: 0x06000C5E RID: 3166 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C5E")]
		[Address(RVA = "0x760380", Offset = "0x75E980", VA = "0x180760380")]
		public Ability AddEffects(TargetsBase targets, params EffectBase[] effects)
		{
			return null;
		}

		// Token: 0x06000C5F RID: 3167 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C5F")]
		[Address(RVA = "0x760360", Offset = "0x75E960", VA = "0x180760360")]
		public Ability AddEffect(TargetsBase targets, EffectBase effect)
		{
			return null;
		}

		// Token: 0x06000C60 RID: 3168 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C60")]
		[Address(RVA = "0x7601D0", Offset = "0x75E7D0", VA = "0x1807601D0")]
		public Ability AddEffect(TargetsBase targets, EffectBase effect, bool global)
		{
			return null;
		}

		// Token: 0x06000C61 RID: 3169 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C61")]
		[Address(RVA = "0x7603C0", Offset = "0x75E9C0", VA = "0x1807603C0")]
		public Ability AddGlobalEffect(EffectBase effect)
		{
			return null;
		}

		// Token: 0x06000C62 RID: 3170 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C62")]
		[Address(RVA = "0x761C30", Offset = "0x760230", VA = "0x180761C30")]
		public Ability SetTriggerLevel(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C63 RID: 3171 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C63")]
		[Address(RVA = "0x761C40", Offset = "0x760240", VA = "0x180761C40")]
		public Ability SetTriggerLimit(int? value, TriggerLimitType type = TriggerLimitType.All, TriggerLimitFormat format = TriggerLimitFormat.Long)
		{
			return null;
		}

		// Token: 0x06000C64 RID: 3172 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C64")]
		[Address(RVA = "0x761650", Offset = "0x75FC50", VA = "0x180761650")]
		public Ability SetRepeat(int repeat, RepeatText text = RepeatText.Long)
		{
			return null;
		}

		// Token: 0x06000C65 RID: 3173 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C65")]
		[Address(RVA = "0x7616C0", Offset = "0x75FCC0", VA = "0x1807616C0")]
		public Ability SetRepeat(ParameterInt repeat, RepeatText text = RepeatText.Long)
		{
			return null;
		}

		// Token: 0x06000C66 RID: 3174 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C66")]
		[Address(RVA = "0x761190", Offset = "0x75F790", VA = "0x180761190")]
		public Ability SetHidden(bool text = true, bool render = true, bool triggersAndEffects = true)
		{
			return null;
		}

		// Token: 0x06000C67 RID: 3175 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C67")]
		[Address(RVA = "0x761640", Offset = "0x75FC40", VA = "0x180761640")]
		public Ability SetRepeatFromAuraDisabled(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C68 RID: 3176 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C68")]
		[Address(RVA = "0x761150", Offset = "0x75F750", VA = "0x180761150")]
		public Ability SetHiddenAbilityCard(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C69 RID: 3177 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C69")]
		[Address(RVA = "0x761160", Offset = "0x75F760", VA = "0x180761160")]
		public Ability SetHiddenCharges(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C6A RID: 3178 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C6A")]
		[Address(RVA = "0x761180", Offset = "0x75F780", VA = "0x180761180")]
		public Ability SetHiddenPower(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C6B RID: 3179 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C6B")]
		[Address(RVA = "0x761170", Offset = "0x75F770", VA = "0x180761170")]
		public Ability SetHiddenMemory(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C6C RID: 3180 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C6C")]
		[Address(RVA = "0x761780", Offset = "0x75FD80", VA = "0x180761780")]
		public Ability SetShowFinalLevelSold(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C6D RID: 3181 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C6D")]
		[Address(RVA = "0x761970", Offset = "0x75FF70", VA = "0x180761970")]
		public Ability SetShowPreviousOutcome(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C6E RID: 3182 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C6E")]
		[Address(RVA = "0x46D790", Offset = "0x46BD90", VA = "0x18046D790")]
		public Ability SetShowPreviousEnemies(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C6F RID: 3183 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C6F")]
		[Address(RVA = "0x761980", Offset = "0x75FF80", VA = "0x180761980")]
		public Ability SetShowPreviousSurvivors(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C70 RID: 3184 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C70")]
		[Address(RVA = "0x761990", Offset = "0x75FF90", VA = "0x180761990")]
		public Ability SetShowRolls(bool current = false, [Optional] int? goal, [Optional] int? max)
		{
			return null;
		}

		// Token: 0x06000C71 RID: 3185 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C71")]
		[Address(RVA = "0x761A90", Offset = "0x760090", VA = "0x180761A90")]
		public Ability SetShowTransformations(bool current = false, [Optional] int? goal, [Optional] int? max)
		{
			return null;
		}

		// Token: 0x06000C72 RID: 3186 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C72")]
		[Address(RVA = "0x761A80", Offset = "0x760080", VA = "0x180761A80")]
		public Ability SetShowSummons()
		{
			return null;
		}

		// Token: 0x06000C73 RID: 3187 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C73")]
		[Address(RVA = "0x7617A0", Offset = "0x75FDA0", VA = "0x1807617A0")]
		public Ability SetShowGoldSpent(bool current = false, [Optional] int? goal, [Optional] int? max)
		{
			return null;
		}

		// Token: 0x06000C74 RID: 3188 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C74")]
		[Address(RVA = "0x761920", Offset = "0x75FF20", VA = "0x180761920")]
		public Ability SetShowHurtCountsThisTurn(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C75 RID: 3189 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C75")]
		[Address(RVA = "0x7616F0", Offset = "0x75FCF0", VA = "0x1807616F0")]
		public Ability SetShowAttackMultiplier(decimal value)
		{
			return null;
		}

		// Token: 0x06000C76 RID: 3190 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C76")]
		[Address(RVA = "0x761890", Offset = "0x75FE90", VA = "0x180761890")]
		public Ability SetShowHealthMultiplier(decimal value)
		{
			return null;
		}

		// Token: 0x06000C77 RID: 3191 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C77")]
		[Address(RVA = "0x761790", Offset = "0x75FD90", VA = "0x180761790")]
		public Ability SetShowFoodEatenThisTurn(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C78 RID: 3192 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C78")]
		[Address(RVA = "0x761930", Offset = "0x75FF30", VA = "0x180761930")]
		public Ability SetShowLastPositivePerk(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C79 RID: 3193 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C79")]
		[Address(RVA = "0x761940", Offset = "0x75FF40", VA = "0x180761940")]
		public Ability SetShowParameter(ParameterLabel label, ParameterInt parameter)
		{
			return null;
		}

		// Token: 0x06000C7A RID: 3194 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C7A")]
		[Address(RVA = "0x760C80", Offset = "0x75F280", VA = "0x180760C80")]
		public Ability SetAura(AuraEnum value, [Optional] RelativeDirection? direction, [Optional] int? distance, [Optional] Team? team)
		{
			return null;
		}

		// Token: 0x06000C7B RID: 3195 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C7B")]
		[Address(RVA = "0x760C40", Offset = "0x75F240", VA = "0x180760C40")]
		public Ability SetAuraExcludeSelf()
		{
			return null;
		}

		// Token: 0x06000C7C RID: 3196 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C7C")]
		[Address(RVA = "0x760C50", Offset = "0x75F250", VA = "0x180760C50")]
		public Ability SetAuraTier(int? min, int? max)
		{
			return null;
		}

		// Token: 0x06000C7D RID: 3197 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C7D")]
		[Address(RVA = "0x760C70", Offset = "0x75F270", VA = "0x180760C70")]
		public Ability SetAuraType(MinionType value)
		{
			return null;
		}

		// Token: 0x06000C7E RID: 3198 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C7E")]
		[Address(RVA = "0x760ED0", Offset = "0x75F4D0", VA = "0x180760ED0")]
		public Ability SetElite(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C7F RID: 3199 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C7F")]
		[Address(RVA = "0x760AD0", Offset = "0x75F0D0", VA = "0x180760AD0")]
		public Ability SetAbout(string value, params object[] args)
		{
			return null;
		}

		// Token: 0x06000C80 RID: 3200 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C80")]
		[Address(RVA = "0x7610C0", Offset = "0x75F6C0", VA = "0x1807610C0")]
		public Ability SetFinePrint(string value)
		{
			return null;
		}

		// Token: 0x06000C81 RID: 3201 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C81")]
		[Address(RVA = "0x7611B0", Offset = "0x75F7B0", VA = "0x1807611B0")]
		public Ability SetHighlight(ConditionBase condition)
		{
			return null;
		}

		// Token: 0x06000C82 RID: 3202 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C82")]
		[Address(RVA = "0x7610E0", Offset = "0x75F6E0", VA = "0x1807610E0")]
		public Ability SetGoldPrompt(int value)
		{
			return null;
		}

		// Token: 0x06000C83 RID: 3203 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C83")]
		[Address(RVA = "0x760E60", Offset = "0x75F460", VA = "0x180760E60")]
		public Ability SetCompoundGoldPrompt(int value)
		{
			return null;
		}

		// Token: 0x06000C84 RID: 3204 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C84")]
		[Address(RVA = "0x7611F0", Offset = "0x75F7F0", VA = "0x1807611F0")]
		public Ability SetMagicVariable(int value)
		{
			return null;
		}

		// Token: 0x06000C85 RID: 3205 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C85")]
		[Address(RVA = "0x761630", Offset = "0x75FC30", VA = "0x180761630")]
		public Ability SetRegain(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C86 RID: 3206 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C86")]
		[Address(RVA = "0x760DD0", Offset = "0x75F3D0", VA = "0x180760DD0")]
		public Ability SetCharges(int value, TriggerBase trigger)
		{
			return null;
		}

		// Token: 0x06000C87 RID: 3207 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C87")]
		[Address(RVA = "0x760D20", Offset = "0x75F320", VA = "0x180760D20")]
		public Ability SetChargesOnce(int value, TriggerBase trigger)
		{
			return null;
		}

		// Token: 0x06000C88 RID: 3208 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C88")]
		[Address(RVA = "0x761380", Offset = "0x75F980", VA = "0x180761380")]
		public Ability SetPerk(Perk value)
		{
			return null;
		}

		// Token: 0x06000C89 RID: 3209 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C89")]
		[Address(RVA = "0x761270", Offset = "0x75F870", VA = "0x180761270")]
		public Ability SetMaxStats(int maxAttack, int maxHealth)
		{
			return null;
		}

		// Token: 0x06000C8A RID: 3210 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C8A")]
		[Address(RVA = "0x760EE0", Offset = "0x75F4E0", VA = "0x180760EE0")]
		public Ability SetExplainPerk(Perk value, bool addRelated = true)
		{
			return null;
		}

		// Token: 0x06000C8B RID: 3211 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C8B")]
		[Address(RVA = "0x761200", Offset = "0x75F800", VA = "0x180761200")]
		public Ability SetManaSpender([Optional] int? value, bool excess = false)
		{
			return null;
		}

		// Token: 0x06000C8C RID: 3212 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C8C")]
		[Address(RVA = "0x760FD0", Offset = "0x75F5D0", VA = "0x180760FD0")]
		public Ability SetExplainSpell(SpellEnum value, bool addRelated = true)
		{
			return null;
		}

		// Token: 0x06000C8D RID: 3213 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C8D")]
		[Address(RVA = "0x7611E0", Offset = "0x75F7E0", VA = "0x1807611E0")]
		public Ability SetInteruptor(EffectInterruptor value)
		{
			return null;
		}

		// Token: 0x06000C8E RID: 3214 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C8E")]
		[Address(RVA = "0x760C20", Offset = "0x75F220", VA = "0x180760C20")]
		public Ability SetAlwaysActivateAllPairs(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C8F RID: 3215 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C8F")]
		[Address(RVA = "0x760C30", Offset = "0x75F230", VA = "0x180760C30")]
		public Ability SetAlwaysIgnoreMinionLevel(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C90 RID: 3216 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C90")]
		[Address(RVA = "0x761C90", Offset = "0x760290", VA = "0x180761C90")]
		public Ability SkipLocalizaiton()
		{
			return null;
		}

		// Token: 0x06000C91 RID: 3217 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C91")]
		[Address(RVA = "0x760AA0", Offset = "0x75F0A0", VA = "0x180760AA0")]
		public Ability RememberShopSpells(bool value = true)
		{
			return null;
		}

		// Token: 0x06000C92 RID: 3218 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C92")]
		[Address(RVA = "0x760440", Offset = "0x75EA40", VA = "0x180760440")]
		public Ability AddRelatedMinions(params MinionEnum[] minions)
		{
			return null;
		}

		// Token: 0x06000C93 RID: 3219 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C93")]
		[Address(RVA = "0x760520", Offset = "0x75EB20", VA = "0x180760520")]
		public Ability AddRelatedSpells(params SpellEnum[] spells)
		{
			return null;
		}

		// Token: 0x06000C94 RID: 3220 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C94")]
		[Address(RVA = "0x7604B0", Offset = "0x75EAB0", VA = "0x1807604B0")]
		public Ability AddRelatedPerks(params Perk[] perks)
		{
			return null;
		}

		// Token: 0x06000C95 RID: 3221 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C95")]
		[Address(RVA = "0x46DAA0", Offset = "0x46C0A0", VA = "0x18046DAA0")]
		public Ability SetSingleton()
		{
			return null;
		}

		// Token: 0x06000C96 RID: 3222 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C96")]
		[Address(RVA = "0x761310", Offset = "0x75F910", VA = "0x180761310")]
		public Ability SetPerkMultiplier(Perk perk)
		{
			return null;
		}

		// Token: 0x06000C97 RID: 3223 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C97")]
		[Address(RVA = "0x760AB0", Offset = "0x75F0B0", VA = "0x180760AB0")]
		public Ability RenderAbilitiesSequentially()
		{
			return null;
		}

		// Token: 0x06000C98 RID: 3224 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C98")]
		[Address(RVA = "0x760590", Offset = "0x75EB90", VA = "0x180760590")]
		public Ability AllowRenderingFriendsAndEnemiesInParallel()
		{
			return null;
		}

		// Token: 0x06000C99 RID: 3225 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C99")]
		[Address(RVA = "0x760AC0", Offset = "0x75F0C0", VA = "0x180760AC0")]
		public Ability RenderEffectsInParallel()
		{
			return null;
		}

		// Token: 0x06000C9A RID: 3226 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C9A")]
		[Address(RVA = "0x761400", Offset = "0x75FA00", VA = "0x180761400")]
		public Ability SetPersistTargets()
		{
			return null;
		}

		// Token: 0x06000C9B RID: 3227 RVA: 0x00002050 File Offset: 0x00000250
		[Token(Token = "0x6000C9B")]
		[Address(RVA = "0x7613F0", Offset = "0x75F9F0", VA = "0x1807613F0")]
		public Ability SetPersistLastPositivePerk()
		{
			return null;
		}

		// Token: 0x04000987 RID: 2439
		[Token(Token = "0x4000987")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x1C8")]
		public TargetsBase Aim;

		// Token: 0x04000988 RID: 2440
		[Token(Token = "0x4000988")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x1D0")]
		public TriggerBase Trigger;

		// Token: 0x04000989 RID: 2441
		[Token(Token = "0x4000989")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x1D8")]
		public List<AbilityPair> Pairs;

		// Token: 0x0400098A RID: 2442
		[Token(Token = "0x400098A")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x1E0")]
		public ConditionBase Highlight;

		// Token: 0x0400098B RID: 2443
		[Token(Token = "0x400098B")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x1E8")]
		public TriggerBase ChargeTrigger;

		// Token: 0x0400098C RID: 2444
		[Token(Token = "0x400098C")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x1F0")]
		public TriggerBase PowerTrigger;

		// Token: 0x0400098D RID: 2445
		[Token(Token = "0x400098D")]
		[Il2CppDummyDll.FieldOffset(Offset = "0x1F8")]
		public AbilityEnum? PowerAbility;
	}
}
