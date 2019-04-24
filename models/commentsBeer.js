module.exports = function(sequelize, Datatypes){
  const CommentsBeer = sequelize.define('CommentsBeer', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: Datatypes.TEXT,
      allowNull: false,
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  CommentsBeer.associate = _associate;
  return CommentsBeer;
};

function _associate(models) {
  models.CommentsBeer.belongsTo(models.User, {
    as : 'user'
  }),
  models.CommentsBeer.belongsTo(models.Beer, {
    as : 'beer'
  });
}
