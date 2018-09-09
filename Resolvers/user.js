import bcrypt from 'bcrypt';
import _ from 'lodash';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};



export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, {password, ... otherArgs}, { models }) => {
    	try{
        if (password.length < 8 || password.length > 20) {
          return {
            ok: false,
            errors: [
              {
                path: 'password',
                message: 'The password needs to be between 8 and 20 characters long',
              },
            ],
          };
        }
    	const hashedPassword = await bcrypt.hash(password, 10);
    	const user = await models.User.create({ ... otherArgs, password: hashedPassword})
    	return {
        ok : true,
        user,

      };
    	} catch(err){
    		return {
          ok: false,
          errors: formatErrors(err, models),
    	};
    }
   },
  },
};