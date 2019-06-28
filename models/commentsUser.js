module.exports = function(sequelize, Datatypes){
  const CommentsUser = sequelize.define('CommentsUser', {
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
  CommentsUser.associate = _associate;
  return CommentsUser;
};

function _associate(models) {
  models.CommentsUser.belongsTo(models.User, {
    as : 'user'
  }),
  models.CommentsUser.belongsTo(models.User, {
    as : 'user_comment'
  });
}
