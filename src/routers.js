import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-keeper'

import PageHome from 'pages/home/';
import PendingApproval from 'pages/pendingApproval/';
import Audit from 'pages/audit/';
import Contract from 'pages/contract/';
import Tendering from 'pages/tendering/';
import AddTendering from 'pages/addtendering/';

const rootRoute =
    <HashRouter>
		<div>
			<PageHome.route />
			<PendingApproval.route />
			<Audit.route />
			<Contract.route />
			<Tendering.route />
			<AddTendering.route />
		</div>
    </HashRouter>;

ReactDOM.render( rootRoute, document.getElementById('App') );
