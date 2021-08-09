import axios, { AxiosResponse } from 'axios';
import { IDish, IFoodItem, IUser } from '../Interfaces';

import {
  IEditedNameOfUser,
  IEditedPassword,
  LogInState,
  SignUpState,
} from '../Interfaces';

axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.withCredentials = true;

export async function signUpUser(
  values: SignUpState
): Promise<AxiosResponse<string>> {
  return await axios({
    url: '/signup',
    method: 'POST',
    data: values,
  });
}

export async function getFoods(
  pageNumber: number
): Promise<AxiosResponse<IFoodItem[]>> {
  return await axios({
    url: `/foods`,
    method: 'GET',
    params: { page: pageNumber, limit: 10 },
  });
}

export async function getFoodItem(
  id: string
): Promise<AxiosResponse<IFoodItem>> {
  return await axios({
    url: `/foods/${id}`,
    method: 'GET',
  });
}

export async function getAuthenticatedUser(): Promise<AxiosResponse<IUser>> {
  return await axios({
    url: '/user',
    method: 'GET',
  });
}
export async function changeNameOfUser(user: IEditedNameOfUser) {
  return await axios({
    url: '/user/nameOfUser',
    method: 'PUT',
    data: user,
  });
}

export async function changePasswordOfUser(user: IEditedPassword) {
  return await axios({
    url: '/user/password',
    method: 'PUT',
    data: user,
  });
}

export async function getChefFoods(
  pageNumber: number
): Promise<AxiosResponse<IFoodItem[]>> {
  return await axios({
    url: '/chefPosts',
    method: 'GET',
    params: { page: pageNumber, limit: 10 },
  });
}

export async function postChefFood(dish: IDish) {
  const form = new FormData();
  Object.keys(dish).forEach((key) => {
    form.append(key, (dish as any)[key]);
  });

  return await axios({
    url: `/chefPosts`,
    method: 'POST',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
      credentials: 'include',
    },
  });
}

export async function deleteChefFood(id: string) {
  return await axios({
    url: `/chefPosts/${id}`,
    method: 'DELETE',
  });
}

export async function updateChefFood(id: string, food: IDish) {
  const form = new FormData();
  Object.keys(food).forEach((key) => {
    form.append(key, (food as any)[key]);
  });

  return await axios({
    url: `/chefPosts/${id}`,
    method: 'PUT',
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data',
      credentials: 'include',
    },
  });
}

export async function logInUser(values: LogInState) {
  return await axios({
    url: '/login',
    method: 'POST',

    data: values,
  });
}

export async function logOutUser() {
  return await axios({
    url: '/logout',
    method: 'POST',
  });
}
