import { useEffect, useState } from "react";
const Users = (props) => {
  const [listUsers, setListUsers] = useState([]);
  // useEffect(() => {
  //   fetchUsers();
  // }, []);
  // const fetchUsers = async () => {
  //   let res = await fetchAllUsers();
  //   if (res && res.data && res.data.EC === 1) {
  //     setListUsers(res.data.DT);
  //   }
  // };
  return (
    <>
      <div className="user-header">
        <div className="h1 text-center text-primary m-3">Manage User</div>
        <div className="container">
          <div className="d-flex gap-3">
            <span>
              {" "}
              <button className="btn btn-primary">
                {" "}
                <span className="me-2">
                  <i className="fa-solid fa-rotate "></i>
                </span>
                Refresh
              </button>
            </span>
            <span>
              {" "}
              <button className="btn btn-primary">
                {" "}
                <span className="me-2">
                  <i className="fa-solid fa-user-plus"></i>
                </span>
                Add new user
              </button>
            </span>
          </div>
          <div className="row">
            <div className="col-12">
              <table className="table table-bordered table-hover mt-4">
                <thead>
                  <tr className="table-info">
                    <th scope="col">Id</th>
                    <th scope="col">Email</th>
                    <th scope="col">User name</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Gender</th>
                    <th scope="col">Group</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listUsers && listUsers.length > 0 ? (
                    <>

                      <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                        <td>
                          {" "}
                          <div className="d-flex gap-3">
                            <span>
                              {" "}
                              <button className="btn btn-warning">
                                {" "}
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                            </span>
                            <span>
                              {" "}
                              <button className="btn btn-danger">
                                {" "}
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </span>
                          </div>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td colSpan={7} className="text-center">
                          No list user
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Users;
