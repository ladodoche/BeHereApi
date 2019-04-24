module.exports = function(sequelize, Datatypes){
  const NotesBrewery = sequelize.define('NotesBrewery', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    note: {
      type: Datatypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir votre note'
        },
        max: {
          args: 20,
          msg: 'La note doit être inférieur ou égale à 20'
        },
        min: {
          args: 1,
          msg: 'La note doit être supérieur ou égale à 1'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  NotesBrewery.associate = _associate;
  return NotesBrewery;
};

function _associate(models) {
  models.NotesBrewery.belongsTo(models.User, {
    as : 'user'
  }),
  models.NotesBrewery.belongsTo(models.Brewery, {
    as : 'brewery'
  });
}
