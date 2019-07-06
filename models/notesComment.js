const ModelIndex  = require('../models');
const NotesComment = ModelIndex.NotesComment;
const dateFormat = require('dateformat');

module.exports = function(sequelize, Datatypes){
  const NotesComment = sequelize.define('NotesComment', {
    id: {
      type: Datatypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    note: {
      type: Datatypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Veuillez saisir votre note'
        },
        max: {
          args: 20,
          msg: 'La note doit être inférieur ou égale à 20'
        },
        min: {
          args: 1,
          msg: 'La note doit être supérieur ou égale à 1'
        }
      }
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
  });
  NotesComment.associate = _associate;
  return NotesComment;
};


function _associate(models) {
  models.NotesComment.belongsTo(models.User, {
    as : 'user'
  }),
  models.NotesComment.belongsTo(models.CommentsBar, {
    as : 'commentsBar'
  }),
  models.NotesComment.belongsTo(models.CommentsBeer, {
    as : 'commentsBeer'
  }),
  models.NotesComment.belongsTo(models.CommentsBrewery, {
    as : 'commentsBrewery'
  }),
  models.NotesComment.belongsTo(models.CommentsUser, {
    as : 'commentsUser'
  });
}
