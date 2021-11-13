import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import https from 'https';

export function switchSpinnerState () {
    let newState = { ...this.state };
    newState.spinner = !this.state.spinner;

    this.setState(newState);
}

export function renderSpinner () {
    if (this.state.spinner === true) {
      return (
        <div className="ui center aligned container">
            <CircularProgress color="secondary" />
        </div>
      )
    }

    return '';
}

export function switchStateField (fieldNames, fieldValues) {
  let newState = { ...this.state };

  fieldNames.forEach((item, idx) => {
    newState[item] = fieldValues[idx];
  });

  this.setState(newState);
}

export function fetchSMAXData ( fetchParams ) {
  const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
  });

  let url = `https://${fetchParams.thost}:${fetchParams.tport}/rest/${fetchParams.tid}/ems/${fetchParams.objType}?layout=${fetchParams.layout}`;
  if (fetchParams.filter !== null) {
      url += `&filter=${fetchParams.filter}`;
  }

  return instance.get(url,
      { headers: {
          "Content-Type": "application/json",
          "User-Agent": "Apache-HttpClient/4.1",
          "Cookie": `TENANTID=${fetchParams.tid}`,
          "Cookie": `SMAX_AUTH_TOKEN=${fetchParams.token}`
      } }
  ).then( response => {
      return response.data;
  }).catch( err => {
    console.log(`ERROR fetching data: `);
    console.log(fetchParams);
    return null;
  });
}

export async function postSMAXData ( postParams ) {

  const url = `https://${postParams.thost}:${postParams.tport}/rest/${postParams.tid}/ems/bulk`;
  const data = postParams.body;
  let res = await axios.post(
    url,
    data,
    {
      withCredentials: true,
      headers: {
          "Content-Type": "application/json"
        }
    }
  )
  
  return res;
  // .then(response => {
  //       console.log('saved');
  //       dispatch({ status: 'OK', data: response.data });
  //   })
  // .catch(function (error) {
  //   console.log(error);
  //   return { status: 'ERROR' };
  // })
}
