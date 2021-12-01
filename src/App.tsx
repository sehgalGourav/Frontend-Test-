import React, { useState, useEffect } from "react";

import "./assets/styles/App.scss";
const axios = require("axios");

const App = () => {

  const [users, setUsersData] = useState<any>([]);
  const [isAllChecked, setIsAllCheckedData] = useState<any>(false);
  const [tags, setTagsData] = useState<any>([]);
  // const [searchFilter, setSearchFilterData] = useState<any>(false);



  // GET CONTACTS LISTS
  const getContacts = (authToken: any) => {
    axios
      .get("https://api-im.chatdaddy.tech/contacts?returnTotalCount=true&&count=10", {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      })
      .then((response: any) => {
        setUsersData(response.data.contacts);
      });
  }

  // SEARCH CONTACTS
  const searchContacts = (query: any) => {
    axios
      .get("https://api-im.chatdaddy.tech/contacts?q=" + query, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      })
      .then((response: any) => {
        setUsersData(response.data.contacts);
      });
  }

  // GET ALL TAGS 
  const getAllTags = (authToken: any) =>{
    axios
    .get("https://api-im.chatdaddy.tech/tags", {
      headers: {
        Authorization: "Bearer " + authToken,
      },
    })
    .then((response: any) => {
      setTagsData(response.data.tags);
    });
  }

  // SEARCH FILTERS 
  const searchFilters = (filter:any,type:string,reset:boolean) =>{

    let tagsType:string = 'tags'

    if(type === 'include'){
      tagsType = 'tags'
    }
    if(type === 'exclude'){
      tagsType = 'notTags'
    }

    if(!reset){
      // STORE FILTER STATE 
      // setSearchFilterData(filter)
      // GET USERS WITH TAGS 
      axios
      .get("https://api-im.chatdaddy.tech/contacts?"+tagsType+"="+filter, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken"),
        },
      })
      .then((response: any) => {
        setUsersData(response.data.contacts);
      });
    }
    if(reset){
      getContacts(localStorage.getItem("authToken"))
    }
  }

  useEffect(() => {
    // GET AUTH TOKEN
  const getAuthToken = () => {
    axios
      .post("https://api-teams.chatdaddy.tech/token", {
        refreshToken: "059c420e-7424-431f-b23b-af0ecabfe7b8",
        teamId: "a001994b-918b-4939-8518-3377732e4e88",
      })
      .then((response: any) => {
        // STORE AUTH TOKEN
        localStorage.setItem("authToken", response.data.access_token);
        // GET CONTACTS LISTS
        getContacts(response.data.access_token)
        getAllTags(response.data.access_token)
      })
  }
    getAuthToken();
  }, []);

  return (
    <div className="App">
      {/* SIDEBAR */}
      <div className="sidebar-container d-flex flex-column">
        <div className="w-100 d-flex flex-column flex-grow-1">
          <div className="sidebar-logo bg-light h6 d-flex justify-content-between align-items-center">
            <span className="font-14 d-flex justify-content-between align-items-center">
              Audience
            </span>
            <span className="font-10 d-flex justify-content-between align-items-center color-000-op-05">
              Contacts ({users.length})
            </span>
          </div>
          {/* GROUP FILTER */}
          <div className="group-filter mb-3">
            {/* FILTER HEADING */}
            <ul className="sidebar-navigation position-relative pl-4 mb-2">
              <li className="header font-weight-bold font-14">Include Tags:</li>
            </ul>
            {/* FILTERS */}
            <ul className="sidebar-navigation pl-3">
              {/* FILTER */}
              {tags.map((tag: any, i: any) => {
                 if(tag.name.length > 0)
                 return <li key={i} className="d-flex mb-2">
                 <label className="font-12 w-100 filter-tab px-2 py-2 rounded d-flex justify-content-between align-items-center" onClick={() => { searchFilters(tag.name,'include',false) }}>
                   <span className="text-capitalize">{tag.name}</span>
                   <span className="d-flex align-items-center">
                     <div className="custom-check-box">
                       <input type="radio" name="filter" />
                       <label></label>
                     </div>
                   </span>
                 </label>
               </li>
               return true
              })}
              {/* FILTER */}
            </ul>
          </div>
          {/* GROUP FILTER */}
          {/* GROUP FILTER */}
          <div className="group-filter mb-3">
            {/* FILTER HEADING */}
            <ul className="sidebar-navigation pl-4 mb-2">
              <li className="header font-weight-bold font-14">Exclude Tags:</li>
            </ul>
            {/* FILTERS */}
            <ul className="sidebar-navigation pl-3">
             {/* FILTER */}
             {tags.map((tag: any, i: any) => {
                 if(tag.name.length > 0)
                 return <li key={i} className="d-flex mb-2">
                 <label className="font-12 w-100 filter-tab px-2 py-2 rounded d-flex justify-content-between align-items-center" onClick={() => { searchFilters(tag.name,'exclude',false) }}>
                   <span className="text-capitalize">{tag.name}</span>
                   <span className="d-flex align-items-center">
                     <div className="custom-check-box">
                       <input type="radio" name="filter" />
                       <label></label>
                     </div>
                   </span>
                 </label>
               </li>
               return true
              })}
              {/* FILTER */}
            </ul>
          </div>
          {/* GROUP FILTER */}
        </div>

        {/* SAVE BTN */}
        <div className="position-relative my-3">
          <div className="col-12 px-2">
            <button className="btn btn-success bg-success w-100 font-12 border-r-10" onClick={() => { searchFilters('reset_filter','reset',true) }}>
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      {/* SIDEBAR END */}

      {/* CONTENT CONTAINER */}
      <div className="content-container">
        <div className="container">
          {/* HEADING CONTAINER */}
          <div className="row mb-2">
            <div className="col-12 d-flex justify-content-between">
              <h6 className="">All Contacts ({users.length}) {isAllChecked}</h6>
              <span className="text-white rounded-circle w-30px h-30px cursor-pointer d-flex justify-content-center align-items-center bg-success">
                +
              </span>
            </div>
          </div>
          {/* HEADING CONTAINER END */}

          {/* SEARCH ROW START */}
          <div className="w-100">
            <div className="row mb-3">
              <div className="col-12 mx-auto">
                <div className="rounded">
                  {/* FORM CONTAINER */}
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="p-1 bg-f3f5f9 rounded rounded-pill mb-0">
                      <div className="input-group">
                        {/* BTN CONTAINER */}
                        <div className="input-group-prepend pointer-click-none">
                          <button
                            id="button-addon2"
                            type="button"
                            className="btn btn-link text-warning"
                          >
                            {/* ICON CONTAINER */}
                            <span className="icon-container">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="rgba(0, 0, 0, 0.5)"
                                className="bi bi-search"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                              </svg>
                            </span>
                            {/* ICON CONTAINER */}
                          </button>
                        </div>
                        {/* INPUT CONTAINER */}
                        <input
                          type="search"
                          placeholder="Search Contacts"
                          aria-describedby="button-addon2"
                          className="form-control border-0 bg-f3f5f9 font-12"
                          onChange={(e) => {
                            if (e.target.value.toLowerCase().length > 2) {
                              searchContacts(e.target.value.toLowerCase());
                            }
                            if (e.target.value.toLowerCase().length === 0) {
                              searchContacts(e.target.value.toLowerCase());
                            }
                          }}
                        />
                      </div>
                    </div>
                  </form>
                  {/* FORM CONTAINER */}
                </div>
              </div>
              {/* CONTAINER END */}
            </div>
          </div>
          {/* SEARCH ROW END */}

          {/* SELECT ALL CONTAINER */}
          <div className="row mb-2">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <label className="d-flex align-items-center justify-content-center">
                  <span className="d-flex align-items-center">
                    <div className="select-all-tab custom-check-box">
                      <input
                        type="checkbox"
                        name="filter[]"
                        onChange={(e) => {
                          if (isAllChecked === true) {
                            setIsAllCheckedData(false);
                          }
                          if (isAllChecked === false) {
                            setIsAllCheckedData(true);
                          }
                        }}
                        checked={isAllChecked}
                      />
                      <label></label>
                    </div>
                  </span>
                  <span className="font-14 mx-2 d-flex align-items-center">
                    Select All
                  </span>
                </label>
              </h6>
              <span>
                <button className="btn btn-success bg-success border-r-10 font-12">
                  Export All
                </button>
              </span>
            </div>
          </div>
          {/* SELECT ALL CONTAINER END */}

          {/* USERS CONTAINER */}
          <div className="col-12">
            <div className="row mb-2 d-none">
              <div className="col-12 d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <div className="d-flex align-items-center">
                    <span className="font-14 d-flex align-items-center">A</span>
                  </div>
                </h6>
              </div>
            </div>
            {/* USER ROW {LOOP} */}
            {/* USER */}
            {users.map((user: any, i: any) => (
              <div className="row mb-2" key={i}>
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <label className="d-flex align-items-center justify-content-center">
                      <span className="d-flex align-items-center">
                        <div className="select-all-tab custom-check-box">
                          <input
                            type="checkbox"
                            name="filter[]"
                            checked={isAllChecked}
                          />
                          <label></label>
                        </div>
                      </span>
                      {/* USER DATA ROW */}
                      <div className="w-100 d-flex mx-3">
                        {/* IMAGE */}
                        <div className="d-flex">
                          <img
                            className="rounded-circle w-50px h-50px"
                            src="https://picsum.photos/50/50"
                            alt=""
                          />
                        </div>
                        {/* DETAIL */}
                        <div className="d-flex flex-column mx-3 justify-content-center">
                          {/* NAME */}
                          <p className="text-dark font-14 font-weight-bold mb-0">
                            {user.name}
                          </p>
                          <p className="mb-0">
                            <a
                              className="font-12 text-decoration-none color-000-op-05"
                              href="tel:+658976564534"
                            >
                              {user.phoneNumber}
                            </a>
                          </p>
                        </div>
                      </div>
                    </label>
                  </h6>
                  <span className="d-flex">
                    <span className="d-flex mx-1"> 
                    {user.tags.map((tag: any, i: any) => (
                      <span key={i} className="bg-success text-white border-r-30 cursor-pointer d-flex justify-content-center align-items-center px-3 py-1 mx-1 font-12 text-capitalize">
                        {tag.name}
                      </span>
                    ))}
                    </span>
                    
                    <span className="bg-success text-white rounded-circle w-30px h-30px cursor-pointer d-flex justify-content-center align-items-center">
                      +
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* USERS CONTAINER END */}
        </div>
      </div>
      {/* CONTAINER END */}
    </div>
  );
}

export default App;
