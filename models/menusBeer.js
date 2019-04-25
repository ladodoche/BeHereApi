module.exports = function(sequelize, Datatypes){
  const MenusBeer = sequelize.define('MenusBeer', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    price: {
      type: Datatypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir le prix de la bière'
        }
      }
    },
    hidden: {
      type: Datatypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  MenusBeer.associate = _associate;
  return MenusBeer;
};

function _associate(models) {
  models.MenusBeer.belongsTo(models.Bar, {
    as : 'bar'
  }),
  models.MenusBeer.belongsTo(models.Beer, {
    as : 'beer'
  });
}
