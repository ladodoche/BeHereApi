const ModelIndex  = require('../models');
const Notification = ModelIndex.Notification;
const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const Notification = sequelize.define('Notification', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    texte: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir le text'
        },
        len: {
          args: [2,250],
          msg: 'Le text doit faire entre 2 et 250 caractères'
        }
      }
    },
    type: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir le type'
        },
        len: {
          args: [2,100],
          msg: 'Le type doit faire entre 2 et 100 caractères'
        }
      }
    },
    statut: {
      type: Datatypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  Notification.associate = _associate;
  return Notification;
};

function _associate(models) {
  models.Notification.belongsTo(models.User, {
    as : 'user'
  }),
  models.Notification.belongsTo(models.User, {
    as : 'other_user'
  }),
  models.Notification.belongsTo(models.Group, {
    as : 'group'
  });
}
