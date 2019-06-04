module.exports = function(sequelize, Datatypes){
  const Friend = sequelize.define('Friend', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: Datatypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  Friend.associate = _associate;
  return Friend;
};

function _associate(models) {
  models.Friend.belongsTo(models.User, {
    as : 'user'
  }),
  models.Friend.belongsTo(models.User, {
    as : 'user_friend'
  });
}
