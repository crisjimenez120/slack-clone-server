import bcrypt from 'bcrypt'; 

export default  (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username : {
      type : DataTypes.STRING,
      unique : true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'The username can only contain letters and numbers',

        },
        len:{
          args: [3, 20],
          msg: 'Must be between 3 and 20 characters long',
        },
      },
    },
    email : {
      type : DataTypes.STRING,
      unique : true,
       validate: {
        isEmail: {
          args: true,
          msg: 'Invalid Email',
        },
      },
    },
    password: {
        type : DataTypes.STRING,   
        validate:{
          len:{
            args: [8, 20],
            msg: 'The password needs to be between 8 and 20 characters long',
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        },
      },
    },
  );

  User.associate = function (models) {
    User.belongsToMany(models.Channel, {
      through : 'member',
      foreignKey:{ 
        name: 'userId',
        field: 'user_id',
      }
    });
  };

  return User;
};