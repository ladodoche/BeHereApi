const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const Event = sequelize.define('Event', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir le titre de l\'évènement'
        },
        len: {
          args: [2,200],
          msg: 'Le titre de votre évènement doit faire entre 2 et 200 caractères'
        }
      }
    },
    date: {
      type: Datatypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Le format de votre date d\'évènement n\'est pas bon'
        },
        isAfter: {
          args: dateFormat(new Date().setDate(new Date().getDate() + 1), "yyyy-mm-dd"),
          msg: 'L\'évènement doit être créer minimum 24h à l\'avance'
        }
      }
    },
    description: {
      type: Datatypes.TEXT,
      allowNull: true
    },
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  Event.associate = _associate;
  return Event;
};

function _associate(models) {
  models.Event.belongsTo(models.Bar, {
    as : 'bar'
  }),
  models.Event.belongsTo(models.Brewery, {
    as : 'brewery'
  });
}
