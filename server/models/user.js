const db = require('./_db')
const DataTypes = db.Sequelize

module.exports = db.define('user', {
	spotifyId: {
		type: DataTypes.STRING
	},
	accessToken: {
		type: DataTypes.STRING
	},
	refreshToken: {
		type: DataTypes.STRING
	}
})

