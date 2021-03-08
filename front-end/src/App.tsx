import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React, { FC } from 'react';
import { Login } from './components/Login';
import { Layout, Menu } from 'antd';
import { Signup } from './components/Signup';
import { Home } from './pages/Home';

const { Header, Content } = Layout;

const App: FC = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['signup']}>
            <Menu.Item key="login"><Link to="/login">Login</Link></Menu.Item>
            <Menu.Item key="signup"><Link to="/signup">Signup</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
