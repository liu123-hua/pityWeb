import request from '@/utils/request';
import CONFIG from '@/consts/config';
import auth from '@/utils/auth';




export async function dividezeroUser(params) {
    return request(`${CONFIG.URL}/divide/Users`, {
      method: 'post',
      data:params,
      headers: auth.headers(),
    });
  }



export async function checkxbClassFlag(params) {
    console.log(params)
     return request(`${CONFIG.URL}/divide/checkClassFlag`, {
      method: 'post',
      data:params,
      headers: auth.headers(),
    });
  
  }

export async function checkJjClassBatchFlag(params) {
    return request(`${CONFIG.URL}/divide/checkClassBatchFlag`, {
      method: 'post',
      data:params,
      headers: auth.headers(),
    });
  }