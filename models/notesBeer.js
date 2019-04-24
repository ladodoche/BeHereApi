module.exports = function(sequelize, Datatypes){
  const NotesBeer = sequelize.define('NotesBeer', {
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
  NotesBeer.associate = _associate;
  return NotesBeer;
};

function _associate(models) {
  models.NotesBeer.belongsTo(models.User, {
    as : 'user'
  }),
  models.NotesBeer.belongsTo(models.Beer, {
    as : 'beer'
  });
}
