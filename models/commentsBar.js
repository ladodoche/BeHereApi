module.exports = function(sequelize, Datatypes){
  const CommentsBar = sequelize.define('CommentsBar', {
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
  CommentsBar.associate = _associate;
  return CommentsBar;
};

function _associate(models) {
  models.CommentsBar.belongsTo(models.User, {
    as : 'user'
  }),
  models.CommentsBar.belongsTo(models.Bar, {
    as : 'bar'
  });
}
