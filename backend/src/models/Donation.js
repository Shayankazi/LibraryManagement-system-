import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publishingYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  donorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  donorEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  donorPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  donorAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Donation;
