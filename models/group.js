module.exports = function(sequelize, Datatypes){
  const Group = sequelize.define('Group', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir le nom de votre groupe'
        },
        len: {
          args: [2,200],
          msg: 'Le nom de votre groupe doit faire entre 2 et 200 caractères'
        }
      }
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
    },
    description: {
      type: Datatypes.TEXT,
      allowNull: true
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  Group.associate = _associate;
  return Group;
};

function _associate(models) {
  models.Group.belongsTo(models.User, {
    as : 'admin'
  });
  models.Group.belongsToMany(models.User, {
    as: 'user',
    through: 'group_user',
    foreignKey: 'group_id'
  });
}
