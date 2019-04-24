module.exports = function(sequelize, Datatypes){
  const CommentsBrewery = sequelize.define('CommentsBrewery', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: Datatypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir le contenu de votre commentaire'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  CommentsBrewery.associate = _associate;
  return CommentsBrewery;
};

function _associate(models) {
  models.CommentsBrewery.belongsTo(models.User, {
    as : 'user'
  }),
  models.CommentsBrewery.belongsTo(models.Brewery, {
    as : 'brewery'
  });
}
