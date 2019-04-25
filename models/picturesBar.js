module.exports = function(sequelize, Datatypes){
  const PicturesBar = sequelize.define('PicturesBar', {
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
  PicturesBar.associate = _associate;
  return PicturesBar;
};

function _associate(models) {
  models.PicturesBar.belongsTo(models.Bar, {
    as : 'bar'
  });
}
