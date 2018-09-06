const Sequelize = require('sequelize');
const chamber = require('./chamber');


/* --- Production Database --- */

// const database_connect_string = "";
// const sequelize = new Sequelize(database_connect_string, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: true
//   }
// });



/* --- Development Database --- */

const sequelize = new Sequelize({
  password: null,
  dialect: 'sqlite',
  storage: 'database.sqlite',
});



/* --- Models --- */

let models = {};


models.Users = sequelize.define('users', {
  fname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  mname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  lname:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  password:        { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  icon:            { type: Sequelize.STRING(500), allowNull: true, defaultValue: '' },
  verified:        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['email', 'unique_value'] }] });

models.UserFields = sequelize.define('user_fields', {
  user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  name:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  type:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  value:           { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['unique_value'] }] });



models.Entities = sequelize.define('entities', {
  name:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  desc:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  industry:        { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  phone:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  p_o_c:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' }, // point of contact
  icon:            { type: Sequelize.STRING(500), allowNull: true, defaultValue: '/images/anon.png' },
  verified:        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.greatUniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['email', 'unique_value'] }] });

models.EntityFields = sequelize.define('entity_fields', {
  entity_id:       { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Entities, key: 'id' } },
  name:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  type:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  value:           { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['unique_value'] }] });



models.Assets = sequelize.define('assets', {
  user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  entity_id:       { type: Sequelize.INTEGER, allowNull: true, references: { model: models.Entities, key: 'id' } },
  name:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  code:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  active:          { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  verified:        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['unique_value'] }] });

models.AssetFields = sequelize.define('asset_fields', {
  user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  asset_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Assets, key: 'id' } },
  name:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  type:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  value:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['unique_value'] }] });



models.UserNotifications = sequelize.define('user_notifications', {
  user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  action:          { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  message:         { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  link:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['unique_value'] }] });

models.EntityNotifications = sequelize.define('entity_notifications', {
  entity_id:       { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Entities, key: 'id' } },
  action:          { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  message:         { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  link:            { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, { freezeTableName: true, indexes: [{ unique: true, fields: ['unique_value'] }] });



/* --- Relationships --- */

models.Users.Assets                = models.Users.hasMany(models.Assets, {as: 'Assets', foreignKey: 'user_id', sourceKey: 'id'});
models.Assets.User                 = models.Assets.belongsTo(models.Users, {as: 'User', foreignKey: 'user_id', targetKey: 'id'});

models.Entities.Fields             = models.Entities.hasMany(models.EntityFields, {as: 'EntityFields', foreignKey: 'entity_id', sourceKey: 'id'});
models.EntityFields.Entity         = models.EntityFields.belongsTo(models.Entities, {as: 'Entity', foreignKey: 'entity_id', targetKey: 'id'});

models.Users.Fields                = models.Users.hasMany(models.UserFields, {as: 'UserFields', foreignKey: 'user_id', sourceKey: 'id'});
models.UserFields.User             = models.UserFields.belongsTo(models.Users, {as: 'User', foreignKey: 'user_id', targetKey: 'id'});

models.Assets.Fields               = models.Assets.hasMany(models.AssetFields, {as: 'AssetFields', foreignKey: 'asset_id', sourceKey: 'id'});
models.AssetFields.Asset           = models.AssetFields.belongsTo(models.Assets, {as: 'Asset', foreignKey: 'asset_id', targetKey: 'id'});


/* --- Initialize Database --- */

sequelize.sync({ force: false })
.then(() => { console.log('Database Initialized!'); })
.catch((error) => { console.log('Database Failed!', error); });


/* --- Exports --- */

module.exports = {
  sequelize,
  models
}
