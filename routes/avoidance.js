const env = require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const router = express.Router();
const dbRtns = require('../routines/dbroutines');

const date = new Date();

// Retrieves games
router.get('/gameList', async (req, res) => {
	let games = [];
	try {
		let result = await dbRtns.getGames();
		for (let i = 0; i < result.length; i++) {
			games.push(result[i].name);
		}
		res.send(games);
	} catch (err) {
		console.log(err.stack);
		res.status(500).send('internal server error');
	}
});

// Retrieves players
router.get('/playerList', async (req, res) => {
	let players = [];
	try {
		let result = await dbRtns.getPlayers();
		for (let i = 0; i < result.length; i++) {
			players.push(result[i].name);
		}
		res.send(players);
	} catch (err) {
		console.log(err.stack);
		res.status(500).send('internal server error');
	}
});

// Retrieves array of clears under a game
router.get('/games', async (req, res) => {
	let name = req.query.name;
	let clearIDs = [];
	let clears = [];
	try {
		let result = await dbRtns.getClearsFromGame(name);
		for (let i = 0; i < result.clears.length; i++) {
			clearIDs.push(result.clears[i]);
		}
		for (let i = 0; i < clearIDs.length; i++) {
			let result2 = await dbRtns.getClearsFromID(clearIDs[i]);
			let day = result2.date.getDate();
			let month = result2.date.getMonth();
			let year = result2.date.getFullYear();
			let dateString = year + '/' + ('0' + (month + 1)).slice(-2) + '/' + ('0' + day).slice(-2);
			let player = await dbRtns.getPlayerFromID(result2.player);
			
			clears.push({"player": player.name, "date": dateString, "death": result2.death, "time": result2.time, "link": result2.link, "pImage": player.image})
		}
		res.send({"image": result.image, "clears": clears});
	} catch (err) {
		console.log(err.stack);
		res.status(500).send('internal server error');
	}
});

// Retrieves array of clears under a player
router.get('/players', async (req, res) => {
	let name = req.query.name;
	let clearIDs = [];
	let clears = [];
	try {
		let result = await dbRtns.getClearsFromPlayer(name);
		for (let i = 0; i < result.clears.length; i++) {
			clearIDs.push(result.clears[i]);
		}
		for (let i = 0; i < clearIDs.length; i++) {
			let result2 = await dbRtns.getClearsFromID(clearIDs[i]);
			let day = result2.date.getDate();
			let month = result2.date.getMonth();
			let year = result2.date.getFullYear();
			let dateString = year + '/' + ('0' + (month + 1)).slice(-2) + '/' + ('0' + day).slice(-2);
			let game = await dbRtns.getGameFromID(result2.game);
			
			clears.push({"game": game.name, "gImage": game.image, "date": dateString, "death": result2.death, "time": result2.time, "link": result2.link, "pImage": result2.pImage})
		}	
		res.send(clears);
	} catch (err) {
		console.log(err.stack);
		res.status(500).send('internal server error');
	}
});

router.get('/recent', async (req, res) => {
	let clears = [];
	try {
		let result = await dbRtns.getRecentClears();
		for (let i = 0; i < result.length; i++) {
			let day = result[i].date.getDate();
			let month = result[i].date.getMonth();
			let year = result[i].date.getFullYear();
			let dateString = year + '/' + ('0' + (month + 1)).slice(-2) + '/' + ('0' + day).slice(-2);
			
			let data = await Promise.all([dbRtns.getGameNameFromID(result[i].game), dbRtns.getPlayerNameFromID(result[i].player)]);
			clears.push({"player": data[1].name, "game": data[0].name, "date": dateString, "link": result[i].link})
		}
		res.send(clears);
	} catch (err) {
		console.log(err.stack);
		res.status(500).send('internal server error');
	}
});

module.exports = router;