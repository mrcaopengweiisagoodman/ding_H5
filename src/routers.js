import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-keeper'

import PageHome from 'pages/home/';
import PendingApproval from 'pages/pendingApproval/';
import Audit from 'pages/audit/';
import Auditapprove from 'pages/auditapprove/';
import Auditcontract from 'pages/auditcontract/';
import Contract from 'pages/contract/';
import AddContract from 'pages/addcontract/';
import AddContractRelation from 'pages/addcontractrelation/';
import Detailcontract from 'pages/detailcontract/';
import Tendering from 'pages/tendering/';
import AddTendering from 'pages/addtendering/';
import Detailtendering from 'pages/detailtendering/';

const rootRoute =
    <HashRouter>
		<div>
			<PageHome.route />
			<PendingApproval.route />
			<Audit.route />
			<Auditapprove.route />
			<Auditcontract.route />
			<Contract.route />
			<AddContract.route />
			<AddContractRelation.route />
			<Detailcontract.route />
			<Tendering.route />
			<AddTendering.route />
			<Detailtendering.route />
		</div>
    </HashRouter>;

ReactDOM.render( rootRoute, document.getElementById('App') );
