module.exports = function(sequelize, Datatypes){
  const Message = sequelize.define('Message', {
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
          msg: 'Veuillez saisir le nom de votre message'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  Message.associate = _associate;
  return Message;
};

function _associate(models) {
  models.Message.belongsTo(models.User, {
    as : 'user_sender'
  });
  models.Message.belongsTo(models.User, {
    as : 'user_receiver'
  });
  models.Message.belongsTo(models.Group, {
    as : 'group'
  });
}
