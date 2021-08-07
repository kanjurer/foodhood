import './App.less';

import { useState, useContext, Dispatch, SetStateAction } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Layout } from 'antd';

import { UserContext } from './Context';
import { ICartItem, IFoodItem, IUser } from './Interfaces';
import Nav from './Nav/Nav';
import Home from './Home/Home';
import Sell from './Sell/Sell';
import Profile from './Profile/Profile';
import LogIn from './UserEntry/LogIn';
import SignUp from './UserEntry/SignUp';
import Checkout from './Checkout/Checkout';
import Settings from './Settings/Settings';
import {
  handleAddToCart,
  handleRemoveFromCart,
} from './CartOperations/CartOperations';
import { getAuthenticatedUser } from './FetchAPIs/FetchAPIs';

export function userSetter(): IUser | null {
  const userString: string | null = localStorage.getItem('user');
  const user: IUser | null =
    userString === null ? null : JSON.parse(userString);

  return user;
}

export default function App() {
  let [signedInUser, setSignedInUser] = useState<IUser | null>(userSetter());

  function logInFunction(login: boolean): void {
    if (login) {
      getAuthenticatedUser()
        .then((res) => {
          localStorage.setItem('user', JSON.stringify(res.data));
          setSignedInUser(res.data);
        })
        .catch((err) => {
          localStorage.removeItem('user');
          setSignedInUser(null);
          console.log(err.response.text);
        });
    } else {
      localStorage.removeItem('user');
      setSignedInUser(null);
    }
  }

  return (
    <UserContext.Provider value={signedInUser}>
      <MyApp setSignedInUser={setSignedInUser} logInFunction={logInFunction} />
    </UserContext.Provider>
  );
}

function MyApp({
  logInFunction,
  setSignedInUser,
}: {
  logInFunction: (login: boolean) => void;
  setSignedInUser: Dispatch<SetStateAction<IUser | null>>;
}) {
  const user = useContext(UserContext);
  let loggedIn = Boolean(user);

  let [cart, setCart] = useState<ICartItem[]>(
    localStorage.getItem('cart') !== null
      ? JSON.parse(localStorage.getItem('cart') as string)
      : []
  );

  function changeCartCallback(cart: ICartItem[]) {
    setCart(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  return (
    <>
      <Router>
        <Layout>
          <Layout.Header>
            <Nav
              handleRemoveFromCart={(cartItem) =>
                handleRemoveFromCart(cart, cartItem, changeCartCallback)
              }
              cart={cart}
              logInFunction={logInFunction}
              cartItemNumber={cart?.length}
            />
          </Layout.Header>
          <Layout.Content
            className="content"
            style={{
              padding: ' 10px',
              margin: '10px',
              backgroundColor: 'white',
            }}
          >
            <Switch>
              <Route path="/home" exact>
                <Home
                  handleAddToCart={(cartItem) =>
                    handleAddToCart(cart, cartItem, changeCartCallback)
                  }
                />
              </Route>
              <Route path="/sell" exact>
                {!loggedIn ? (
                  <Redirect to="/login" push />
                ) : (
                  <Sell logInFunction={logInFunction} />
                )}
              </Route>
              <Route path="/profile" exact>
                {user === null ? (
                  <Redirect to="/login" />
                ) : (
                  <Profile user={user} />
                )}
              </Route>
              <Route path="/login" exact>
                {loggedIn ? (
                  <Redirect to="/home" />
                ) : (
                  <LogIn logInFunction={logInFunction} />
                )}
              </Route>
              <Route path="/signup" exact>
                {loggedIn ? (
                  <Redirect to="/home" />
                ) : (
                  <SignUp logInFunction={logInFunction} />
                )}
              </Route>
              <Route path="/checkout" exact>
                {loggedIn ? (
                  <Checkout
                    handleRemoveFromCart={(cartItem) =>
                      handleRemoveFromCart(cart, cartItem, changeCartCallback)
                    }
                    cart={cart}
                  />
                ) : (
                  <Redirect to="/login" />
                )}
              </Route>
              <Route path="/settings" exact>
                {!loggedIn ? (
                  <Redirect to="/login" />
                ) : (
                  <Settings setSignedInUser={setSignedInUser} />
                )}
              </Route>
            </Switch>
          </Layout.Content>
        </Layout>
      </Router>
    </>
  );
}
