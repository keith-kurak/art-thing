import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { Sequelize, DataTypes } from 'sequelize';
import SQLite from 'sqlite3';

const favs = {};

console.log('start')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  dialectOptions: {
    mode: SQLite.OPEN_CREATE
  }
});

console.log('end')

const Favs = sequelize.define('Favs', {
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  favs: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export async function GET(request: ExpoRequest) {
  const id = request.expoUrl.pathname.split('/')[3];
  const favs = await Favs.findAll({
    where: {
      id
    }
  });
  return ExpoResponse.json({ favs: favs[0]?.favs || 0 });
}

export async function POST(request: ExpoRequest) {
  const id = request.expoUrl.pathname.split('/')[3];
  const favs = await Favs.findAll({
    where: {
      id
    }
  });
  let myFav;
  if (favs.length) {
    myFav = favs[0];
    myFav.favs++;
    await myFav.save();
  } else {
    myFav = await (new Favs({ id, favs: 1 })).save();
  }
  return ExpoResponse.json({ favs: myFav.favs });
}