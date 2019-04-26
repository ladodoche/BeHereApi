const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const OrderMenuBeer = sequelize.define('OrderMenuBeer', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: Datatypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir la quantité que vous souhaitez'
        },
        max: {
          args: 200,
          msg: 'La quantité doit être inférieur ou égale à 200'
        },
        min: {
          args: 1,
          msg: 'La quantité doit être supérieur ou égale à 1'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  OrderMenuBeer.associate = _associate;
  return OrderMenuBeer;
};

function _associate(models) {
  models.OrderMenuBeer.belongsTo(models.Reservation, {
    as : 'reservation'
  }),
  models.OrderMenuBeer.belongsTo(models.MenusBeer, {
    as : 'menusBeer'
  });
}
