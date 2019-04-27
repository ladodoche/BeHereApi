const ModelIndex  = require('../models');
const Brewery = ModelIndex.Brewery;
const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const Brewery = sequelize.define('Brewery', {
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
          msg: 'Veuillez saisir le nom de votre brasserie'
        },
        len: {
          args: [2,200],
          msg: 'Le nom de votre brasserie doit faire entre 2 et 200 caractères'
        },
        isUnique: function (name, done) {
          Brewery.findAll({ where: { name: name } })
            .then((result) => {
              if(result.length != 0)
                done('Nom déjà existante');
              done();
            })
        }
      }
    },
    gpsLatitude: {
      type: Datatypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La latitude n\'a pas pu être récupéré'
        },
        max: {
          args: 90,
          msg: 'La latitude ne peut pas être supérieur à 90'
        },
        min: {
          args: -90,
          msg: 'La latitude ne peut pas être inférieur à -90'
        }
      }
    },
    gpsLongitude: {
      type: Datatypes.DOUBLE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La longitude n\'a pas pu être récupéré'
        },
        max: {
          args: 180,
          msg: 'La longitude ne peut pas être supérieur à 180'
        },
        min: {
          args: -180,
          msg: 'La longitude ne peut pas être inférieur à -180'
        }
      }
    },
    description: {
      type: Datatypes.TEXT,
      allowNull: true
    },
    webSiteLink: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Le format de votre url n\'est pas correcte'
        }
      }
    },
    facebokLink: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Le format de votre url n\'est pas correcte'
        }
      }
    },
    twitterLink: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Le format de votre url n\'est pas correcte'
        }
      }
    },
    instagramLink: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Le format de votre url n\'est pas correcte'
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
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  Brewery.associate = _associate;
  return Brewery;
};

function _associate(models) {
  models.Brewery.belongsTo(models.User, {
    as : 'user'
  });
}
