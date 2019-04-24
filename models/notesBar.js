module.exports = function(sequelize, Datatypes){
  const NotesBar = sequelize.define('NotesBar', {
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
  NotesBar.associate = _associate;
  return NotesBar;
};

function _associate(models) {
  models.NotesBar.belongsTo(models.User, {
    as : 'user'
  }),
  models.NotesBar.belongsTo(models.Bar, {
    as : 'bar'
  });
}
