// @ts-nocheck

import React, { useEffect , useState} from "react";
import { useLocation, useHistory } from "react-router-dom";
import PPPSection from './PayrollProtectionProgramSection'
import EIDLProgramSection from './EconomicInjuryDisasterLoanProgramSection'
import StatePrograms from './StatePrograms'
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Tabsbar from "./Tabsbar";
import { Helmet } from "react-helmet";
import { useFormDictionary, useForm } from "~/contexts/form";

import "./results.scss";
import "./index.scss";

const allNationalPrograms = [
  // 'ppp',
  // 'eidl',
  // 'sba-debt'
];

const allStatePrograms = [
  'ca_small_biz',
  'pitt_elf',
  'pitt_ura',
  'pitt_bridgeway',
  'pitt_kiva',
  'pitt_honeycomb',
  'hawaii_community',
  'hawaii_small_business',
  'hawaii_manufacturing',
  'hawaii_malama',
  'hawaii_hua',
  'ca_services_la_verne',
  'ca_services_el_camino_college',
  'ca_services_san_diego_orange_and_imperial',
  'ca_services_la_regional_small_biz_development_center'
]

const Results: React.FC = () => {
  const { search } = useLocation();
  const history = useHistory();
  const [back, next, complete] = useFormDictionary("back", "next", "complete");
  const [windowWidth, setWindowWidth] = useState(0);

  const updateDimensions = () => {
    let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    setWindowWidth(windowWidth);
  }

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);

    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

OpenStreetMap_Mapnik.addTo(mymap);

  //   L.tileLayer('http://{s}.tile.cloudmade.com/e7b61e61295a44a5b319ca0bd3150890/997/256/{z}/{x}/{y}.png', {
  //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>',
  //     maxZoom: 18
  // }).addTo(mymap);

//     L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'your.mapbox.access.token'
// }).addTo(mymap);

  }, []);

  const styles = {
    showFooterMenuText: windowWidth > 500,
    showSidebar: windowWidth > 768,
    sidebarWidth: windowWidth < 1100 ? 50 : 150,
    sidebarCollapsed: windowWidth < 1100
  };

  const {
    form: { results },
  } = useForm();

  // hacky port of raw js from previous results page, will redo with the new results page
  const eligibleProgramIds = new URLSearchParams(search).getAll("eligible")
  const filteredStatePrograms = results.filter(program => (eligibleProgramIds.includes(program.id) && allStatePrograms.includes(program.id)))
  const filteredNationalPrograms = results.filter(program => eligibleProgramIds.includes(program.id) && allNationalPrograms.includes(program.id));

  
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
    <Header showLanguageSelect/>
    <main>
      <div className="container">
        <div className="row">
          <div className="col-md-8 left">
            <h1 className="title-top">
              {results.find(result => result.id === "page-title").recommendations}
            </h1>
            <p>
              {results.find(result => result.id === "instructions").relationship}
            </p>
            <div id="mapid"></div>
            {!styles.showSidebar && 
              <Tabsbar
                eligiblePrograms={filteredNationalPrograms.concat(filteredStatePrograms)}
              />
            }
            <StatePrograms
              eligibleStatePrograms={filteredStatePrograms}
            />
          </div>
          <div className="col-md-4">
            <Sidebar
              eligiblePrograms={filteredNationalPrograms.concat(filteredStatePrograms)}
            />
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
};

export default Results;