import React from 'react';
import { Link } from 'react-router-dom';
import { getMe, User } from '../api/users';

const Intro = () => {
  return (
    <article className="Intro">
      <header>
        <h1 className="title">菠萝</h1>
        <p className="slogan">可口的次世代跑团工具</p>
        <p>
          <Link className="register" to="/register">
            注册
          </Link>
        </p>
        <p>
          已经菠萝菠萝哒了？
          <Link className="login" to="/login">
            点这里登录
          </Link>
          。
        </p>
      </header>
      <section className="features">
        <h2>为什么用菠萝？</h2>
        <ul>
          <li>为跑团（桌上RPG）特别打造。</li>
          <li>实时预览，让文字输入像当面说话一样。</li>
          <li>开放的源代码和 API。</li>
          <li>即将到来的变量系统、回合指示器、战斗地图…</li>
        </ul>
      </section>
    </article>
  );
};

const LoggedIn = ({ user }: { user: User }) => {
  return (
    <article className="LoggedIn">
      <h1 className="title">菠萝</h1>
      <p>
        {user.nickname}（<Link to="/logout">登出</Link>），欢迎回来。
      </p>
    </article>
  );
};

export const HomePage = () => {
  const me = getMe();

  return (
    <main className="HomePage">
      {me === null ? <Intro /> : <LoggedIn user={me} />}
      <section className="features">
        <h2>为什么用菠萝？</h2>
        <ul>
          <li>为跑团（桌上RPG）特别打造。</li>
          <li>实时预览，让文字输入像当面说话一样。</li>
          <li>开放的源代码和 API。</li>
          <li>即将到来的变量系统、回合指示器、战斗地图…</li>
        </ul>
      </section>
      <section className="spaces">
        <h2>可达的位面</h2>
        <p>位面是组织你们的冒险的地方，如果要开始自己的冒险，请注册后加入或者创造自己的位面。</p>
      </section>
    </main>
  );
};
