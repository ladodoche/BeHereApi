const ModelIndex  = require('../models');
const User = ModelIndex.User;
const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const User = sequelize.define('User', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Datatypes.STRING,
      allowNull: false,
      isUnique: true,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir votre adresse mail'
        },
        isEmail: {
          msg: 'Votre adresse mail n\'est pas valide'
        },
        isUnique: function (email, done) {
          User.findAll({ where: { email: email } })
            .then((result) => {
              if(result.length != 0)
                done('Adresse mail déjà existante');
              done();
            })
        }
      }
    },
    password: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir votre mot de passe'
        }
      }
    },
    name: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir votre nom de famille'
        },
        len: {
          args: [2,200],
          msg: 'Votre nom de famille doit faire entre 2 et 200 caractères'
        }
      }
    },
    surname: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir votre prénom'
        },
        len: {
          args: [2,200],
          msg: 'Votre prénom doit faire entre 2 et 200 caractères'
        }
      }
    },
    birthDate: {
      type: Datatypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Le format de votre date de naissance n\'est pas bon'
        },
        isBefore: {
          args: dateFormat(new Date().setYear(new Date().getFullYear() - 18), "yyyy-mm-dd"),
          msg: 'Vous devez être majeur pour vous inscrire'
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
    admin: {
      type: Datatypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  return User;
};
