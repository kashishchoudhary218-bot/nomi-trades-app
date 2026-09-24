/**
 * Hinglish pronunciation for TTS input (never shown on screen — subtitles keep the
 * Roman-script narration).
 *
 * Roman-script Hindi read by an English front-end comes out wrong ("ke" → "kee",
 * "pehle" → "pay-l"). Writing the Hindi words in Devanagari and leaving English words
 * in Latin gives natural code-mixed Hinglish: Hindi words get Hindi phonemes, trading
 * terms stay English. Words not in the lexicon are left as-is (i.e. treated as English).
 */

/** Context-dependent phrases, applied first (case-insensitive, whole words). */
export const HINGLISH_PHRASES: [string, string][] = [
	// Numbers read the way an Indian documentary narrator would.
	['66 percent', 'sixty-six percent'],
	['1982 mein', 'nineteen eighty-two में'],
	['30 saal', 'तीस साल'],
	['20-day', 'twenty-day'],
	['50-day', 'fifty-day'],
	// "use" is Hindi उसे (him/it) here, English "use" elsewhere.
	['Unhone use build', 'उन्होंने उसे build'],
	['use quickly', 'उसे quickly'],
	['use hata', 'उसे हटा'],
	['use consistently', 'उसे consistently'],
	['use test karo', 'उसे test करो'],
	['use remove karo', 'उसे remove करो'],
	['jo use develop', 'जो उसे develop'],
	['use pehchan', 'उसे पहचान'],
	// "log karo" = English "log" (record); elsewhere "log" is Hindi लोग (people).
	['sab log karo', 'सब log करो'],
];

/** Hindi words (lowercase Roman) → Devanagari. */
export const HINGLISH_LEXICON: Record<string, string> = {
	aa: 'आ', aage: 'आगे', aaj: 'आज', aakhir: 'आख़िर', aap: 'आप', aapke: 'आपके', aapki: 'आपकी', aate: 'आते',
	aaya: 'आया', aayi: 'आई', ab: 'अब', achhi: 'अच्छी', agar: 'अगर', aisa: 'ऐसा', aise: 'ऐसे', alag: 'अलग',
	'alag-alag': 'अलग-अलग', apna: 'अपना', apne: 'अपने', apni: 'अपनी', asli: 'असली', aur: 'और',
	baad: 'बाद', baat: 'बात', bada: 'बड़ा', badal: 'बदल', badalte: 'बदलते', badhao: 'बढ़ाओ', bahar: 'बाहर',
	bahut: 'बहुत', bajay: 'बजाय', balki: 'बल्कि', banana: 'बनाना', band: 'बंद', bhi: 'भी', bilkul: 'बिल्कुल',
	bina: 'बिना', chaar: 'चार', chaliye: 'चलिए', chautha: 'चौथा', de: 'दे', dekhenge: 'देखेंगे', dekhne: 'देखने',
	dekho: 'देखो', dena: 'देना', deta: 'देता', dete: 'देते', dhoondh: 'ढूंढ', dhoondhna: 'ढूंढना',
	dhoondho: 'ढूंढो', diya: 'दिया', do: 'दो', doosra: 'दूसरा', doosre: 'दूसरे', doosri: 'दूसरी', ek: 'एक',
	gaya: 'गया', gayi: 'गई', guzarti: 'गुज़रती', haalanki: 'हालांकि', hai: 'है', hain: 'हैं', har: 'हर',
	hata: 'हटा', hi: 'ही', hisaab: 'हिसाब', ho: 'हो', hon: 'हों', hona: 'होना', hota: 'होता', hote: 'होते',
	hoti: 'होती', hua: 'हुआ', hue: 'हुए', hum: 'हम', in: 'इन', inke: 'इनके', inme: 'इनमें', is: 'इस',
	iska: 'इसका', isliye: 'इसलिए', itna: 'इतना', ja: 'जा', jaana: 'जाना', jab: 'जब', jagah: 'जगह',
	jahan: 'जहाँ', jaisa: 'जैसा', jaise: 'जैसे', jaisi: 'जैसी', jana: 'जाना', jata: 'जाता', jaye: 'जाए',
	jayega: 'जाएगा', jo: 'जो', ka: 'का', kaafi: 'काफ़ी', kaam: 'काम', kabhi: 'कभी', kahan: 'कहाँ', kai: 'कई',
	kaise: 'कैसे', kam: 'कम', kar: 'कर', kare: 'करे', karega: 'करेगा', karein: 'करें', karke: 'करके',
	karna: 'करना', karne: 'करने', karo: 'करो', karta: 'करता', karte: 'करते', karti: 'करती', karunga: 'करूँगा',
	kaunse: 'कौनसे', ke: 'के', kehne: 'कहने', khaas: 'ख़ास', khabar: 'ख़बर', khud: 'ख़ुद', ki: 'की',
	kisi: 'किसी', kitna: 'कितना', kiya: 'किया', ko: 'को', koi: 'कोई', kuch: 'कुछ', kya: 'क्या', kyun: 'क्यों',
	kyunki: 'क्योंकि', la: 'ला', lag: 'लग', lagbhag: 'लगभग', lagein: 'लगें', lekin: 'लेकिन', lena: 'लेना',
	liye: 'लिए', log: 'लोग', maante: 'मानते', main: 'मैं', mat: 'मत', matlab: 'मतलब', mein: 'में', mil: 'मिल',
	mujhe: 'मुझे', mushkil: 'मुश्किल', na: 'न', nahi: 'नहीं', nazariya: 'नज़रिया', ne: 'ने', neeche: 'नीचे',
	paanch: 'पांच', paas: 'पास', padta: 'पड़ता', par: 'पर', peeche: 'पीछे', pehchan: 'पहचान',
	pehchanna: 'पहचानना', pehla: 'पहला', pehle: 'पहले', phir: 'फिर', poocho: 'पूछो', poori: 'पूरी',
	raha: 'रहा', rahe: 'रहे', rahen: 'रहें', rahi: 'रही', raho: 'रहो', rakha: 'रखा', rakhi: 'रखी', rakho: 'रखो',
	rehte: 'रहते', rukta: 'रुकता', saal: 'साल', saamne: 'सामने', saare: 'सारे', saath: 'साथ', sab: 'सब',
	sabse: 'सबसे', sakta: 'सकता', sakte: 'सकते', sakti: 'सकती', samajhna: 'समझना', samajhne: 'समझने',
	samjho: 'समझो', sawaal: 'सवाल', se: 'से', seekh: 'सीख', seekhna: 'सीखना', shuruaat: 'शुरुआत', sirf: 'सिर्फ़',
	taaki: 'ताकि', tab: 'तब', tabhi: 'तभी', tak: 'तक', taraf: 'तरफ़', tarah: 'तरह', taur: 'तौर', teen: 'तीन',
	teesra: 'तीसरा', tha: 'था', the: 'थे', thi: 'थी', to: 'तो', tod: 'तोड़', ummeed: 'उम्मीद', un: 'उन',
	unhone: 'उन्होंने', unka: 'उनका', unke: 'उनके', unki: 'उनकी', upar: 'ऊपर', uska: 'उसका', uske: 'उसके',
	usse: 'उससे', utna: 'उतना', wajah: 'वजह', wali: 'वाली', wapas: 'वापस', woh: 'वो', ya: 'या', yaani: 'यानी',
	yahan: 'यहाँ', yahi: 'यही', yeh: 'ये', zaroor: 'ज़रूर', zaroori: 'ज़रूरी', zarurat: 'ज़रूरत', zyada: 'ज़्यादा',
	aaye: 'आए', abhi: 'अभी', dikhe: 'दिखे',
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Roman Hinglish narration → mixed Devanagari/Latin text for TTS. */
export const toHinglishTtsText = (text: string): string => {
	// Phrase rules first; their output is parked behind placeholders so the word pass
	// can't re-convert words they deliberately kept in English (e.g. "log" in "sab log karo").
	const parked: string[] = [];
	let out = text;
	for (const [from, to] of HINGLISH_PHRASES) {
		out = out.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(from)}(?![\\p{L}\\p{N}])`, 'giu'), () => {
			parked.push(to);
			return `\u0000${parked.length - 1}\u0000`;
		});
	}
	// Word pass: keep surrounding punctuation, swap the core word if it's Hindi.
	out = out.replace(/[\p{L}\p{N}'-]+/gu, (word) => HINGLISH_LEXICON[word.toLowerCase()] ?? word);
	return out.replace(/\u0000(\d+)\u0000/g, (_, i: string) => parked[Number(i)]);
};
