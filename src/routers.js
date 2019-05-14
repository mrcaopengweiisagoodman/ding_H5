import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-keeper'

import PageHome from 'pages/home/';
import Waitingapproval from 'pages/waitingapproval/';
import Audit from 'pages/audit/';
import Auditapprove from 'pages/auditapprove/';
import Addauditapprove from 'pages/addauditapprove/';
import Detailauditapprove from 'pages/detailauditapprove/';
import Auditcontract from 'pages/auditcontract/';
import Contract from 'pages/contract/';
import Contractsearch from 'pages/contractsearch/';
import AddContract from 'pages/addcontract/';
import AddContractRelation from 'pages/addcontractrelation/';
import Detailcontract from 'pages/detailcontract/';
import Detailcontractsub from 'pages/detailcontractsub/';
import Tendering from 'pages/tendering/';
import AddTendering from 'pages/addtendering/';
import Detailtendering from 'pages/detailtendering/';
import Deptcontractlists from 'pages/deptcontractlists/';

const rootRoute =
    <HashRouter>
		<div>
			<PageHome.route />
			<Waitingapproval.route />
			<Audit.route />
			<Auditapprove.route />
			<Addauditapprove.route />
			<Detailauditapprove.route />
			<Auditcontract.route />
			<Contract.route />
			<Contractsearch.route />
			<AddContract.route />
			<AddContractRelation.route />
			<Detailcontract.route />
			<Detailcontractsub.route />
			<Tendering.route />
			<AddTendering.route />
			<Detailtendering.route />
			<Deptcontractlists.route />
		</div>
    </HashRouter>;

ReactDOM.render( rootRoute, document.getElementById('App') );
