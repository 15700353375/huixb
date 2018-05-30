import login from '@Src/store/modules/login';
import authorizeFrame from '@Src/store/modules/authorizeManager/authorizeFrame';
import authorizeUserFrame from '@Src/store/modules/authorizeUser/authorizeUserFrame';


import common from '@Src/store/modules/common';

export default  Object.assign(login, authorizeFrame, authorizeUserFrame,common);
