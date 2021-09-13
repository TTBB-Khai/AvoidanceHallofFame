const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GamesSchema = new Schema({
	name: String,
	image: String
});

GamesSchema.virtual('clears', 
{
	ref: 'Clears',
	localField: '_id',
	foreignField: 'name'
})

const PlayersSchema = new Schema({
	name: String,
	image: String
});

PlayersSchema.virtual('clears', 
{
	ref: 'Clears',
	localField: '_id',
	foreignField: 'name'
})

const ClearsSchema = new Schema({
	_id: Number,
	date: {type: Date, index: true},
	death: String,
	time: String,
	link: String,
	pImage: String,
	gImage: String
})

ClearsSchema.virtual('player', 
{
	ref: 'Games',
	localField: '_id',
	foreignField: 'name'
})

ClearsSchema.virtual('game', 
{
	ref: 'Games',
	localField: '_id',
	foreignField: 'name'
})

ClearsSchema.index({date: -1});

// Compile model from schema
const Players = mongoose.model('Players', PlayersSchema, process.env.PLAYERSCOLLECTION);
const Games = mongoose.model('Games', GamesSchema, process.env.GAMESCOLLECTION);
const Clears = mongoose.model('Clears', ClearsSchema, process.env.CLEARSCOLLECTION);

module.exports = { Players, Games, Clears }