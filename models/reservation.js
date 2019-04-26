const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const Reservation = sequelize.define('Reservation', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    numberOfPeople: {
      type: Datatypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir le nombre de personne présente lors de la réservation'
        },
        max: {
          args: 200,
          msg: 'La nombre de personne doit être inférieur ou égale à 200'
        },
        min: {
          args: 1,
          msg: 'La nombre de personne doit être supérieur ou égale à 1'
        }
      }
    },
    arrivalTime: {
      type: Datatypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Le format de votre date de réservation n\'est pas bon'
        },
        isBefore: {
          args: dateFormat(new Date().setDate(new Date().getDate() + 1), "yyyy-mm-dd HH:MM"),
          msg: 'La reservation doit être effectué 24h à l\'avance'
        }
      }
    },
    valid: {
      type: Datatypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  Reservation.associate = _associate;
  return Reservation;
};

function _associate(models) {
  models.Reservation.belongsTo(models.User, {
    as : 'user'
  }),
  models.Reservation.belongsTo(models.Bar, {
    as : 'bar'
  });
}
