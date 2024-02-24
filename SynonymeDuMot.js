exports.action = function(data, callback){

	let client = setClient(data);
	info("SynonymeDuMot from:", data.client, "To:", client);
	synonym (data, client);
	callback();
 
}

function synonym (data, client) {
	
	let synonym = data.action.rawSentence.toLowerCase().replace("le synonyme du mot", "").replace("le synonyme du", "").replace("le", "").replace("synonyme", "").replace("du", "").replace("de", "").replace("mot", "").trim();

	if(!synonym) {
	Avatar.speak('je ne comprend pas quel synonyme que tu veux!', data.client, () => {
		Avatar.Speech.end(data.client);
	});
	return;
	}

	fetch(`https://www.synonymes.com/synonyme.php?mot=${synonym}`)
	.then(response => {
		if (!response.ok) {
		  throw new Error(`Code erreur: ${response.status}`);
		}
		return response.text();
	  })
	.then((html) => {
	const cheerio = require('cheerio');
	const $ = cheerio.load(html);
	const nom = $('#maincontent > div:nth-child(5) > ol > li').text();
	const adverbe = $('#maincontent > div:nth-child(6) > ol > li').text();
	const verbe = $('#maincontent > div:nth-child(7) > ol > li').text();
	Avatar.speak(`nom: ${nom} !`, data.client, () => {
	Avatar.speak(`adverbe: ${adverbe}!`, data.client, () => {
	Avatar.speak(`les synonymes de ${synonym} sont: ${verbe}!`, data.client, () => {
		Avatar.Speech.end(data.client);
	});
	});
	});
	})
	.catch(error => {
	Avatar.speak(`Erreur lors de la requête au site synonyme:, ${error.message}`, data.client, () => {
	Avatar.Speech.end(data.client);
	  });
	  });
	
}


function setClient (data) {
	var client = data.client;
	if (data.action.room)
		client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	if (data.action.setRoom)
		client = data.action.setRoom;
	return client;
}