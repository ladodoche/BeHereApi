module.exports = function(sequelize, Datatypes){
  const PicturesBrewery = sequelize.define('PicturesBrewery', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    pathPicture: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2,250],
          msg: 'Chemin non conforme'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  PicturesBrewery.associate = _associate;
  return PicturesBrewery;
};

function _associate(models) {
  models.PicturesBrewery.belongsTo(models.Brewery, {
    as : 'brewery'
  });
}
