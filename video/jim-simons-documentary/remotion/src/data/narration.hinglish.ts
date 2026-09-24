/**
 * Hinglish narration (Roman script), scene by scene. Same meaning and facts as the
 * English script in data/scenes.ts — nothing added, nothing dropped. Hedges from the
 * source PDF are kept: "reportedly", "lagbhag" (approximately), "fees se pehle" (before fees).
 *
 * `anchors` maps each English beat phrase used by the scene code / SFX cues to the
 * Hinglish phrase where that idea is spoken, so visuals stay synced without touching
 * any animation code. Keys may carry "#n" for the nth occurrence (0-based); so may values.
 * Anchors that are identical in both languages (e.g. "stop loss") need no entry.
 */
export type LocalizedNarration = {narration: string; anchors: Record<string, string>};

export const HINGLISH: Record<string, LocalizedNarration> = {
	// ───────────── COLD OPEN ─────────────
	S01: {
		narration:
			'66 percent. Yeh lagbhag woh average annual return hai, jo Jim Simons ke Medallion Fund ne reportedly fees se pehle generate kiya — aur woh bhi 30 saal se zyada tak.',
		anchors: {'more than thirty years': '30 saal se zyada'},
	},
	S02: {
		narration:
			'Aur yeh kisi gut feeling, market stories, ya kisi star trader ke instinct se nahi aaya. Yeh aaya mathematics, data aur scientific discipline se.',
		anchors: {'gut feelings': 'gut feeling'},
	},
	S03: {
		narration:
			'Is video mein hum dekhenge ki Simons ne markets ko kaise approach kiya, unki edge ke peeche asli wajah kya thi — aur sabse important, unke kaunse principles ek retail trader realistically use kar sakta hai. Aur kaunse nahi.',
		anchors: {
			approached: 'approach kiya',
			'drove his edge': 'unki edge',
			'which ones': 'Aur kaunse',
			"can't": 'kaunse nahi',
		},
	},

	// ───────────── 01 MARKETS AS A MATH PROBLEM ─────────────
	S05: {
		narration:
			'1982 mein, Jim Simons ne Renaissance Technologies ki foundation rakhi. Simons ek mathematician aur former signals analyst the — aur market ko dekhne ka unka nazariya traditional traders se bilkul alag tha.',
		anchors: {founded: 'foundation rakhi'},
	},
	S06: {
		narration:
			'Unka core idea kehne mein simple tha, lekin execute karna mushkil: financial market ke data mein persistent aur predictable patterns ho sakte hain. Agar right people, right data aur right technology ko combine kiya jaye — to in patterns ko identify karke systematically trade kiya ja sakta hai.',
		anchors: {
			Combine: 'Agar right people',
			'data#1': 'right data',
			'traded systematically': 'systematically trade',
		},
	},
	S07: {
		narration:
			'Isliye Renaissance ne apna approach traditional, qualitative market analysis par build nahi kiya. Unhone use build kiya statistical pattern recognition par. Firm mein mathematicians, physicists aur computer scientists kaam karte the — aise log jo maante the ki markets ko ek mathematical system ki tarah study kiya ja sakta hai, jahan scientific discipline hidden patterns ko saamne la sakta hai.',
		anchors: {'It built it': 'Unhone use build kiya'},
	},

	// ───────────── 02 THE MACHINE BEHIND THE EDGE ─────────────
	S08: {
		narration:
			'Lekin yahan ek baat hai, jo zyada log miss kar dete hain: Renaissance ki performance sirf models ki wajah se nahi thi. Kai factors ek saath kaam kar rahe the — execution quality, scientific discipline, data analysis, continuous research, aur scientists ki hiring. Chaliye, inme se chaar ko break down karte hain.',
		anchors: {
			'only about models': 'sirf models',
			'scientists it hired': 'scientists ki hiring',
		},
	},
	S09: {
		narration:
			'Pehla: statistical pattern recognition. Team price, volume, order flow aur doosre market data ko process karti thi. Goal tha aise signals dhoondhna, jo statistically significant hon, time ke saath repeat hote hon — aur trading costs ke baad bhi useful rahen.',
		anchors: {
			'other market data': 'doosre market data',
			processed: 'process karti',
			'The goal': 'Goal tha',
			'repeated over time': 'time ke saath repeat',
			'after trading costs': 'trading costs ke baad',
		},
	},
	S10: {
		narration:
			'Doosra: doosri sciences se seekhna. Kuch mathematical techniques finance ke bahar ke fields — jaise physics aur signal processing — se adapt ki gayi thi. Hidden Markov Models jaise techniques ka use reportedly financial pattern recognition mein kiya gaya. Logic simple tha: agar koi technique doosre complex systems mein kaam karti hai, to test karo ki kya woh markets mein bhi kaam karti hai.',
		anchors: {'The logic': 'Logic simple tha'},
	},
	S11: {
		narration:
			'Teesra: speed, consistency aur scale. Sirf ek profitable signal dhoondh lena kaafi nahi hai. Use quickly, consistently aur large scale par execute karna padta hai. Aur khaas baat — Renaissance ne Medallion Fund ki capacity ko intentionally limited rakha, taaki unke large orders market prices ko zyada affect na karein.',
		anchors: {
			'and scale': 'aur scale',
			'Finding a profitable': 'Sirf ek profitable',
			'Renaissance intentionally': 'Renaissance ne',
			'capacity limited': 'capacity ko intentionally limited',
		},
	},
	S12: {
		narration:
			'Chautha: model discipline. Koi signal tabhi trade kiya jata tha, jab uske support mein statistically significant evidence ho. Agar signal kaam karna band kar de, to use hata diya jata tha. Aur yeh process kabhi rukta nahi tha: research, test, live trade, monitor — phir improve, ya remove.',
		anchors: {
			'A signal was traded': 'Koi signal tabhi',
			'If a signal stopped': 'Agar signal kaam',
			'trade live': 'live trade',
			'then improve': 'phir improve',
			'or remove': 'ya remove',
		},
	},

	// ───────────── 03 THE REALITY CHECK ─────────────
	S13: {
		narration:
			'Ab, ek reality check. Ek retail trader Medallion Fund ki performance ko replicate nahi kar sakta. Uske models proprietary hain, aur publicly available nahi hain. Renaissance ke paas technology thi, scale tha, aur highly skilled researchers the. Isliye Simons ke principles ko ek learning framework ki tarah dekho — copy karne wali trading strategy ki tarah nahi.',
		anchors: {
			'cannot replicate': 'replicate nahi',
			'not publicly available': 'publicly available nahi',
			'Renaissance had': 'Renaissance ke paas',
			'So treat': 'Isliye Simons',
			'not a trading strategy': 'copy karne wali',
		},
	},

	// ───────────── 04 FOUR PRINCIPLES ─────────────
	S14: {
		narration:
			'To aap actually kya apply kar sakte ho? Principle one: discretionary judgement ke bajay systematic rules. Apni entry, exit, stop loss aur position size pehle se define karo. Measurable conditions se overconfidence, hesitation aur confirmation bias jaise behavioural mistakes kam ho sakte hain.',
		anchors: {'in advance': 'pehle se'},
	},
	S15: {
		narration:
			'Principle two: narrative se upar data aur evidence ko rakho. Apni strategy ko historical data par backtest karo. Samjho ki woh kahan perform karti hai, kahan fail hoti hai, uska historical drawdown kya raha, win rate kya raha, aur average risk-to-reward kya raha. Backtest future profit ki guarantee nahi deta — lekin yeh samajhne ka baseline zaroor deta hai ki strategy ne ab tak kaise behave kiya hai.',
		anchors: {
			'above narrative': 'narrative se upar',
			'Backtest your': 'Apni strategy ko',
			performs: 'perform',
			fails: 'fail hoti',
			"doesn't guarantee": 'guarantee nahi',
		},
	},
	S16: {
		narration:
			'Principle three: risk management non-negotiable hai. Position sizing consistent rakho. Har trade par maximum loss define karo. Daily aur weekly maximum loss bhi define karo. Aur sirf isliye risk mat badhao, kyunki aap winning streak par ho. Goal yeh hai: koi ek trade — ya trades ka sequence — aapke account ko seriously damage na kare.',
		anchors: {
			'per trade': 'Har trade',
			'The goal': 'Goal yeh',
		},
	},
	S17: {
		narration:
			'Principle four: markets aur signals mein diversify karo. Medallion ne reportedly hundreds of instruments mein trade kiya — equities, bonds, currencies, commodities aur derivatives. Retail level par iska broad lesson yeh hai: kisi ek instrument ya ek strategy par poori tarah dependent mat raho. Less-correlated markets mein diversify karne se, kisi ek edge par aapki dependence kam ho sakti hai.',
		anchors: {
			'At retail level': 'Retail level par',
			'one instrument': 'ek instrument',
			Diversifying: 'Less-correlated markets',
			'reduce your dependence': 'aapki dependence',
		},
	},

	// ───────────── 05 THE QUANT TOOLKIT ─────────────
	S18: {
		narration:
			'Quantitative strategies kuch broad types ki hoti hain. Statistical arbitrage mein historically related assets ke price relationship ko study kiya jata hai. Agar yeh relationship temporarily kisi unusual level tak widen ho jaye, to strategy test karti hai ki kya spread wapas apni normal range ki taraf revert karega.',
		anchors: {widens: 'widen'},
	},
	S19: {
		narration:
			'Momentum aur trend following ka idea hai — is possibility ko systematically capture karna, ki recent strength aage bhi continue ho sakti hai. Jaise rules: uptrend mein long, aur downtrend mein short.',
		anchors: {},
	},
	S20: {
		narration:
			'Mean reversion mein yeh idea test kiya jata hai ki price apne average ya equilibrium level ki taraf wapas aa sakta hai. Short-term trading mein yeh relevant ho sakta hai — lekin challenge yeh pehchanna hai ki yeh temporary overextension hai, ya ek new trend ki shuruaat.',
		anchors: {'but the challenge': 'lekin challenge'},
	},
	S21: {
		narration:
			'Aur factor-based models value, momentum, quality aur low volatility jaise characteristics ko analyse karte hain. Kisi ek stock ki direction predict karne ke bajay, portfolio ko specific factor exposures ki taraf tilt kiya jata hai.',
		anchors: {predicting: 'predict', tilted: 'tilt'},
	},

	// ───────────── 06 YOUR FIRST TESTABLE RULE ─────────────
	S22: {
		narration:
			'Achhi khabar yeh hai: quantitative approach ke liye Renaissance-level mathematics ki zarurat nahi hai. Shuruaat hoti hai ek precise, testable rule se. Example: Main tab buy karunga, jab 20-day moving average, 50-day moving average ke upar cross karega. Aur jab 20-day moving average wapas 50-day ke neeche cross karega, tab exit karunga.',
		anchors: {
			'one precise': 'ek precise',
			"I'll buy": 'Main tab buy',
			"I'll exit": 'Aur jab 20-day',
		},
	},
	S23: {
		narration:
			'Ab is rule ko historical data par backtest kiya ja sakta hai — win rate, drawdown, average risk-to-reward, aur alag-alag market conditions mein iska behaviour check karte hue.',
		anchors: {},
	},

	// ───────────── 07 EXECUTION ─────────────
	S24: {
		narration:
			'Strategy banana ek challenge hai. Lekin use consistently execute karna, usse bhi bada challenge hai. Yahi woh jagah hai, jahan traders apne hi systems tod dete hain: kuch signals par trade lena, aur kuch ko skip kar dena. Stop loss ko move karna. Losing trade ko is ummeed mein hold karna, ki woh recover ho jayega. Aur drawdown ke baad strategy ko abandon kar dena.',
		anchors: {
			'Building a strategy': 'Strategy banana',
			'Executing it': 'Lekin use consistently',
			'taking some signals': 'kuch signals par',
			skipping: 'skip',
			'Moving the stop loss': 'Stop loss ko move',
			'moving the stop loss': 'Stop loss ko move',
			'Holding a losing trade': 'Losing trade ko',
			hoping: 'ummeed',
			abandoning: 'abandon',
		},
	},
	S25: {
		narration:
			'Iska solution hai ek trade journal. Entry condition, entry price, exit price, stop loss, take profit, market condition aur result — sab log karo. Phir compare karo: kya aapki live performance backtest ke behaviour jaisi hai? Agar live performance significantly worse hai, to possible reasons ho sakte hain overfitting, market conditions ka badal jaana, execution problems — ya strategy ki edge ka degrade hona.',
		anchors: {
			'the result': 'aur result',
			'Then compare': 'Phir compare',
			'changed market conditions': 'market conditions ka badal',
			degrading: 'degrade',
		},
	},

	// ───────────── 08 WHEN IT STOPS WORKING ─────────────
	S26: {
		narration:
			'Systematic strategies bhi drawdown periods se guzarti hain. Important sawaal sirf yeh nahi hai ki "kya mujhe loss hua?" — balki yeh hai ki kya yeh ek normal historical drawdown hai, ya strategy ki edge genuinely badal gayi hai. Khud se poocho: Kya market regime change hua hai? Kya similar strategies bhi underperform kar rahi hain? Kya signal conditions abhi bhi generate ho rahi hain? Aur current market historical conditions se kitna different hai?',
		anchors: {
			'or whether': 'ya strategy ki edge',
			Ask: 'Khud se poocho',
			'how different': 'kitna different',
		},
	},
	S27: {
		narration:
			'Recent losses ke baad aisa lag sakta hai ki strategy permanently fail ho gayi hai. Lekin agar strategy properly backtested aur validated hai, to historical evidence drawdown ko objectively evaluate karne ka ek better basis deta hai.',
		anchors: {
			'failed permanently': 'permanently fail',
			'But if it was': 'Lekin agar',
			objective: 'objectively',
		},
	},

	// ───────────── 09 THE TRAPS ─────────────
	S28: {
		narration:
			'Ab baat karte hain advanced traps ki. Sabse bada trap: overfitting — strategy ko historical data ke hisaab se itna optimize kar dena, ki backtest strong dikhe, lekin live market mein strategy fail ho jaye. Ho sakta hai strategy asli market pattern ke bajay, historical noise seekh rahi ho.',
		anchors: {
			optimizing: 'optimize',
			'backtest looks strong': 'backtest strong dikhe',
			'but it fails': 'lekin live market',
			'fails in live markets': 'live market mein strategy fail',
			'learning historical noise': 'historical noise seekh',
			'real market pattern': 'asli market pattern',
		},
	},
	S29: {
		narration:
			'Iska ek defence hai: out-of-sample testing — yaani strategy ko aise alag data par test karna, jo use develop karne mein use nahi hua.',
		anchors: {'separate data': 'alag data', "wasn't used": 'use nahi hua'},
	},
	S30: {
		narration:
			'Phir aate hain transaction costs. Trading ka actual cost sirf entry aur exit price nahi hota. Spread, commission, slippage ya market impact, aur overnight financing — yeh sab aapki edge ko kam kar sakte hain. High-turnover strategies inke liye khaas taur par sensitive hoti hain.',
		anchors: {
			'Your real cost': 'Trading ka actual cost',
			'especially sensitive': 'khaas taur par sensitive',
		},
	},
	S31: {
		narration:
			'Capacity limits: agar bahut zyada capital ek hi strategy ko follow kare, to large orders market ko move kar sakte hain aur returns kam kar sakte hain — haalanki small retail accounts ke liye yeh usually utna relevant nahi hota. Aur signal degradation: jo intraday pattern pehle kaam karta tha, woh time ke saath kam effective ho sakta hai — khaas kar tab, jab bahut saare traders use pehchan kar use karne lagein.',
		anchors: {'many traders': 'bahut saare traders'},
	},
	S32: {
		narration:
			'Aur aakhir mein, systematic trading ki paanch common mistakes. Ek: model ko over-complicate karna. Zyada complexity ka matlab automatically better strategy nahi hota; simple aur robust models overfitting ke liye kam vulnerable ho sakte hain. Do: bina clear rationale ke signals use karna. Sirf statistical pattern mil jana kaafi nahi hai; yeh samajhna bhi zaroori hai ki woh pattern exist kyun kar sakta hai. Teen: bahut kam data par testing. Short backtest misleading ho sakta hai. Strategy ko high aur low volatility, trending aur range-bound markets, aur alag-alag macro environments mein test karo. Chaar: market regime change ko ignore karna. Policy, volatility, liquidity aur trader behaviour — sab badalte rehte hain, aur sab performance ko affect kar sakte hain. Aur paanch: live conditions ko monitor na karna. Check karo ki aaj ka market un conditions jaisa hai ya nahi, jahan aapki strategy historically best perform karti thi.',
		anchors: {
			'One: over-complicating': 'Ek: model',
			'Two: using signals': 'Do: bina',
			'Three: testing': 'Teen: bahut',
			'Four: ignoring': 'Chaar: market',
			'And five': 'Aur paanch',
			'performed best': 'best perform',
		},
	},

	// ───────────── CLOSING ─────────────
	S33: {
		narration:
			'Renaissance ki performance sirf models ka result nahi thi. Yeh ek process se aayi: evidence dhoondho, use test karo, discipline ke saath trade karo, monitor karo — aur jo kaam karna band kar de, use remove karo. Aap Medallion ko copy nahi kar sakte. Lekin aap uska discipline zaroor copy kar sakte hain.',
		anchors: {
			'find evidence': 'evidence dhoondho',
			'test it': 'test karo',
			'with discipline': 'discipline ke saath',
			'monitor it': 'monitor karo',
			'remove what': 'use remove karo',
			"You can't copy": 'Aap Medallion ko',
			'But you can': 'Lekin aap',
			'the discipline': 'uska discipline',
			'copy the discipline': 'discipline zaroor copy',
		},
	},
	S34: {
		narration:
			'Yeh video sirf educational purpose ke liye hai. Historical performance future results ki guarantee nahi hoti — aur yahan Medallion ke proprietary models ko replicate karne ka koi claim nahi kiya gaya hai.',
		anchors: {},
	},
};
