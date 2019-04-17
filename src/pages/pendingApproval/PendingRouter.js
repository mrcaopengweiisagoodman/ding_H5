import { Route } from 'react-keeper';
import PageApproval from './PendingApproval';

export default {
    page: PageApproval,
    route: () => (
        <div>
            <Route exact component={PageApproval} path= '/pageApproval' >

            </Route>
			
        </div>)
};
