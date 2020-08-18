// @ts-nocheck

import React, { useEffect , useState} from "react";
import { useLocation, useHistory } from "react-router-dom";
import PPPSection from './PayrollProtectionProgramSection'
import EIDLProgramSection from './EconomicInjuryDisasterLoanProgramSection'
import StatePrograms from './StatePrograms'
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./new_Sidebar";
import Tabsbar from "./new_Tabsbar";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./new_results.scss";
import "./index.scss";

const allNationalPrograms = [
  {
    id: 'ppp',
    name: 'Payroll Protection Plan', 
  },
  {
    id: 'eidl',
    name: 'Economic Injury Disaster Loan Program', 
  },
]

const allStatePrograms = [
  {
    id: 'sba',
    name: 'Small Business Debt Relief Program',
    what: 'If your organization has an SBA loan, SBA will cover all payments for six months.',
    who: 'Small businesses with non-disaster SBA loans.',
    url: 'https://www.sba.gov/funding-programs/loans/coronavirus-relief-options/sba-debt-relief',
    status: 'Available Now'
  },
  {
    id: 'ca_small_biz',
    name: 'California Small Business Finance Center',
    what: 'Loan guarantees for small businesses',
    who: 'California small businesses. Loan proceeds can be used for business continuance or to cure "economic injury" as a result of the COVID-19 pandemic.',
    url: 'https://ibank.ca.gov/small-business-finance-center/',
    status: 'Available Now'
  },
  {
    id: 'pitt_elf',
    name: 'Pittsburgh Small Business Emergency Loan Fund',
    what: 'Loans up to $15,000 with 0% interest offered by the Urban Redevelopment Authority.',
    who: 'Small businesses located in Pittsburgh with fewer than 30 full-time employees.',
    url: 'https://www.ura.org/pages/covid-19-small-business-fund',
    status: 'Available Now'
  },
  {
    id: 'pitt_ura',
    name: 'Urban Redevelopment Authority of Pittsburgh Recovery Loan',
    what: 'Loans up to $75,000 with 0% interest for the first year and 2% for the balance of loan term.',
    who: 'Small businesses located in Pittsburgh with fewer than 30 full-time employees.',
    url: 'https://www.ura.org/pages/covid-19-small-business-fund',
    status: 'Available Now'
  },
  {
    id: 'pitt_bridgeway',
    name: 'Bridgeway Capital Response Fund',
    what: 'Connecting small businesses in western Pennsylvania to capital when it is needed most.',
    who: 'Small businesses in western Pennsylvania.',
    url: 'https://www.bridgewaycapital.org/loans-and-modifications/covid-19-response-fund/',
    status: 'Available Now'
  },
  {
    id: 'pitt_kiva',
    name: 'Kiva Pittsburgh Loans',
    what: 'Kiva helps financially excluded and socially impactful entrepreneurs access capital via crowdfunding.',
    who: 'Small businesses located in the surrounding areas around Pittsburgh.',
    url: 'https://www.riversidecenterforinnovation.com/kiva/home',
    status: 'Available Now'
  },
  {
    id: 'pitt_honeycomb',
    name: 'Honeycomb Small Business Relief Loan',
    what: 'Honeycomb Crowdfunded Small Business Relief Loan.',
    who: 'Small businesses located in the surrounding areas around Pittsburgh.',
    url: 'https://www.honeycombcredit.com/relief',
    status: 'Available Now'
  },
  {
    id: 'hawaii_community',
    name: 'Hawaii Community-Based Economic Development Loan',
    what: 'CBED offers micro-loans usually up to $50,000 to eligible small businesses that support economic development in their communities.',
    who: '',
    url: 'https://invest.hawaii.gov/business/cbed/',
    status: 'Available Now'
  },
  {
    id: 'hawaii_small_business',
    name: 'Hawaii Small Business Relief & Recovery Fund',
    what: 'Small Business Relief & Recovery Fund offers a one-time reimbursement for expenses of up to $10,000.',
    who: 'Small businesses who have incurred costs from business interruption due to. Emergency Proclamations or costs to implement safety precautions to prevent the spread of COVID-19. Businesses must have less than 1 million in gross annual revenue and 30 or fewer employees. Businesses must also be located in the City and County of Honolulu.',
    url: 'https://www.oneoahu.org/small-business',
    status: 'Available Now'
  },
  {
    id: 'hawaii_manufacturing',
    name: 'Hawaii Manufacturing Assistance Program',
    what: 'HTDC’s Manufacturing Assistance Program Grant (MAP) offers Hawaii-based manufacturers up to a 20% reimbursement (up to $100,000) on qualified expenses to help Hawaii manufacturers become globally competitive.  Qualifying expenses include: equipment purchases, training, energy efficiency projects, and manufacturing feasibility studies.',
    who: 'Must conduct manufacturing activities in Hawaii and be categorized as NAICS 31, 32, 33.',
    url: 'https://www.htdc.org/money/#map',
    status: 'Available Now'
  },
  {
    id: 'hawaii_malama',
    name: 'Hawaii Malama Business Loan Program',
    what: 'This is the most popular loan the Office of Hawaiian Affairs offers that support Native Hawaiian Business owners with loans between $2,500 to $100,000.',
    who: 'Must be of Native Hawaiian ancestry with a credit score of 600 or higher with an income to debt ratio of no more than 45%.',
    url: 'https://loans.oha.org/business/malama-business/',
    status: 'Available Now'
  },
  {
    id: 'hawaii_hua',
    name: 'Hawaii Hua Kanu Business Loan Program',
    what: 'The Hua Kanu Business Loan Program is available to Native Hawaiians who own established business. Created on July 17, 2013, the low-cost loans are intended to help these small-businesses expand. It is meant to provide them access to credit and capital that will allow them to grow as well as remain financially viable. Loans between $200,000 to $1,000,000.',
    who: 'Principals must be Native Hawaiian and verified by current Office of Hawaiian Affairs Registry Card.',
    url: 'https://loans.oha.org/business/hua-kanu-business-loan/',
    status: 'Available Now'
  }
]

const Results: React.FC = () => {
  const { search } = useLocation();
  const history = useHistory();

  const [eligibleNationalPrograms, setEligibleNationalPrograms] = useState([]);
  const [eligibleStatePrograms, setEligibleStatePrograms] = useState([]);
  const [eligibleProgramIds, setEligibleProgramIds] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);

  const getEligiblePrograms = () => {
    // hacky port of raw js from previous results page, will redo with the new results page
    const eligibleProgramIds = new URLSearchParams(search).getAll("eligible")
    setEligibleStatePrograms(allStatePrograms.filter(stateProgram => eligibleProgramIds.includes(stateProgram.id)));
    setEligibleNationalPrograms(allNationalPrograms.filter(nationalProgram => eligibleProgramIds.includes(nationalProgram.id)));
    setEligibleProgramIds(eligibleProgramIds);
  }

  const updateDimensions = () => {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    setWindowWidth(windowWidth);
  }

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    getEligiblePrograms();
  }, []);

  const styles = {
    showFooterMenuText: windowWidth > 500,
    showSidebar: windowWidth > 768,
    sidebarWidth: windowWidth < 1100 ? 50 : 150,
    sidebarCollapsed: windowWidth < 1100
  };

  return (
    <div className="content-page">
    <Helmet>
      <meta property="og:title" content="COVID-19 SMB Loan Information" />
      <meta
        property="og:description"
        content="Learn about support programs available to help stabilize your business."
      />
      <title>COVID-19 SMB Loan Information</title>
      <meta
        name="Description"
        content="Learn about support programs available to help stabilize your business."
      />
    </Helmet>
    <Header/>
    <main>
      <div className="container">
      {styles.showSidebar ? 
          <div className="row">
            <div className="col-md-8 left">
              <h1 className="title-top">
                Your Recommendations
              </h1>
              <p>
                If you and your business have an existing relationship with a bank, contact your banker for more information about available relief programs. 
              </p>
              <a name="ppp"></a>
              {eligibleProgramIds.includes('ppp') && <PPPSection/>} 
              <a name="eidl"></a>
              {eligibleProgramIds.includes('eidl') && <EIDLProgramSection/>}
              <StatePrograms
                eligibleStatePrograms={eligibleStatePrograms}
              />
            </div>
            <div className="col-md-4">
              <Sidebar
                eligiblePrograms={eligibleNationalPrograms.concat(eligibleStatePrograms)}
              />
            </div>
          </div>
          :
          <div className="row mobile-container">
            <h1 className="title-top">
              Your Recommendations
            </h1>
            <p>
              If you and your business have an existing relationship with a bank, contact your banker for more information about available relief programs. 
            </p>
            <Tabsbar
              eligiblePrograms={eligibleNationalPrograms.concat(eligibleStatePrograms)}
            />
            <div data-spy="scroll" data-target="#mobile-tabsbar-container" data-offset="0">
              <a name="ppp"></a>
              {eligibleProgramIds.includes('ppp') && <PPPSection/>} 
              <a name="eidl"></a>
              {eligibleProgramIds.includes('eidl') && <EIDLProgramSection/>}
              <StatePrograms
                eligibleStatePrograms={eligibleStatePrograms}
              />
            </div>
          </div>
        }
      </div>
    </main>
    <Footer />
  </div>
  );
};

export default Results;