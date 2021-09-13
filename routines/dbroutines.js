const model = require('../models.js');
const games = model.Games;
const players = model.Players;
const clears = model.Clears;

const getGames = () => games.find().select('name -_id').lean();

const getPlayers = () => players.find().select('name -_id').lean();

const getClearsFromGame = (name) => games.findOne({name: name}).populate('games').select('clears -_id').lean();

const getClearsFromPlayer = (name) => players.findOne({name: name}).populate('players').select('clears -_id').lean();

const getClearsFromID = (_id) => clears.findById(_id).populate('clears').select('player game date death time link pImage gImage -_id').lean();

const getRecentClears = () => clears.find().sort({date: -1}).populate('clears').select('player game date link -_id').lean();

const getGameFromID = (_id) => games.findById(_id).populate('players').select('name image -_id').lean();

const getGameNameFromID = (_id) => games.findById(_id).populate('games').select('name -_id').lean();

const getPlayerFromID = (_id) => players.findById(_id).populate('players').select('name image -_id').lean();

const getPlayerNameFromID = (_id) => players.findById(_id).populate('players').select('name -_id').lean();

module.exports = {
	getGames, getPlayers, getClearsFromGame, getClearsFromPlayer, getClearsFromID, getRecentClears, getGameFromID, getPlayerFromID,
	getGameNameFromID, getPlayerNameFromID
}