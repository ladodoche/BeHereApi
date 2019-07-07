const ModelIndex  = require('../models');
const Beer = ModelIndex.Beer;
const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const Beer = sequelize.define('Beer', {
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
          Beer.findAll({ where: { name: name } })
            .then((result) => {
              if(result.length != 0)
                done('Nom déjà existante');
              done();
            })
        }
      }
    },
    color: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir la couleur de votre bière'
        },
        len: {
          args: [2,100],
          msg: 'La couleur de votre bière doit faire entre 2 et 100 caractères'
        }
      }
    },
    origin: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir l\'origne de votre bière'
        },
        len: {
          args: [2,150],
          msg: 'L\'origine de votre bière doit faire entre 2 et 100 caractères'
        }
      }
    },
    description: {
      type: Datatypes.TEXT,
      allowNull: true
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
  Beer.associate = _associate;
  return Beer;
};



function _associate(models) {
  models.Beer.belongsTo(models.TypeOfBeer, {
    as : 'typeOfBeer'
  });
  models.Beer.belongsTo(models.Brewery, {
    as : 'brewery'
  });
}
