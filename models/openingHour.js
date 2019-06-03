const ModelIndex  = require('../models');
const OpeningHour = ModelIndex.OpeningHour;
const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const OpeningHour = sequelize.define('OpeningHour', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    day: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir un jour de la semaine'
        },
        isIn: {
          args: [['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']],
          msg: 'Le jour de la semaine selectionné n\'est pas valide'
        },
        isUnique: function (day, done) {
          OpeningHour.findAll({ where: { day: this.day, bar_id: this.bar_id } })
            .then((result) => {
              if(result.length != 0)
                done('Horaire déjà existante pour ce jour');
              done();
            })
        }
      }
    },
    opening: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ["^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",'i'],
          msg: 'Le format de votre heure d\'ouverture n\'est pas bonne'
        }
      }
    },
    closing: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ["^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",'i'],
          msg: 'Le format de votre heure de fermeture n\'est pas bonne'
        }
      }
    },
    earlyHappyHour: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: ["^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",'i'],
          msg: 'Le format de votre heure de début d\'happy hour n\'est pas bonne'
        }
      }
    },
    lateHappyHour: {
      type: Datatypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: ["^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",'i'],
          msg: 'Le format de votre heure de fin d\'happy hour n\'est pas bonne'
        }
      }
    },
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  OpeningHour.associate = _associate;
  return OpeningHour;
};

function _associate(models) {
  models.OpeningHour.belongsTo(models.Bar, {
    as : 'bar'
  })
}
