import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import { Book, Error, Event, FAQ, Login, MovieList, MovieExact, MyMovie, Mypage, Notice, NoticeExact, ProductPay, PointDescription, SignUp, Store, StoreExact, TheaterDescription, Main, AdultAuth } from '../../Pages/User';
import { Layout } from '../../Components';

const UserRouter : React.FC = () => (
	<Layout>
		<Switch>
			<Route exact path="/book" component={Book}/>
			<Route path="/event" component={Event}/>
			<Route path="/faq" component={FAQ}/>
			<Route path="/login" component={Login}/>
			<Route path="/main" component={Main}/>
			<Route exact path="/movie" component={MovieList}/>
			<Route exact path="/movie/search" component={MovieList}/>
			<Route path="/movie/:movie_id" component={MovieExact}/>
			<Route path="/mymovie" component={MyMovie}/>
			<Route path="/mypage" component={Mypage}/>
			<Route exact path="/notice" component={Notice}/>
			<Route path="/notice/:notice_id" component={NoticeExact}/>
			<Route path="/point" component={PointDescription}/>
			<Route path="/signup" component={SignUp}/>
			<Route exact path="/product" component={Store}/>
			<Route exact path="/product/pay" component={ProductPay}/>
			<Route path="/product/:prod_id" component={StoreExact}/>
			<Route path="/theater" component={TheaterDescription}/>
			<Route path="/adult/auth" component={AdultAuth}/>
			<Route path="/error" component={Error}/>
			<Redirect to="/main" />
		</Switch>
	</Layout>
);

export default UserRouter;
