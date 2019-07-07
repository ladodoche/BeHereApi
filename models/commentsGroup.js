module.exports = function(sequelize, Datatypes){
  const CommentsGroup = sequelize.define('CommentsGroup', {
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
  CommentsGroup.associate = _associate;
  return CommentsGroup;
};

function _associate(models) {
  models.CommentsGroup.belongsTo(models.User, {
    as : 'user'
  }),
  models.CommentsGroup.belongsTo(models.Group, {
    as : 'group_comment'
  });
}
