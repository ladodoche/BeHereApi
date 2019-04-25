const ModelIndex  = require('../models');
const Bar = ModelIndex.Bar;
const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const Bar = sequelize.define('Bar', {
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
          msg: 'Veuillez saisir le nom de votre bar'
        },
        len: {
          args: [2,200],
          msg: 'Le nom de votre bar doit faire entre 2 et 200 caractères'
        },
        isUnique: function (name, done) {
          Bar.findAll({ where: { name: name } })
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
    earlyHappyHours: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/i,
          msg: 'Le format n\'est pas bon'
        }
      }
    },
    lateHappyHours: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/i,
          msg: 'Le format n\'est pas bon'
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
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  Bar.associate = _associate;
  return Bar;
};

function _associate(models) {
  models.Bar.belongsTo(models.User, {
    as : 'user'
  });
}
