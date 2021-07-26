import React, { useEffect, useState, useContext } from "react";
import { httpClient } from "../../../utils/HttpClient";
import { server } from "../../../Constatns";
import jwt_decode from "jwt-decode";
import { useParams, useHistory } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import "./Setting.css";

function Setting(props) {
  const [categoryList, setCategoryList] = useState([]);
  const [createCategory, setCreateCategory] = useState({
    language: null,
    created_by: null,
  });
  const [reload, setReload] = useState(false);
  const { forceUpdate } = useContext(AuthContext);
  const [pageSetting, setPageSetting] = useState(1);
  const [limitSetting, setLimitSetting] = useState(5);
  const [currentPage, setCurrentPage] = useState(null);
  const history = useHistory();

  useEffect(async () => {
    const result = await httpClient.post(server.GET_CATEGORYBYLIMIT_URL, {
      pageSetting,
      limitSetting,
    });
    setCategoryList(result.data.result);
    setCurrentPage(result.data);
    setReload(false);
    forceUpdate();
  }, [pageSetting, reload]);

  const pagination = () => {
    if (!currentPage) return;
    // console.log(currentPage);

    return (
      <ul className="pagination">
        {currentPage.after !== 0 && (
          <li className="page-item">
            <button
              className="page-link"
              href="#"
              aria-label="Previous"
              onClick={() => {
                setPageSetting(pageSetting - 1);
              }}
            >
              <span aria-hidden="true">«</span>
            </button>
          </li>
        )}

        {currentPage.after !== 0 && (
          <li className="page-item">
            <button
              className="btn btn-light"
              onClick={() => {
                setPageSetting(pageSetting - 1);
              }}
            >
              {currentPage.after}
            </button>
          </li>
        )}

        <li className="page-item">
          <button className="btn btn-primary" disabled={true}>
            {currentPage.now}
          </button>
        </li>

        {currentPage.next <= currentPage.countPage && (
          <li className="page-item">
            <button
              className="btn btn-light"
              onClick={() => {
                setPageSetting(pageSetting + 1);
              }}
            >
              {currentPage.next}
            </button>
          </li>
        )}

        {currentPage.next <= currentPage.countPage && (
          <li className="page-item">
            <button
              className="page-link"
              aria-label="Next"
              onClick={() => {
                setPageSetting(pageSetting + 1);
              }}
            >
              <span aria-hidden="true">»</span>
            </button>
          </li>
        )}
      </ul>
    );
  };

  const getShortId = () => {
    try {
      let token = localStorage.getItem("localID");
      let decoded = jwt_decode(token);
      let short_id = decoded.short_id;
      return short_id;
    } catch (err) {
      localStorage.clear();
    }
  };

  const category = () => {
    return categoryList.map((category) => {
      // console.log(category);
      return (
        <tr key={category.id}>
          <th scope="row">{category.id}</th>
          <td>{category.language}</td>
          <td> {category.created_at.split("T")[0]} </td>
          <td>{category.email}</td>
          <td>
            <p className="me-4 ms-4">
              <button className="btn btn-primary  w-100" onClick={() => {
                history.push(`edit-category/${category.id}`)
              }}>Edit</button>
            </p>
            <p
              className="me-4 ms-4"
              onClick={() => {
                httpClient.delete(
                  `${server.DELETE_CATEGORY_URL}/${category.id}`
                );
                setReload(true);
              }}
            >
              <button className="btn btn-danger w-100">Delete</button>
            </p>
          </td>
        </tr>
      );
    });
  };

  const handleCreateCategory = async (category) => {
    if (!category) return alert("Please Select");
    try {
      setReload(true);
      const result = await httpClient.post(
        server.CREATED_CATEGORY_URL,
        category
      );
    } catch (err) {
      localStorage.clear();
    }
  };

  return (
    <div className="container-fluid p-0 p-lg-5">
      <h1>Setting</h1>
      <hr />
      <div className="row p-0 m-0 justify-content-center">
        <div className="col col-auto col-lg-4 mb-3">
          <div className="container bg-light">
            <label className="mb-3 fs-4">Cretae Category</label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              onChange={(e) => {
                setCreateCategory({
                  language: e.target.value,
                  created_by: getShortId(),
                });
              }}
            />
            <button
              className="btn btn-primary mt-3 mb-3"
              onClick={() => {
                handleCreateCategory(createCategory);
              }}
            >
              Create Category
            </button>
          </div>
        </div>
        <div className="col col-auto col-lg-8 ">
          <div className="container bg-light border border-2 border-black">
            <h4 className="mt-2">Category List</h4>
            <hr />
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Language</th>
                    <th scope="col">Creted At</th>
                    <th scope="col">Created By</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>{category()}</tbody>
              </table>

              <div className="container mt-3">
                <nav aria-label="Page navigation example">{pagination()}</nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;