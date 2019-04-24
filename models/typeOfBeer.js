const ModelIndex  = require('../models');
const TypeOfBeer = ModelIndex.TypeOfBeer;
const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const TypeOfBeer = sequelize.define('TypeOfBeer', {
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
          msg: 'Veuillez saisir le nom'
        },
        len: {
          args: [2,200],
          msg: 'Le nom de votre type de bière doit faire entre 2 et 200 caractères'
        },
        isUnique: function (name, done) {
          TypeOfBeer.findAll({ where: { name: name } })
            .then((result) => {
              if(result.length != 0)
                done('Nom déjà existante');
              done();
            })
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
  return TypeOfBeer;
};
